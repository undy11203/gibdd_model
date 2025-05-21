package org.web.gibdd_model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.web.gibdd_model.dto.WantedVehicleDTO;
import org.web.gibdd_model.dto.WantedVehicleStatsDTO;
import org.web.gibdd_model.model.WantedVehicle;
import org.web.gibdd_model.model.enums.WantedStatus;
import org.web.gibdd_model.repository.WantedVehicleRepository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class WantedService {

    @Autowired
    private WantedVehicleRepository wantedVehicleRepository;

    public Page<WantedVehicle> getAllWantedVehicles(String reason, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        // If we have both dates, use date range filtering
        if (startDate != null && endDate != null) {
            if (reason == null || reason.isEmpty()) {
                return wantedVehicleRepository.findAllWantedByDateRange(startDate, endDate, pageable);
            } else {
                return wantedVehicleRepository.findAllWantedByReasonAndDateRange(reason, startDate, endDate, pageable);
            }
        } 
        // Otherwise just filter by reason (or get all if reason is null)
        else {
            if (reason == null || reason.isEmpty()) {
                return wantedVehicleRepository.findAllWantedVehicles(pageable);
            }
            return wantedVehicleRepository.findAllWantedByReason(reason, pageable);
        }
    }

    public List<WantedVehicle> getHitAndRunVehicles() {
        return wantedVehicleRepository.findAllHitAndRun();
    }

    public List<WantedVehicle> getStolenVehicles() {
        return wantedVehicleRepository.findAllStolen();
    }

    public WantedVehicleStatsDTO getWantedVehicleStats() {
        List<Object[]> statsData = wantedVehicleRepository.getWantedVehicleStats();
        WantedVehicleStatsDTO dto = new WantedVehicleStatsDTO();
        
        if (!statsData.isEmpty()) {
            Object[] stats = statsData.get(0);
            
            // Handle potential null values
            dto.setTotalWantedVehicles(stats[0] != null ? ((Number) stats[0]).longValue() : 0L);
            dto.setFoundVehicles(stats[1] != null ? ((Number) stats[1]).longValue() : 0L);
            
            // Handle division by zero for percentage
            if (stats[2] != null) {
                dto.setFoundPercentage(((Number) stats[2]).doubleValue());
            } else {
                dto.setFoundPercentage(0.0);
            }
            
            dto.setHitAndRunCount(stats[3] != null ? ((Number) stats[3]).longValue() : 0L);
            dto.setStolenCount(stats[4] != null ? ((Number) stats[4]).longValue() : 0L);
            
            // Handle null for average search time
            Double avgSearchTime = stats[5] != null ? ((Number) stats[5]).doubleValue() : 0.0;
            dto.setAverageSearchTime(avgSearchTime);
        } else {
            // Set default values if no data is found
            dto.setTotalWantedVehicles(0L);
            dto.setFoundVehicles(0L);
            dto.setFoundPercentage(0.0);
            dto.setHitAndRunCount(0L);
            dto.setStolenCount(0L);
            dto.setAverageSearchTime(0.0);
        }
        
        return dto;
    }

    public List<WantedVehicle> getFoundVehiclesBetweenDates(LocalDate startDate, LocalDate endDate) {
        return wantedVehicleRepository.findAllFoundBetweenDates(startDate, endDate);
    }

    public WantedVehicle addToWanted(WantedVehicle wantedVehicle) {
        return wantedVehicleRepository.save(wantedVehicle);
    }

    public WantedVehicle markAsFound(Long id, LocalDate foundDate) {
        return wantedVehicleRepository.findById(id)
                .map(vehicle -> {
                    vehicle.setStatus(org.web.gibdd_model.model.enums.WantedStatus.FOUND);
                    // vehicle.setAddedDate(foundDate);
                    vehicle.setFoundDate(foundDate);
                    return wantedVehicleRepository.save(vehicle);
                })
                .orElseThrow(() -> new RuntimeException("Wanted vehicle not found with id: " + id));
    }

    public Collection<Object> getWantedVehicleStatus() {
        return List.of(Stream.of(WantedStatus.values())
                .map(WantedStatus::getDescription)
                .toArray(String[]::new));
    }
}
