package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "free_license_plate_ranges")
public class FreeLicensePlateRange {
    @EmbeddedId
    private FreeLicensePlateRangePK id;
    
    // Convenience getters for easier access to the composite key fields
    public String getSeries() {
        return id != null ? id.getSeries() : null;
    }
    
    public Integer getStartNumber() {
        return id != null ? id.getStartNumber() : null;
    }
    
    public Integer getEndNumber() {
        return id != null ? id.getEndNumber() : null;
    }
    
    // Factory method to create a new instance with the given key fields
    public static FreeLicensePlateRange create(String series, Integer startNumber, Integer endNumber) {
        FreeLicensePlateRangePK id = new FreeLicensePlateRangePK(series, startNumber, endNumber);
        return new FreeLicensePlateRange(id);
    }
}
