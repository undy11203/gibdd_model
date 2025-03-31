package org.web.gibdd_model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.web.gibdd_model.model.Accident;

import java.time.LocalDate;
import java.util.List;

public interface AccidentRepository extends JpaRepository<Accident, Long> {

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

    //Получить данные о количестве ДТП, совершаемых водителями в нетрезвом виде и доля таких происшествий в общем количестве ДТП
    @Query("SELECT SUM(CASE WHEN d.cause = 'Нетрезвое_состояние' THEN 1 ELSE 0 END) AS drunkAccidents, " +
            "COUNT(*) AS totalAccidents, " +
            "ROUND(SUM(CASE WHEN d.cause = 'Нетрезвое_состояние' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS drunkPercentage " +
            "FROM Accident d")
    List<Object[]> getDrunkDrivingStatistics();
}
