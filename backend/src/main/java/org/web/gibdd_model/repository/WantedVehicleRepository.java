package org.web.gibdd_model.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.web.gibdd_model.model.WantedVehicle;
import org.web.gibdd_model.model.enums.WantedStatus;

import java.time.LocalDate;
import java.util.List;

public interface WantedVehicleRepository extends JpaRepository<WantedVehicle, Long> {

    @Query("SELECT w FROM WantedVehicle w WHERE w.status = 'WANTED'")
    Page<WantedVehicle> findAllWanted(Pageable pageable);

    @Query("SELECT w FROM WantedVehicle w WHERE w.reason = 'HIT_AND_RUN' AND w.status = 'WANTED'")
    List<WantedVehicle> findAllHitAndRun();

    @Query("SELECT w FROM WantedVehicle w WHERE w.reason = 'THEFT' AND w.status = 'WANTED'")
    List<WantedVehicle> findAllStolen();

    @Query("SELECT " +
            "COUNT(w) as total, " +
            "SUM(CASE WHEN w.status = 'FOUND' THEN 1 ELSE 0 END) as found, " +
            "CAST(SUM(CASE WHEN w.status = 'FOUND' THEN 1 ELSE 0 END) * 100.0 / COUNT(w) as double) as foundPercentage, " +
            "SUM(CASE WHEN w.reason = 'HIT_AND_RUN' THEN 1 ELSE 0 END) as hitAndRun, " +
            "SUM(CASE WHEN w.reason = 'THEFT' THEN 1 ELSE 0 END) as stolen, " +
            "AVG(CASE WHEN w.status = 'FOUND' THEN DATEDIFF(day, w.addedDate, w.foundDate) ELSE null END) as avgSearchTime " +
            "FROM WantedVehicle w")
    List<Object[]> getWantedVehicleStats();

    @Query("SELECT w FROM WantedVehicle w " +
            "WHERE w.status = 'WANTED' " +
            "AND (w.reason = :reason OR :reason IS NULL)")
    Page<WantedVehicle> findAllWantedByReason(String reason, Pageable pageable);

    @Query("SELECT w FROM WantedVehicle w " +
            "WHERE w.status = 'FOUND' " +
            "AND w.foundDate BETWEEN :startDate AND :endDate")
    List<WantedVehicle> findAllFoundBetweenDates(LocalDate startDate, LocalDate endDate);
}
