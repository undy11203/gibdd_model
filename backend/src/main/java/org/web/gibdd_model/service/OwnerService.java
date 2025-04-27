package org.web.gibdd_model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web.gibdd_model.repository.OwnerRepository;
import org.web.gibdd_model.dto.OwnerOverdueInspectionDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    public List<Object[]> getOwnerByLicensePlate(String licensePlate) {
        return ownerRepository.findOwnerByLicensePlate(licensePlate);
    }

    public List<OwnerOverdueInspectionDTO> getOwnersWithOverdueInspection() {
        List<Object[]> results = ownerRepository.findOwnersWithOverdueInspection();
        return results.stream()
                .map(row -> new OwnerOverdueInspectionDTO(
                        (String) row[0],
                        ((Number) row[1]).longValue()
                ))
                .collect(Collectors.toList());
    }
}
