package org.web.gibdd_model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.web.gibdd_model.dto.WantedVehicleDTO;
import org.web.gibdd_model.dto.WantedVehicleStatsDTO;
import org.web.gibdd_model.model.WantedVehicle;
import org.web.gibdd_model.repository.WantedVehicleRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WantedService {

    @Autowired
    private WantedVehicleRepository wantedVehicleRepository;

    public Page<WantedVehicle> getAllWantedVehicles(String reason, Pageable pageable) {
        return wantedVehicleRepository.findAllWantedByReason(reason, pageable);
    }

    public List<WantedVehicle> getHitAndRunVehicles() {
        return wantedVehicleRepository.findAllHitAndRun();
    }

    public List<WantedVehicle> getStolenVehicles() {
        return wantedVehicleRepository.findAllStolen();
    }

    public WantedVehicleStatsDTO getWantedVehicleStats() {
        List<Object[]> statsData = wantedVehicleRepository.getWantedVehicleStats();
        if (!statsData.isEmpty()) {
            Object[] stats = statsData.get(0);
            WantedVehicleStatsDTO dto = new WantedVehicleStatsDTO();
            
            dto.setTotalWantedVehicles(((Number) stats[0]).longValue());
            dto.setFoundVehicles(((Number) stats[1]).longValue());
            dto.setFoundPercentage(((Number) stats[2]).doubleValue());
            dto.setHitAndRunCount(((Number) stats[3]).longValue());
            dto.setStolenCount(((Number) stats[4]).longValue());
            
            // Convert average search time from days to a more readable format
            Double avgSearchTime = stats[5] != null ? ((Number) stats[5]).doubleValue() : 0.0;
            dto.setAverageSearchTime(avgSearchTime);
            
            return dto;
        }
        return new WantedVehicleStatsDTO();
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
                    vehicle.setStatus("FOUND");
                    vehicle.setFoundDate(foundDate);
                    return wantedVehicleRepository.save(vehicle);
                })
                .orElseThrow(() -> new RuntimeException("Wanted vehicle not found with id: " + id));
    }
}
