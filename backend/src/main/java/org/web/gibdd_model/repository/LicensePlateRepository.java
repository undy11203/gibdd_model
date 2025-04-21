package org.web.gibdd_model.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.web.gibdd_model.model.LicensePlate;

public interface LicensePlateRepository extends JpaRepository<LicensePlate, Long> {
    Page<LicensePlate> findByNumberContaining(String search, Pageable pageable);
}
