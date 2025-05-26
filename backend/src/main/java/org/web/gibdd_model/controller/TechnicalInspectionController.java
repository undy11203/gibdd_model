package org.web.gibdd_model.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.dto.TechnicalInspectionDTO;
import org.web.gibdd_model.model.TechnicalInspection;
import org.web.gibdd_model.service.TechnicalInspectionService;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/inspections")
@RequiredArgsConstructor
public class TechnicalInspectionController {

    private final TechnicalInspectionService technicalInspectionService;

    @GetMapping
    public ResponseEntity<Page<TechnicalInspection>> getAllInspections(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Page<TechnicalInspection> inspections = technicalInspectionService.getAllInspections(PageRequest.of(page, limit));
        return ResponseEntity.ok(inspections);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TechnicalInspection> getInspectionById(@PathVariable Long id) {
        try {
            TechnicalInspection inspection = technicalInspectionService.getInspectionById(id);
            return ResponseEntity.ok(inspection);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<TechnicalInspection>> getInspectionsByOwnerId(@PathVariable Long ownerId) {
        List<TechnicalInspection> inspections = technicalInspectionService.getInspectionsByOwnerId(ownerId);
        return ResponseEntity.ok(inspections);
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<TechnicalInspection>> getInspectionsByVehicleId(@PathVariable Long vehicleId) {
        List<TechnicalInspection> inspections = technicalInspectionService.getInspectionsByVehicleId(vehicleId);
        return ResponseEntity.ok(inspections);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_INSPECTIONS')")
    public ResponseEntity<TechnicalInspection> createInspection(@RequestBody TechnicalInspectionDTO inspectionDTO) {
        try {
            TechnicalInspection createdInspection = technicalInspectionService.createInspection(inspectionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdInspection);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_INSPECTIONS')")
    public ResponseEntity<TechnicalInspection> updateInspection(
            @PathVariable Long id,
            @RequestBody TechnicalInspectionDTO inspectionDTO) {
        try {
            TechnicalInspection updatedInspection = technicalInspectionService.updateInspection(id, inspectionDTO);
            return ResponseEntity.ok(updatedInspection);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_INSPECTIONS')")
    public ResponseEntity<Void> deleteInspection(@PathVariable Long id) {
        try {
            technicalInspectionService.deleteInspection(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
