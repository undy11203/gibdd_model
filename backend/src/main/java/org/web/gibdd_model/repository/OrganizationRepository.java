package org.web.gibdd_model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.web.gibdd_model.model.Organization;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    //Получить перечень и общее число организаций, которым выделены номера либо с указанной серией, либо за указанный период
    @Query("SELECT o.name AS organizationName, COUNT(o) AS totalCount " +
            "FROM Organization o " +
            "JOIN Vehicle a ON o.id = a.organization.id " +
            "JOIN a.licensePlate n " +
            "WHERE (n.series = :series OR n.date BETWEEN :startDate AND :endDate) " +
            "GROUP BY o.name")
    List<Object[]> findOrganizationsByLicense(@Param("series") String series,
                                              @Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);
}