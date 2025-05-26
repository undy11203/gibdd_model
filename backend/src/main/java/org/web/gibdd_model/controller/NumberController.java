package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.model.FreeLicensePlateRange;
import org.web.gibdd_model.model.FreeLicensePlateRangePK;
import org.web.gibdd_model.model.LicensePlate;
import org.web.gibdd_model.repository.FreeLicensePlateRangeRepository;
import org.web.gibdd_model.repository.LicensePlateRepository;
import org.web.gibdd_model.service.LicensePlateService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/license-plates")
public class NumberController {

    @Autowired
    private LicensePlateService licensePlateService;

    @Autowired
    private LicensePlateRepository licensePlateRepository;
    
    @Autowired
    private FreeLicensePlateRangeRepository freeLicensePlateRangeRepository;

    @GetMapping("/validate/{licenseNumber}")
    public ResponseEntity<Object> validateLicensePlate(@PathVariable String licenseNumber) {
        boolean isValid = licensePlateService.validateLicensePlateFormat(licenseNumber);
        
        // Create a response object with isValid flag
        Map<String, Object> response = new HashMap<>();
        response.put("isValid", isValid);
        
        if (!isValid) {
            response.put("message", "Номерной знак недоступен или имеет неверный формат");
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/free")
    public ResponseEntity<Void> freeLicensePlate(@RequestParam String licenseNumber) {
        boolean success = licensePlateService.freeLicensePlate(licenseNumber);
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/hot")
    public ResponseEntity<List<LicensePlate>> getHotLicensePlates() {
        List<LicensePlate> hotPlates = licensePlateService.getHotLicensePlates();
        return ResponseEntity.ok(hotPlates);
    }
    
    // CRUD operations for FreeLicensePlateRange
    
    @GetMapping("/ranges")
    public ResponseEntity<List<FreeLicensePlateRange>> getAllRanges() {
        return ResponseEntity.ok(freeLicensePlateRangeRepository.findAll());
    }
    
    @GetMapping("/ranges/series/{series}")
    public ResponseEntity<List<FreeLicensePlateRange>> getRangesBySeries(@PathVariable String series) {
        List<FreeLicensePlateRange> ranges = freeLicensePlateRangeRepository.findBySeries(series);
        if (ranges.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ranges);
    }
    
    @PostMapping("/ranges")
    public ResponseEntity<FreeLicensePlateRange> createRange(@RequestBody Map<String, Object> requestBody) {
        // Extract and validate the fields
        String series = (String) requestBody.get("series");
        Integer startNumber = (Integer) requestBody.get("startNumber");
        Integer endNumber = (Integer) requestBody.get("endNumber");
        
        if (series == null || startNumber == null || endNumber == null) {
            return ResponseEntity.badRequest().build();
        }
        
        if (startNumber > endNumber) {
            return ResponseEntity.badRequest().build();
        }
        
        // Create the composite key and entity
        FreeLicensePlateRangePK id = new FreeLicensePlateRangePK(series, startNumber, endNumber);
        
        // Check if a range with the same composite key already exists
        if (freeLicensePlateRangeRepository.existsById(id)) {
            return ResponseEntity.badRequest().build();
        }
        
        // Create a new entity using the factory method
        FreeLicensePlateRange range = FreeLicensePlateRange.create(series, startNumber, endNumber);
        FreeLicensePlateRange savedRange = freeLicensePlateRangeRepository.save(range);
        return ResponseEntity.ok(savedRange);
    }
    
    @PutMapping("/ranges")
    public ResponseEntity<FreeLicensePlateRange> updateRange(@RequestBody Map<String, Object> requestBody) {
        // Extract and validate the fields
        String series = (String) requestBody.get("series");
        Integer startNumber = (Integer) requestBody.get("startNumber");
        Integer endNumber = (Integer) requestBody.get("endNumber");
        
        if (series == null || startNumber == null || endNumber == null) {
            return ResponseEntity.badRequest().build();
        }
        
        if (startNumber > endNumber) {
            return ResponseEntity.badRequest().build();
        }
        
        // Create the composite key
        FreeLicensePlateRangePK id = new FreeLicensePlateRangePK(series, startNumber, endNumber);
        
        // Check if the range exists
        if (!freeLicensePlateRangeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Create a new entity using the factory method
        FreeLicensePlateRange range = FreeLicensePlateRange.create(series, startNumber, endNumber);
        FreeLicensePlateRange updatedRange = freeLicensePlateRangeRepository.save(range);
        return ResponseEntity.ok(updatedRange);
    }
    
    @DeleteMapping("/ranges")
    public ResponseEntity<Void> deleteRange(@RequestParam String series, 
                                           @RequestParam Integer startNumber, 
                                           @RequestParam Integer endNumber) {
        FreeLicensePlateRangePK id = new FreeLicensePlateRangePK(series, startNumber, endNumber);
        if (!freeLicensePlateRangeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        freeLicensePlateRangeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<LicensePlate>> getAllLicensePlates() {
        List<LicensePlate> licensePlates = licensePlateRepository.findAll();
        return ResponseEntity.ok(licensePlates);
    }
    @GetMapping("/{id}")
    public ResponseEntity<LicensePlate> getLicensePlateById(@PathVariable String licenseNumber) {
        Optional<LicensePlate> licensePlate = licensePlateRepository.findById(licenseNumber);
        return licensePlate.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<LicensePlate> createLicensePlate(@RequestBody LicensePlate licensePlate) {
        LicensePlate savedLicensePlate = licensePlateRepository.save(licensePlate);
        return ResponseEntity.ok(savedLicensePlate);
    }
    @PutMapping("/{id}")
    public ResponseEntity<LicensePlate> updateLicensePlate(@PathVariable String licenseNumber, @RequestBody LicensePlate licensePlate) {
        if (!licensePlateRepository.existsById(licenseNumber)) {
            return ResponseEntity.notFound().build();
        }
        licensePlate.setLicenseNumber(licenseNumber); // Убедитесь, что ID установлен
        LicensePlate updatedLicensePlate = licensePlateRepository.save(licensePlate);
        return ResponseEntity.ok(updatedLicensePlate);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLicensePlate(@PathVariable String licenseNumber) {
        if (!licensePlateRepository.existsById(licenseNumber)) {
            return ResponseEntity.notFound().build();
        }
        licensePlateRepository.deleteById(licenseNumber);
        return ResponseEntity.ok().build();
    }
}
