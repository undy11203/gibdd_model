package org.web.gibdd_model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web.gibdd_model.model.SalePurchase;
import org.web.gibdd_model.repository.SalePurchaseRepository;

import java.util.List;
import java.util.Optional;

@Service
public class SalePurchaseService {

    private final SalePurchaseRepository salePurchaseRepository;

    @Autowired
    public SalePurchaseService(SalePurchaseRepository salePurchaseRepository) {
        this.salePurchaseRepository = salePurchaseRepository;
    }

    public List<SalePurchase> findAll() {
        return salePurchaseRepository.findAll();
    }

    public Optional<SalePurchase> findById(Long id) {
        return salePurchaseRepository.findById(id);
    }

    public SalePurchase save(SalePurchase salePurchase) {
        return salePurchaseRepository.save(salePurchase);
    }

    public void deleteById(Long id) {
        salePurchaseRepository.deleteById(id);
    }
}
