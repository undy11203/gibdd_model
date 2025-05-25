package org.web.gibdd_model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.web.gibdd_model.model.Organization;
import org.web.gibdd_model.repository.OrganizationRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    public Page<Organization> getOrganizationsByLicense(String series, Pageable pageable) {
        return organizationRepository.findOrganizationsByLicense(series, pageable);
    }
}
