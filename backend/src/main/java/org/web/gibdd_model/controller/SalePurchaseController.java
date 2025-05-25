package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.dto.SalePurchaseDTO;
import org.web.gibdd_model.model.Owner;
import org.web.gibdd_model.model.SalePurchase;
import org.web.gibdd_model.model.Vehicle;
import org.web.gibdd_model.repository.OwnerRepository;
import org.web.gibdd_model.repository.VehicleRepository;
import org.web.gibdd_model.service.SalePurchaseService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sales-purchases")
public class SalePurchaseController {

    private final SalePurchaseService salePurchaseService;

    @Autowired
    public SalePurchaseController(SalePurchaseService salePurchaseService) {
        this.salePurchaseService = salePurchaseService;
    }

    @GetMapping
    public List<SalePurchase> getAll() {
        return salePurchaseService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalePurchase> getById(@PathVariable Long id) {
        Optional<SalePurchase> salePurchase = salePurchaseService.findById(id);
        return salePurchase.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @PostMapping
    public SalePurchase create(@RequestBody SalePurchaseDTO salePurchase) {
        // Fetch related entities by IDs
        Vehicle vehicle = vehicleRepository.findById(Long.valueOf(salePurchase.getVehicleId()))
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        Owner buyer = ownerRepository.findById(Long.valueOf(salePurchase.getBuyerId()))
                    .orElseThrow(() -> new RuntimeException("Buyer not found"));
        Owner seller = ownerRepository.findById(Long.valueOf(salePurchase.getSellerId()))
                    .orElseThrow(() -> new RuntimeException("Seller not found"));

        // Create and save the sale/purchase record
        SalePurchase salePurchaseEntity = new SalePurchase();
        salePurchaseEntity.setVehicle(vehicle);
        salePurchaseEntity.setBuyer(buyer);
        salePurchaseEntity.setSeller(seller);
        salePurchaseEntity.setDate(salePurchase.getDate());
        salePurchaseEntity.setCost(salePurchase.getCost());
        
        // Save the sale/purchase record
        SalePurchase savedSalePurchase = salePurchaseService.save(salePurchaseEntity);
        
        // Update the vehicle's owner to the buyer
        vehicle.setOwner(buyer);
        vehicleRepository.save(vehicle);
        
        return savedSalePurchase;
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalePurchase> update(@PathVariable Long id, @RequestBody SalePurchase salePurchase) {
        Optional<SalePurchase> existing = salePurchaseService.findById(id);
        if (existing.isPresent()) {
            salePurchase.setId(id);
            SalePurchase updated = salePurchaseService.save(salePurchase);
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Optional<SalePurchase> existing = salePurchaseService.findById(id);
        if (existing.isPresent()) {
            salePurchaseService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
