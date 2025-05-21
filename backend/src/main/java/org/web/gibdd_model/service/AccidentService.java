package org.web.gibdd_model.service;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.web.gibdd_model.dto.*;
import org.web.gibdd_model.model.Accident;
import org.web.gibdd_model.model.AccidentParticipant;
import org.web.gibdd_model.model.Vehicle;
import org.web.gibdd_model.model.Owner;
import java.util.ArrayList;

import org.web.gibdd_model.model.enums.AccidentRole;
import org.web.gibdd_model.model.enums.AccidentType;
import org.web.gibdd_model.repository.AccidentRepository;
import org.web.gibdd_model.repository.VehicleRepository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AccidentService {

    @Autowired
    private AccidentRepository accidentRepository;

    @Autowired
    private VehicleRepository vehicleRepository;


    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public Page<Accident> getAccidents(LocalDate dateFrom, LocalDate dateTo, String type, Pageable pageable) {
        if (dateFrom != null && dateTo != null && type != null && !type.isEmpty()) {
            return accidentRepository.findByDateBetweenAndType(dateFrom, dateTo, type, pageable);
        } else if (dateFrom != null && dateTo != null) {
            return accidentRepository.findByDateBetween(dateFrom, dateTo, pageable);
        } else if (type != null && !type.isEmpty()) {
            return accidentRepository.findByType(type, pageable);
        }
        return accidentRepository.findAll(pageable);
    }

    @Transactional
    public Accident createAccident(CreateAccidentDTO dto) {
        // Create point from coordinates
        Point location = geometryFactory.createPoint(
            new Coordinate(dto.getLocation().getLng(), dto.getLocation().getLat())
        );

        // Create and save accident
        Accident accident = new Accident();
        accident.setDate(dto.getDate());
        accident.setLocation(location);
        accident.setType(dto.getType());
        accident.setDescription(dto.getDescription());
        accident.setVictimsCount(dto.getVictimsCount());
        accident.setDamageAmount(dto.getDamageAmount());
        accident.setCause(dto.getCause());
        accident.setRoadConditions(dto.getRoadConditions());
        
        accident = accidentRepository.save(accident);

        // Process participants
        if (dto.getParticipants() != null && !dto.getParticipants().isEmpty()) {
            for (CreateAccidentDTO.ParticipantDTO participantDTO : dto.getParticipants()) {
                Vehicle vehicle = vehicleRepository.findByLicensePlate(
                    participantDTO.getLicensePlate()
                );

                Owner owner = vehicle.getOwner();
                if (owner == null) {
                    throw new RuntimeException("Vehicle has no registered owner: " + participantDTO.getLicensePlate());
                }

                AccidentParticipant participant = new AccidentParticipant();
                participant.setAccident(accident);
                participant.setOwner(owner);
                participant.setRole(participantDTO.getRole());
                
            }
        }

        return accidentRepository.save(accident);
    }

    public Optional<Accident> getAccidentById(Long id) {
        return accidentRepository.findById(id);
    }

    public Optional<Accident> updateAccident(Long id, Accident accidentDetails) {
        return accidentRepository.findById(id).map(accident -> {
            accident.setDate(accidentDetails.getDate());
            accident.setLocation(accidentDetails.getLocation());
            accident.setType(accidentDetails.getType());
            accident.setDescription(accidentDetails.getDescription());
            accident.setVictimsCount(accidentDetails.getVictimsCount());
            accident.setDamageAmount(accidentDetails.getDamageAmount());
            accident.setCause(accidentDetails.getCause());
            accident.setRoadConditions(accidentDetails.getRoadConditions());
            return accidentRepository.save(accident);
        });
    }

    public boolean deleteAccident(Long id) {
        return accidentRepository.findById(id).map(accident -> {
            accidentRepository.delete(accident);
            return true;
        }).orElse(false);
    }

    public List<AccidentStatisticsDTO> getAccidentStatistics(LocalDate startDate, LocalDate endDate, AccidentType type) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date must not be null");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before or equal to end date");
        }

        List<Object[]> statistics;
        if (type != null) {
            statistics = accidentRepository.findByDateBetweenAndType(startDate, endDate, type.toString(), PageRequest.of(0, Integer.MAX_VALUE))
                    .stream()
                    .filter(accident -> accident != null && accident.getType() != null)
                    .map(accident -> new Object[]{
                            accident.getType(),
                            1L,
                            accident.getDamageAmount() != null ? accident.getDamageAmount() : 0.0,
                            accident.getVictimsCount() != null ? accident.getVictimsCount() : 0
                    })
                    .collect(Collectors.toList());
        } else {
            statistics = accidentRepository.getAccidentStatistics(startDate, endDate);
        }

        if (statistics == null || statistics.isEmpty()) {
            return new ArrayList<>();
        }

        try {
            return statistics.stream()
                    .filter(row -> row != null && row[0] != null)
                    .collect(Collectors.groupingBy(
                            row -> AccidentType.valueOf(row[0].toString()),
                            Collectors.collectingAndThen(
                                    Collectors.toList(),
                                    list -> {
                                        long count = list.size();
                                        double avgDamage = list.stream()
                                                .mapToDouble(row -> row[2] != null ? ((Number) row[2]).doubleValue() : 0.0)
                                                .average()
                                                .orElse(0.0);
                                        int totalVictims = list.stream()
                                                .mapToInt(row -> row[3] != null ? ((Number) row[3]).intValue() : 0)
                                                .sum();
                                        return new AccidentStatisticsDTO(
                                                AccidentType.valueOf(list.get(0)[0].toString()),
                                                count,
                                                avgDamage,
                                                totalVictims
                                        );
                                    }
                            )
                    ))
                    .values()
                    .stream()
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Error processing accident statistics: Invalid accident type", e);
        }
    }

    public AccidentAnalysisDTO getAccidentAnalysis() {
        AccidentAnalysisDTO analysis = new AccidentAnalysisDTO();

        try {
            // Get dangerous locations
            List<Object[]> dangerousLocationsData = accidentRepository.getDangerousLocations();
            if (dangerousLocationsData == null) {
                dangerousLocationsData = new ArrayList<>();
            }
            
            List<AccidentAnalysisDTO.DangerousLocationDTO> dangerousLocations = dangerousLocationsData.stream()
                    .filter(row -> row != null && row[0] != null)
                    .map(row -> {
                        AccidentAnalysisDTO.DangerousLocationDTO location = new AccidentAnalysisDTO.DangerousLocationDTO();
                        Point point = (Point) row[0];
                        location.setLatitude(point.getY()); // Latitude is Y coordinate
                        location.setLongitude(point.getX()); // Longitude is X coordinate
                        location.setAccidentCount(row[1] != null ? ((Number) row[1]).longValue() : 0L);
                        location.setAverageDamage(row[2] != null ? ((Number) row[2]).doubleValue() : 0.0);
                        location.setTotalVictims(row[3] != null ? ((Number) row[3]).intValue() : 0);
                        return location;
                    })
                    .collect(Collectors.toList());
            analysis.setDangerousLocations(dangerousLocations);

            // Get most frequent cause
            List<Object[]> causeData = accidentRepository.getMostFrequentCauseOfAccidents();
            if (!causeData.isEmpty() && causeData.get(0) != null && causeData.get(0)[0] != null) {
                Object[] mostFrequentCause = causeData.get(0); // Get the first (most frequent) cause
                AccidentAnalysisDTO.CauseAnalysisDTO causeAnalysis = new AccidentAnalysisDTO.CauseAnalysisDTO();
                causeAnalysis.setCause((String) mostFrequentCause[0]);
                causeAnalysis.setAccidentCount(((Number) mostFrequentCause[1]).longValue());
                
                // Calculate percentage
                long totalAccidents = accidentRepository.count();
                if (totalAccidents > 0) {
                    double percentage = (causeAnalysis.getAccidentCount() * 100.0) / totalAccidents;
                    causeAnalysis.setPercentageOfTotal(percentage);
                } else {
                    causeAnalysis.setPercentageOfTotal(0.0);
                }
                
                analysis.setMostFrequentCause(causeAnalysis);
            }

            return analysis;
        } catch (Exception e) {
            throw new RuntimeException("Error processing accident analysis data", e);
        }
    }

    public DrunkDrivingStatsDTO getDrunkDrivingStatistics() {
        try {
            List<Object[]> statsData = accidentRepository.getDrunkDrivingStatistics();
            if (statsData != null && !statsData.isEmpty() && statsData.get(0) != null) {
                Object[] stats = statsData.get(0);
                DrunkDrivingStatsDTO dto = new DrunkDrivingStatsDTO();
                dto.setTotalAccidents(stats[0] != null ? ((Number) stats[0]).longValue() : 0L);
                dto.setDrunkDrivingAccidents(stats[1] != null ? ((Number) stats[1]).longValue() : 0L);
                dto.setDrunkDrivingPercentage(stats[2] != null ? ((Number) stats[2]).doubleValue() : 0.0);
                dto.setAverageDamageAmount(stats[3] != null ? ((Number) stats[3]).doubleValue() : 0.0);
                dto.setTotalVictims(stats[4] != null ? ((Number) stats[4]).intValue() : 0);
                return dto;
            }
            return new DrunkDrivingStatsDTO();
        } catch (Exception e) {
            throw new RuntimeException("Error processing drunk driving statistics", e);
        }
    }

    public Collection<Object> getAccidentTypes() {
        return List.of(Stream.of(AccidentType.values())
                .map(AccidentType::getDescription)
                .toArray(String[]::new));
    }

    public Collection<Object> getAccidentRoles() {
        return List.of(Stream.of(AccidentRole.values())
                .map(AccidentRole::getDescription)
                .toArray(String[]::new));
    }
}
