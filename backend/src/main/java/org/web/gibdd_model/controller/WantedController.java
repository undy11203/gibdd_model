
package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.model.Theft;
import org.web.gibdd_model.service.TheftService;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/wanted")
public class WantedController {

    @Autowired
    private TheftService theftService;

    @GetMapping
    public Page<Theft> getThefts(
            @RequestParam(required = false) LocalDate dateFrom,
            @RequestParam(required = false) LocalDate dateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        return theftService.getThefts(dateFrom, dateTo, pageable);
    }

    @PostMapping
    public Theft createTheft(@RequestBody Theft theft) {
        return theftService.createTheft(theft);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Theft> getTheftById(@PathVariable Long id) {
        Optional<Theft> theft = theftService.getTheftById(id);
        return theft.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Theft> updateTheft(@PathVariable Long id, @RequestBody Theft theftDetails) {
        Optional<Theft> updatedTheft = theftService.updateTheft(id, theftDetails);
        return updatedTheft.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTheft(@PathVariable Long id) {
        boolean deleted = theftService.deleteTheft(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
