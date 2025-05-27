package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.web.gibdd_model.dto.*;
import org.web.gibdd_model.model.Accident;
import org.web.gibdd_model.model.enums.AccidentType;
import org.web.gibdd_model.service.AccidentService;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accidents")
public class AccidentController {

    @Autowired
    private AccidentService accidentService;

    @GetMapping
    @PreAuthorize("hasPermission('VIEW_ACCIDENTS', '')")
    public Page<Accident> getAccidents(
            @RequestParam(required = false) LocalDate dateFrom,
            @RequestParam(required = false) LocalDate dateTo,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        return accidentService.getAccidents(dateFrom, dateTo, type, pageable);
    }

    @PostMapping
    @PreAuthorize("hasPermission('CREATE_ACCIDENTS', '')")
    public ResponseEntity<Accident> createAccident(@RequestBody CreateAccidentDTO createAccidentDTO) {
        try {
            Accident accident = accidentService.createAccident(createAccidentDTO);
            return ResponseEntity.ok(accident);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasPermission('VIEW_ACCIDENTS', '')")
    public ResponseEntity<Accident> getAccidentById(@PathVariable Long id) {
        Optional<Accident> accident = accidentService.getAccidentById(id);
        return accident.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasPermission('CREATE_ACCIDENTS', '')")
    public ResponseEntity<Accident> updateAccident(@PathVariable Long id, @RequestBody Accident accidentDetails) {
        Optional<Accident> updatedAccident = accidentService.updateAccident(id, accidentDetails);
        return updatedAccident.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasPermission('CREATE_ACCIDENTS', '')")
    public ResponseEntity<Object> deleteAccident(@PathVariable Long id) {
        boolean deleted = accidentService.deleteAccident(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasPermission('VIEW_ACCIDENTS', '')")
    public ResponseEntity<List<AccidentStatisticsDTO>> getAccidentStatistics(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            @RequestParam(required = false) String type) {
        List<AccidentStatisticsDTO> statistics = accidentService.getAccidentStatistics(startDate, endDate, AccidentType.fromDescription(type));
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/analysis")
    @PreAuthorize("hasPermission('VIEW_ACCIDENTS', '')")
    public ResponseEntity<AccidentAnalysisDTO> getAccidentAnalysis() {
        AccidentAnalysisDTO analysis = accidentService.getAccidentAnalysis();
        return ResponseEntity.ok(analysis);
    }

    @GetMapping("/drunk-driving-stats")
    @PreAuthorize("hasPermission('VIEW_ACCIDENTS', '')")
    public ResponseEntity<DrunkDrivingStatsDTO> getDrunkDrivingStatistics() {
        DrunkDrivingStatsDTO stats = accidentService.getDrunkDrivingStatistics();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/accident-types")
    @PreAuthorize("hasPermission('VIEW_ACCIDENTS', '')")
    public ResponseEntity<Collection<Object>> getAccidentTypes() {
        if (accidentService.getAccidentTypes().isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(accidentService.getAccidentTypes());
        }
    }

    @GetMapping("/accident-roles")
    @PreAuthorize("hasPermission('VIEW_ACCIDENTS', '')")
    public ResponseEntity<Collection<Object>> getAccidentRoles() {
        return ResponseEntity.ok(accidentService.getAccidentRoles());
    }

}
