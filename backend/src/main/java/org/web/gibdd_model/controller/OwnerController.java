package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.model.Owner;
import org.web.gibdd_model.repository.OwnerRepository;
import org.web.gibdd_model.service.OwnerService;
import org.web.gibdd_model.dto.OwnerOverdueInspectionDTO;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private OwnerService ownerService;

//
    @GetMapping
    @PreAuthorize("hasPermission('VIEW_OWNERS', '')")
    public Page<Owner> getOwners(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        if (search != null && !search.isEmpty()) {
            return ownerRepository.findByFullNameContaining(search, pageable);
        }
        return ownerRepository.findAll(pageable);
    }

//
    @PostMapping
    @PreAuthorize("hasPermission('MANAGE_OWNERS', '')")
    public Owner createOwner(@RequestBody Owner owner) {
        return ownerRepository.save(owner);
    }

//
    @GetMapping("/{id}")
    @PreAuthorize("hasPermission('VIEW_OWNERS', '')")
    public ResponseEntity<Owner> getOwnerById(@PathVariable Long id) {
        Optional<Owner> owner = ownerRepository.findById(id);
        return owner.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

//
    @PutMapping("/{id}")
    @PreAuthorize("hasPermission('MANAGE_OWNERS', '')")
    public ResponseEntity<Owner> updateOwner(@PathVariable Long id, @RequestBody Owner ownerDetails) {
        return ownerRepository.findById(id).map(owner -> {
            owner.setFullName(ownerDetails.getFullName());
            owner.setAddress(ownerDetails.getAddress());
            owner.setPhone(ownerDetails.getPhone());
            Owner updatedOwner = ownerRepository.save(owner);
            return ResponseEntity.ok(updatedOwner);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

//
    @DeleteMapping("/{id}")
    @PreAuthorize("hasPermission('MANAGE_OWNERS', '')")
    public ResponseEntity<Object> deleteOwner(@PathVariable Long id) {
        return ownerRepository.findById(id).map(owner -> {
            ownerRepository.delete(owner);
            return ResponseEntity.<Void>ok().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/overdue-inspections")
    @PreAuthorize("hasPermission('VIEW_OWNERS', '')")
    public List<OwnerOverdueInspectionDTO> getOwnersWithOverdueInspections() {
        return ownerService.getOwnersWithOverdueInspection();
    }
}
