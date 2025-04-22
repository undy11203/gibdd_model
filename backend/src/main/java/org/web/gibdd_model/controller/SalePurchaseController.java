package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
    public SalePurchase create(@RequestBody SalePurchase salePurchase) {
        // Fetch related entities by IDs
        Vehicle vehicle = vehicleRepository.findById(salePurchase.getVehicle().getId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        Owner buyer = null;
        if (salePurchase.getBuyer() != null && salePurchase.getBuyer().getId() != null) {
            buyer = ownerRepository.findById(salePurchase.getBuyer().getId())
                    .orElseThrow(() -> new RuntimeException("Buyer not found"));
        }
        Owner seller = null;
        if (salePurchase.getSeller() != null && salePurchase.getSeller().getId() != null) {
            seller = ownerRepository.findById(salePurchase.getSeller().getId())
                    .orElseThrow(() -> new RuntimeException("Seller not found"));
        }

        salePurchase.setVehicle(vehicle);
        salePurchase.setBuyer(buyer);
        salePurchase.setSeller(seller);

        return salePurchaseService.save(salePurchase);
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
