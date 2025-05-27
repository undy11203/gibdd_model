package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.web.gibdd_model.model.AlarmSystem;
import org.web.gibdd_model.repository.AlarmSystemRepository;
import org.web.gibdd_model.service.AlarmSystemService;

@RestController
@RequestMapping("/api/alarm-systems")
public class AlarmSystemController {

    private final AlarmSystemRepository alarmSystemRepository;

    @Autowired
    private final AlarmSystemService alarmSystemService;

    @Autowired
    public AlarmSystemController(AlarmSystemRepository alarmSystemRepository, AlarmSystemService alarmSystemService) {
        this.alarmSystemRepository = alarmSystemRepository;
        this.alarmSystemService = alarmSystemService;
    }

    @GetMapping
    @PreAuthorize("hasPermission('VIEW_VEHICLES', '')")
    public Page<AlarmSystem> getAlarmSystems(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        if (search == null) {
            return alarmSystemRepository.findAll(PageRequest.of(page, limit));
        }
        return alarmSystemRepository.findByNameContaining(search, PageRequest.of(page, limit));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasPermission('VIEW_VEHICLES', '')")
    public ResponseEntity<AlarmSystem> getAlarmSystemById(@PathVariable Integer id) {
        Optional<AlarmSystem> alarmSystem = alarmSystemRepository.findById(id);
        return alarmSystem
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasPermission('MANAGE_VEHICLES', '')")
    public ResponseEntity<AlarmSystem> createAlarmSystem(@RequestBody AlarmSystem alarmSystem) {
        if (alarmSystem.getId() != null) {
            return ResponseEntity.badRequest().build(); // ID должен быть null для создания
        }

        AlarmSystem savedAlarmSystem = alarmSystemRepository.save(alarmSystem);
        return ResponseEntity
                .ok()
                .body(savedAlarmSystem);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasPermission('MANAGE_VEHICLES', '')")
    public ResponseEntity<AlarmSystem> partialUpdateAlarmSystem(
            @PathVariable Integer id,
            @RequestBody AlarmSystem alarmSystemDetails) {

        return alarmSystemRepository.findById(id)
                .map(existingAlarmSystem -> {
                    // Обновляем только предоставленные поля
                    if (alarmSystemDetails.getName() != null) {
                        existingAlarmSystem.setName(alarmSystemDetails.getName());
                    }
                    if (alarmSystemDetails.getReliability() != null) {
                        existingAlarmSystem.setReliability(alarmSystemDetails.getReliability());
                    }

                    AlarmSystem updatedAlarmSystem = alarmSystemRepository.save(existingAlarmSystem);
                    return ResponseEntity.ok(updatedAlarmSystem);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasPermission('MANAGE_VEHICLES', '')")
    public ResponseEntity<Void> deleteAlarmSystem(@PathVariable Integer id) {
        return alarmSystemRepository.findById(id)
                .map(alarmSystem -> {
                    alarmSystemRepository.delete(alarmSystem);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reliable")
    @PreAuthorize("hasPermission('VIEW_VEHICLES', '')")
    public List<Object[]> getMostReliableAlarmSystems() {
        return alarmSystemRepository.getMostReliableAlarmSystems();
    }

    @GetMapping("/alarm-systems-reliable")
    @PreAuthorize("hasPermission('MANAGE_VEHICLES', '')")
    public ResponseEntity<Collection<Object>> getAlarmSystemsReliable() {
        return ResponseEntity.ok().body(alarmSystemService.getReliableAlarmSystems());
    }
}
