package org.web.gibdd_model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.web.gibdd_model.model.SalePurchase;

@Repository
public interface SalePurchaseRepository extends JpaRepository<SalePurchase, Long> {
}
