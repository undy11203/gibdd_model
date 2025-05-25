package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.model.Brand;
import org.web.gibdd_model.model.enums.TheftPopularity;
import org.web.gibdd_model.repository.BrandRepository;
import org.web.gibdd_model.service.BrandService;

import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    @Autowired
    private BrandRepository brandRepository;
    private BrandService brandService;

    @GetMapping
    public Page<Brand> getBrand(@RequestParam(required = false) String search,
                                @RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "10") int limit) {
        if (search == null) {
            return brandRepository.findAll(PageRequest.of(page, limit));
        }
        return brandRepository.findByNameContaining(search, PageRequest.of(page, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        Optional<Brand> brand = brandRepository.findById(id);
        return brand
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/theft-popularity")
    public ResponseEntity<Collection<Object>> getTheftPopularity() {
        return ResponseEntity.ok().body(brandService.getTheftPopularity());
    }

    @PostMapping
    public ResponseEntity<Brand> createBrand(@RequestBody Brand brand) {
        if (brand.getId() != null) {
            return ResponseEntity.badRequest().build(); // ID должен быть null для создания
        }

        Brand savedBrand = brandRepository.save(brand);
        return ResponseEntity
                .ok()
                .body(savedBrand);
    }

    @PostMapping("/{id}")
    public ResponseEntity<Brand> partialUpdateBrand(
            @PathVariable Long id,
            @RequestBody Brand brandDetails) {

        return brandRepository.findById(id)
                .map(existingBrand -> {
                    // Обновляем только предоставленные поля
                    if (brandDetails.getName() != null) {
                        existingBrand.setName(brandDetails.getName());
                    }
                    if (brandDetails.getTheftPopularity() != null) {
                        existingBrand.setTheftPopularity(brandDetails.getTheftPopularity());
                    }

                    Brand updatedBrand = brandRepository.save(existingBrand);
                    return ResponseEntity.ok(updatedBrand);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
        return brandRepository.findById(id)
                .map(brand -> {
                    brandRepository.delete(brand);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
