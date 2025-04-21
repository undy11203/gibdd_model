package org.web.gibdd_model.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.web.gibdd_model.model.Owner;

import java.util.List;

public interface OwnerRepository extends JpaRepository<Owner, Long> {

    Page<Owner> findByFullNameContaining(String fullName, Pageable pageable);

    //Получить сведения о владельце автотранспортного средства по государственному номеру автомашины
    @Query("SELECT v.fullName, v.address, v.phone " +
            "FROM Owner v " +
            "JOIN Vehicle a ON v.id = a.owner.id " +
            "WHERE a.licensePlate.licenseNumber = :licensePlate")
    List<Object[]> findOwnerByLicensePlate(@Param("licensePlate") String licensePlate);

    //Владельцы не прошедших техосмотр машин
    @Query("SELECT v.fullName, COUNT(*) OVER () AS totalCount " +
            "FROM Owner v " +
            "JOIN Vehicle a ON v.id = a.owner.id " +
            "JOIN TechnicalInspection tos ON a.id = tos.vehicle.id " +
            "WHERE tos.nextInspectionDate < CURRENT_DATE")
    List<Object[]> findOwnersWithOverdueInspection();
}
