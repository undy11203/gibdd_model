package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.dto.WantedVehicleStatsDTO;
import org.web.gibdd_model.model.WantedVehicle;
import org.web.gibdd_model.service.WantedService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/wanted")
public class WantedController {

    @Autowired
    private WantedService wantedService;

    @GetMapping
    public Page<WantedVehicle> getAllWantedVehicles(
            @RequestParam(required = false) String reason,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return wantedService.getAllWantedVehicles(reason, pageable);
    }

    @GetMapping("/hit-and-run")
    public List<WantedVehicle> getHitAndRunVehicles() {
        return wantedService.getHitAndRunVehicles();
    }

    @GetMapping("/stolen")
    public List<WantedVehicle> getStolenVehicles() {
        return wantedService.getStolenVehicles();
    }

    @GetMapping("/stats")
    public ResponseEntity<WantedVehicleStatsDTO> getWantedVehicleStats() {
        WantedVehicleStatsDTO stats = wantedService.getWantedVehicleStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/found")
    public List<WantedVehicle> getFoundVehicles(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return wantedService.getFoundVehiclesBetweenDates(startDate, endDate);
    }

    @PostMapping
    public ResponseEntity<WantedVehicle> addToWanted(@RequestBody WantedVehicle wantedVehicle) {
        WantedVehicle saved = wantedService.addToWanted(wantedVehicle);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/found")
    public ResponseEntity<WantedVehicle> markAsFound(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate foundDate) {
        try {
            WantedVehicle updated = wantedService.markAsFound(id, foundDate);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
