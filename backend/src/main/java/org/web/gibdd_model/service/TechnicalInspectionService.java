package org.web.gibdd_model.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.web.gibdd_model.dto.TechnicalInspectionDTO;
import org.web.gibdd_model.model.TechnicalInspection;
import org.web.gibdd_model.model.Vehicle;
import org.web.gibdd_model.repository.TechnicalInspectionRepository;
import org.web.gibdd_model.repository.VehicleRepository;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class TechnicalInspectionService {

    private final TechnicalInspectionRepository technicalInspectionRepository;
    private final VehicleRepository vehicleRepository;

    /**
     * Get all technical inspections with pagination
     *
     * @param pageable pagination information
     * @return page of technical inspections
     */
    public Page<TechnicalInspection> getAllInspections(Pageable pageable) {
        return technicalInspectionRepository.findAll(pageable);
    }

    /**
     * Get a technical inspection by ID
     *
     * @param id the ID of the technical inspection
     * @return the technical inspection
     * @throws NoSuchElementException if the technical inspection is not found
     */
    public TechnicalInspection getInspectionById(Long id) {
        return technicalInspectionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Technical inspection not found with ID: " + id));
    }

    /**
     * Get all technical inspections for a specific owner
     *
     * @param ownerId the ID of the owner
     * @return list of technical inspections
     */
    public List<TechnicalInspection> getInspectionsByOwnerId(Long ownerId) {
        return technicalInspectionRepository.findByOwnerId(ownerId);
    }

    /**
     * Get all technical inspections for a specific vehicle
     *
     * @param vehicleId the ID of the vehicle
     * @return list of technical inspections
     */
    public List<TechnicalInspection> getInspectionsByVehicleId(Long vehicleId) {
        return technicalInspectionRepository.findByVehicleId(vehicleId);
    }

    /**
     * Create a new technical inspection
     *
     * @param inspectionDTO the technical inspection data
     * @return the created technical inspection
     * @throws NoSuchElementException if the vehicle is not found
     */
    @Transactional
    public TechnicalInspection createInspection(TechnicalInspectionDTO inspectionDTO) {
        Vehicle vehicle = vehicleRepository.findById(inspectionDTO.getVehicleId())
                .orElseThrow(() -> new NoSuchElementException("Vehicle not found with ID: " + inspectionDTO.getVehicleId()));

        TechnicalInspection inspection = new TechnicalInspection();
        inspection.setVehicle(vehicle);
        inspection.setInspectionDate(inspectionDTO.getInspectionDate());
        inspection.setResult(inspectionDTO.getResult());
        inspection.setNextInspectionDate(inspectionDTO.getNextInspectionDate());

        return technicalInspectionRepository.save(inspection);
    }

    /**
     * Update an existing technical inspection
     *
     * @param id the ID of the technical inspection to update
     * @param inspectionDTO the updated technical inspection data
     * @return the updated technical inspection
     * @throws NoSuchElementException if the technical inspection or vehicle is not found
     */
    @Transactional
    public TechnicalInspection updateInspection(Long id, TechnicalInspectionDTO inspectionDTO) {
        TechnicalInspection inspection = technicalInspectionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Technical inspection not found with ID: " + id));

        Vehicle vehicle = vehicleRepository.findById(inspectionDTO.getVehicleId())
                .orElseThrow(() -> new NoSuchElementException("Vehicle not found with ID: " + inspectionDTO.getVehicleId()));

        inspection.setVehicle(vehicle);
        inspection.setInspectionDate(inspectionDTO.getInspectionDate());
        inspection.setResult(inspectionDTO.getResult());
        inspection.setNextInspectionDate(inspectionDTO.getNextInspectionDate());

        return technicalInspectionRepository.save(inspection);
    }

    /**
     * Delete a technical inspection
     *
     * @param id the ID of the technical inspection to delete
     * @throws NoSuchElementException if the technical inspection is not found
     */
    @Transactional
    public void deleteInspection(Long id) {
        if (!technicalInspectionRepository.existsById(id)) {
            throw new NoSuchElementException("Technical inspection not found with ID: " + id);
        }
        technicalInspectionRepository.deleteById(id);
    }
}
