package org.web.gibdd_model.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.dto.WantedVehicleDTO;
import org.web.gibdd_model.dto.WantedVehicleStatsDTO;
import org.web.gibdd_model.model.Vehicle;
import org.web.gibdd_model.model.WantedVehicle;
import org.web.gibdd_model.model.enums.WantedStatus;
import org.web.gibdd_model.repository.VehicleRepository;
import org.web.gibdd_model.service.WantedService;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wanted")
public class WantedController {

    @Autowired
    private WantedService wantedService;
    
    @Autowired
    private VehicleRepository vehicleRepository;

    @PostMapping
    public ResponseEntity<WantedVehicle> addToWanted(@RequestBody WantedVehicleDTO wantedVehicleDTO) {
        // Convert DTO to entity
        WantedVehicle wantedVehicle = new WantedVehicle();

        // Find the vehicle by ID
        Vehicle vehicle = vehicleRepository.findById(wantedVehicleDTO.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + wantedVehicleDTO.getVehicleId()));

        // Set the properties from DTO to entity
        wantedVehicle.setVehicle(vehicle);
        wantedVehicle.setAddedDate(wantedVehicleDTO.getAddedDate());
        wantedVehicle.setReason(wantedVehicleDTO.getReason());
        wantedVehicle.setStatus(WantedStatus.fromDescription(wantedVehicleDTO.getStatus()));

        // Save the entity
        WantedVehicle saved = wantedService.addToWanted(wantedVehicle);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WantedVehicle> getWantedVehicleById(@PathVariable Long id) {
        WantedVehicle wantedVehicle = wantedService.getWantedVehicleById(id)
                .orElseThrow(() -> new RuntimeException("Wanted vehicle not found with id: " + id));
        return ResponseEntity.ok(wantedVehicle);
    }

    @GetMapping
    public Page<WantedVehicle> getAllWantedVehicles(
            @RequestParam(required = false) String reason,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return wantedService.getAllWantedVehicles(reason, startDate, endDate, pageable);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Optional<WantedVehicle>> updateWantedVehicle(@PathVariable Long id, @RequestBody WantedVehicleDTO wantedVehicleDTO) {
        Optional<WantedVehicle> updatedWantedVehicle = wantedService.updateWantedVehicle(id, wantedVehicleDTO);
        return ResponseEntity.ok(updatedWantedVehicle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWantedVehicle(@PathVariable Long id) {
        wantedService.deleteWantedVehicle(id);
        return ResponseEntity.noContent().build();
    }

//

//
    @GetMapping("/hit-and-run")
    public List<WantedVehicle> getHitAndRunVehicles() {
        return wantedService.getHitAndRunVehicles();
    }

//
    @GetMapping("/stolen")
    public List<WantedVehicle> getStolenVehicles() {
        return wantedService.getStolenVehicles();
    }

//
    @GetMapping("/stats")
    public ResponseEntity<WantedVehicleStatsDTO> getWantedVehicleStats() {
        WantedVehicleStatsDTO stats = wantedService.getWantedVehicleStats();
        return ResponseEntity.ok(stats);
    }

//
    @GetMapping("/found")
    public List<WantedVehicle> getFoundVehicles(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return wantedService.getFoundVehiclesBetweenDates(startDate, endDate);
    }

    //

//
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

    @GetMapping("/wanted-status")
    public ResponseEntity<Collection<Object>> getWantedVehicleStatus() {
        return ResponseEntity.ok().body(wantedService.getWantedVehicleStatus());
    }
}
