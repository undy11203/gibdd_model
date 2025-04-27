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
import org.web.gibdd_model.model.enums.AccidentType;
import org.web.gibdd_model.repository.AccidentRepository;
import org.web.gibdd_model.repository.VehicleRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
                Vehicle vehicle = vehicleRepository.findByLicensePlateLicenseNumber(
                    participantDTO.getLicensePlate()
                ).orElseThrow(() -> new RuntimeException("Vehicle not found with license plate: " + 
                    participantDTO.getLicensePlate()));

                AccidentParticipant participant = new AccidentParticipant();
                participant.setAccident(accident);
                participant.setVehicle(vehicle);
                participant.setRole(participantDTO.getRole());
                
                accident.getParticipants().add(participant);
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
        List<Object[]> statistics;
        if (type != null) {
            statistics = accidentRepository.findByDateBetweenAndType(startDate, endDate, type.toString(), PageRequest.of(0, Integer.MAX_VALUE))
                    .stream()
                    .map(accident -> new Object[]{
                            accident.getType(),
                            1L,
                            accident.getDamageAmount(),
                            accident.getVictimsCount()
                    })
                    .collect(Collectors.toList());
        } else {
            statistics = accidentRepository.getAccidentStatistics(startDate, endDate);
        }

        return statistics.stream()
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
    }

    public AccidentAnalysisDTO getAccidentAnalysis() {
        AccidentAnalysisDTO analysis = new AccidentAnalysisDTO();

        // Get dangerous locations
        List<Object[]> dangerousLocationsData = accidentRepository.getDangerousLocations();
        List<AccidentAnalysisDTO.DangerousLocationDTO> dangerousLocations = dangerousLocationsData.stream()
                .map(row -> {
                    AccidentAnalysisDTO.DangerousLocationDTO location = new AccidentAnalysisDTO.DangerousLocationDTO();
                    Point point = (Point) row[0];
                    location.setLatitude(point.getY()); // Latitude is Y coordinate
                    location.setLongitude(point.getX()); // Longitude is X coordinate
                    location.setAccidentCount(((Number) row[1]).longValue());
                    location.setAverageDamage(((Number) row[2]).doubleValue());
                    location.setTotalVictims(((Number) row[3]).intValue());
                    return location;
                })
                .collect(Collectors.toList());
        analysis.setDangerousLocations(dangerousLocations);

        // Get most frequent cause
        List<Object[]> causeData = accidentRepository.getMostFrequentCauseOfAccidents();
        if (!causeData.isEmpty()) {
            Object[] mostFrequentCause = causeData.get(0); // Get the first (most frequent) cause
            AccidentAnalysisDTO.CauseAnalysisDTO causeAnalysis = new AccidentAnalysisDTO.CauseAnalysisDTO();
            causeAnalysis.setCause((String) mostFrequentCause[0]);
            causeAnalysis.setAccidentCount(((Number) mostFrequentCause[1]).longValue());
            
            // Calculate percentage
            long totalAccidents = accidentRepository.count();
            double percentage = (causeAnalysis.getAccidentCount() * 100.0) / totalAccidents;
            causeAnalysis.setPercentageOfTotal(percentage);
            
            analysis.setMostFrequentCause(causeAnalysis);
        }

        return analysis;
    }

    public DrunkDrivingStatsDTO getDrunkDrivingStatistics() {
        List<Object[]> statsData = accidentRepository.getDrunkDrivingStatistics();
        if (!statsData.isEmpty()) {
            Object[] stats = statsData.get(0);
            DrunkDrivingStatsDTO dto = new DrunkDrivingStatsDTO();
            dto.setTotalAccidents(((Number) stats[0]).longValue());
            dto.setDrunkDrivingAccidents(((Number) stats[1]).longValue());
            dto.setDrunkDrivingPercentage(((Number) stats[2]).doubleValue());
            dto.setAverageDamageAmount(((Number) stats[3]).doubleValue());
            dto.setTotalVictims(((Number) stats[4]).intValue());
            return dto;
        }
        return new DrunkDrivingStatsDTO();
    }
}
