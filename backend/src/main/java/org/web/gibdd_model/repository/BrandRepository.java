package org.web.gibdd_model.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.web.gibdd_model.model.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    Page<Brand> findByNameContaining(String search, Pageable pageable);
}
