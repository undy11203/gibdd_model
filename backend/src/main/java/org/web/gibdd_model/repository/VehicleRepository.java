package org.web.gibdd_model.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.web.gibdd_model.model.Owner;
import org.web.gibdd_model.model.Vehicle;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    //Досье на автомобиль
    @Query("SELECT v FROM Vehicle v WHERE v.licensePlate.licenseNumber = :licensePlate")
    Vehicle findByLicensePlate(@Param("licensePlate") String licensePlate);

    @Query("SELECT new org.web.gibdd_model.dto.AccidentInfoDTO(" +
            "a.id, a.date, a.type, a.description, a.victimsCount, a.damageAmount, a.cause, a.roadConditions, ap.role) " +
            "FROM AccidentParticipant ap " +
            "JOIN ap.accident a " +
            "JOIN ap.owner o " +
            "JOIN Vehicle v ON v.owner.id = o.id " +
            "WHERE v.licensePlate.licenseNumber = :licensePlate")
    List<org.web.gibdd_model.dto.AccidentInfoDTO> findAccidentsByLicensePlate(@Param("licensePlate") String licensePlate);

    @Query("SELECT ti FROM TechnicalInspection ti WHERE ti.vehicle.licensePlate.licenseNumber = :licensePlate ORDER BY ti.inspectionDate DESC")
    List<org.web.gibdd_model.model.TechnicalInspection> findInspectionsByLicensePlate(@Param("licensePlate") String licensePlate);

    // Получить владельца по номеру
    @Query("SELECT v FROM Vehicle d JOIN d.owner v WHERE d.licensePlate.licenseNumber = :licenseNumber")
    Owner findOwnerByLicenseNumber(@Param("licenseNumber") String licenseNumber);
    
    Page<Vehicle> findByOwnerId(Long ownerId, Pageable pageable);

    Page<Vehicle> findByVehicleTypeAndOwnerId(String type, Long ownerId, Pageable pageable);

    Page<Vehicle> findByVehicleType(String type, Pageable pageable);
}
