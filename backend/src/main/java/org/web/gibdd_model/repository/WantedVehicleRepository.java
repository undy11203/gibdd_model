package org.web.gibdd_model.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.web.gibdd_model.model.WantedVehicle;

import java.util.List;

public interface WantedVehicleRepository extends JpaRepository<WantedVehicle, Integer> {

    //Получить список машин, отданных в розыск, будь то скрывшиеся с места ДТП или угнанные
    @Query("SELECT DISTINCT a.licensePlate.licenseNumber " +
            "FROM WantedVehicle r " +
            "JOIN r.vehicle a " +
            "UNION " +
            "SELECT DISTINCT a.licensePlate.licenseNumber " +
            "FROM Theft u " +
            "JOIN u.vehicle a")
    List<String> getWantedVehicles();

    // Получить данные об эффективности розыскной работы: количество найденных машин в процентном отношении
    @Query("SELECT COUNT(CASE WHEN r.status = 'Найден' THEN 1 END) AS found, " +
            "COUNT(*) AS total, " +
            "ROUND(COUNT(CASE WHEN r.status = 'Найден' THEN 1 END) * 100.0 / COUNT(*), 2) AS efficiency " +
            "FROM WantedVehicle r")
    List<Object[]> getWantedEfficiency();

    Page<WantedVehicle> findByStatus(String status, Pageable pageable);
}