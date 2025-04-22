
package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.model.Accident;
import org.web.gibdd_model.service.AccidentService;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/accidents")
public class AccidentController {

    @Autowired
    private AccidentService accidentService;

    @GetMapping
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
    public Accident createAccident(@RequestBody Accident accident) {
        return accidentService.createAccident(accident);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Accident> getAccidentById(@PathVariable Long id) {
        Optional<Accident> accident = accidentService.getAccidentById(id);
        return accident.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Accident> updateAccident(@PathVariable Long id, @RequestBody Accident accidentDetails) {
        Optional<Accident> updatedAccident = accidentService.updateAccident(id, accidentDetails);
        return updatedAccident.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteAccident(@PathVariable Long id) {
        boolean deleted = accidentService.deleteAccident(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
