package org.web.gibdd_model.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.web.gibdd_model.model.Theft;

import java.time.LocalDate;
import java.util.List;

public interface TheftRepository extends JpaRepository<Theft, Long> {

    Page<Theft> findByTheftDateBetween(LocalDate dateFrom, LocalDate dateTo, Pageable pageable);

    //Получить перечень и общее число угонов за указанный период.
    @Query("SELECT m.name AS brand, COUNT(*) AS theftCount " +
            "FROM Theft u " +
            "JOIN u.vehicle a " +
            "JOIN a.brand m " +
            "WHERE u.theftDate BETWEEN :startDate AND :endDate " +
            "GROUP BY m.name")
    List<Object[]> getTheftStatistics(@Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate);

    //Самые угоняемые марки
    @Query("SELECT m.name AS brand, COUNT(*) AS theftCount " +
            "FROM Theft u " +
            "JOIN u.vehicle a " +
            "JOIN a.brand m " +
            "GROUP BY m.name " +
            "ORDER BY theftCount DESC")
    List<Object[]> getMostStolenBrands();

}
