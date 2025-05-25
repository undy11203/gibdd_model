package org.web.gibdd_model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.web.gibdd_model.model.FreeLicensePlateRange;
import org.web.gibdd_model.model.FreeLicensePlateRangePK;

import java.util.List;
import java.util.Optional;

public interface FreeLicensePlateRangeRepository extends JpaRepository<FreeLicensePlateRange, FreeLicensePlateRangePK> {

    // Find by series only (part of the composite key)
    @Query("SELECT f FROM FreeLicensePlateRange f WHERE f.id.series = :series")
    List<FreeLicensePlateRange> findBySeries(@Param("series") String series);
    
    // Find first range by series
    @Query("SELECT f FROM FreeLicensePlateRange f WHERE f.id.series = :series")
    Optional<FreeLicensePlateRange> findFirstBySeries(@Param("series") String series);
    
    // For backward compatibility with existing code
    default Optional<FreeLicensePlateRange> findById_Series(String series) {
        return findFirstBySeries(series);
    }
}
