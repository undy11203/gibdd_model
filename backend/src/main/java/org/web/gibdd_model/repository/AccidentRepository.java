package org.web.gibdd_model.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.web.gibdd_model.model.Accident;

import java.time.LocalDate;
import java.util.List;

public interface AccidentRepository extends JpaRepository<Accident, Long> {

    Page<Accident> findByDateBetweenAndType(LocalDate dateFrom, LocalDate dateTo, String type, Pageable pageable);

    Page<Accident> findByDateBetween(LocalDate dateFrom, LocalDate dateTo, Pageable pageable);

    Page<Accident> findByType(String type, Pageable pageable);

    //Статистика по типам ДТП за период (?)
    @Query("SELECT d.type, COUNT(*) AS accidentCount " +
            "FROM Accident d " +
            "WHERE d.date BETWEEN :startDate AND :endDate " +
            "GROUP BY d.type")
    List<Object[]> getAccidentStatistics(@Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);

    //Самая частая причина ДТП
    @Query("SELECT d.cause, COUNT(*) AS accidentCount " +
            "FROM Accident d " +
            "GROUP BY d.cause " +
            "ORDER BY accidentCount DESC")
    List<Object[]> getMostFrequentCauseOfAccidents();

    // Получить самые опасные места в городе (группировка по координатам с подсчетом количества ДТП, среднего ущерба и пострадавших)
    @Query("SELECT d.location, COUNT(d) AS accidentCount, AVG(d.damageAmount) AS avgDamage, SUM(d.victimsCount) AS totalVictims " +
            "FROM Accident d " +
            "GROUP BY d.location " +
            "ORDER BY accidentCount DESC")
    List<Object[]> getDangerousLocations();

    //Получить данные о количестве ДТП, совершаемых водителями в нетрезвом виде и доля таких происшествий в общем количестве ДТП
    @Query("SELECT COUNT(*) AS totalAccidents, " +
            "SUM(CASE WHEN d.cause = 'Нетрезвое_состояние' THEN 1 ELSE 0 END) AS drunkAccidents, " +
            "ROUND(SUM(CASE WHEN d.cause = 'Нетрезвое_состояние' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS drunkPercentage, " +
            "AVG(d.damageAmount) AS avgDamage, " +
            "SUM(d.victimsCount) AS totalVictims " +
            "FROM Accident d")
    List<Object[]> getDrunkDrivingStatistics();
}
