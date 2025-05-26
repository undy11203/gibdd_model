package org.web.gibdd_model.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.web.gibdd_model.model.TechnicalInspection;

import java.util.List;

@Repository
public interface TechnicalInspectionRepository extends JpaRepository<TechnicalInspection, Long> {
    
    /**
     * Find all technical inspections for vehicles owned by a specific owner
     * 
     * @param ownerId the ID of the owner
     * @return list of technical inspections
     */
    @Query("SELECT ti FROM TechnicalInspection ti WHERE ti.vehicle.owner.id = :ownerId")
    List<TechnicalInspection> findByOwnerId(@Param("ownerId") Long ownerId);
    
    /**
     * Find all technical inspections for a specific vehicle
     * 
     * @param vehicleId the ID of the vehicle
     * @return list of technical inspections
     */
    List<TechnicalInspection> findByVehicleId(Long vehicleId);
    
    /**
     * Find all technical inspections with pagination
     * 
     * @param pageable pagination information
     * @return page of technical inspections
     */
    Page<TechnicalInspection> findAll(Pageable pageable);
}
