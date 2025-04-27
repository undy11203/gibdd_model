package org.web.gibdd_model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web.gibdd_model.repository.OrganizationRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    public List<Object[]> getOrganizationsByLicense(String series, LocalDate startDate, LocalDate endDate) {
        return organizationRepository.findOrganizationsByLicense(series, startDate, endDate);
    }
}
