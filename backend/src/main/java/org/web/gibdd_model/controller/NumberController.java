package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.model.LicensePlate;
import org.web.gibdd_model.service.LicensePlateService;

import java.util.List;

@RestController
@RequestMapping("/api/license-plates")
public class NumberController {

    @Autowired
    private LicensePlateService licensePlateService;

    @GetMapping("/validate/{licenseNumber}")
    public ResponseEntity<Object> validateLicensePlate(@PathVariable String licenseNumber) {
        boolean isValid = licensePlateService.validateLicensePlateFormat(licenseNumber);
        
        // Create a response object with isValid flag
        java.util.Map<String, Object> response = new java.util.HashMap<>();
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
        java.util.List<org.web.gibdd_model.model.LicensePlate> hotPlates = licensePlateService.getHotLicensePlates();
        return ResponseEntity.ok(hotPlates);
    }
}
