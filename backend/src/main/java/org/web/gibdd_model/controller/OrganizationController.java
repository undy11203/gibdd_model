package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.model.Organization;
import org.web.gibdd_model.repository.OrganizationRepository;
import org.web.gibdd_model.service.OrganizationService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private OrganizationService organizationService;

//
    @GetMapping
    public Page<Organization> getOrganizations(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        if (search != null && !search.isEmpty()) {
            return organizationRepository.findByNameContaining(search, pageable);
        }
        return organizationRepository.findAll(pageable);
    }

//
    @GetMapping("/number-filter")
    public List<Object[]> getOrganizationsByNumberFilter(
            @RequestParam(required = false) String series,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        // Parse dates if provided
        java.time.LocalDate start = (startDate != null && !startDate.isEmpty()) ? java.time.LocalDate.parse(startDate) : java.time.LocalDate.MIN;
        java.time.LocalDate end = (endDate != null && !endDate.isEmpty()) ? java.time.LocalDate.parse(endDate) : java.time.LocalDate.MAX;
        return organizationService.getOrganizationsByLicense(series, start, end);
    }

//
    @PostMapping
    public Organization createOrganization(@RequestBody Organization organization) {
        return organizationRepository.save(organization);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organization> getOrganizationById(@PathVariable Long id) {
        Optional<Organization> organization = organizationRepository.findById(id);
        return organization.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organization> updateOrganization(@PathVariable Long id, @RequestBody Organization organizationDetails) {
        return organizationRepository.findById(id).map(organization -> {
            organization.setName(organizationDetails.getName());
            organization.setDistrict(organizationDetails.getDistrict());
            organization.setAddress(organizationDetails.getAddress());
            organization.setDirector(organizationDetails.getDirector());
            Organization updatedOrganization = organizationRepository.save(organization);
            return ResponseEntity.ok(updatedOrganization);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteOrganization(@PathVariable Long id) {
        return organizationRepository.findById(id).map(organization -> {
            organizationRepository.delete(organization);
            return ResponseEntity.<Void>ok().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
