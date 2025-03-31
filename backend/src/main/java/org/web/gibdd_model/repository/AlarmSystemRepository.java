package org.web.gibdd_model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.web.gibdd_model.model.AlarmSystem;

import java.util.List;

public interface AlarmSystemRepository extends JpaRepository<AlarmSystem, Integer> {
    @Query("SELECT s.name AS alarmSystem, COUNT(u.id) AS theftCount " +
            "FROM AlarmSystem s " +
            "LEFT JOIN Vehicle a ON s.id = a.alarmSystem.id " +
            "LEFT JOIN Theft u ON a.id = u.vehicle.id " +
            "GROUP BY s.name " +
            "ORDER BY theftCount ASC")
    List<Object[]> getMostReliableAlarmSystems();
}
