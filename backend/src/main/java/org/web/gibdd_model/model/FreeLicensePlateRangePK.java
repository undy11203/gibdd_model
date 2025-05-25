package org.web.gibdd_model.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class FreeLicensePlateRangePK implements Serializable {
    @Column(nullable = false)
    private String series;
    
    @Column(nullable = false)
    private Integer startNumber;
    
    @Column(nullable = false)
    private Integer endNumber;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FreeLicensePlateRangePK)) return false;
        FreeLicensePlateRangePK that = (FreeLicensePlateRangePK) o;
        return Objects.equals(series, that.series) &&
                Objects.equals(startNumber, that.startNumber) &&
                Objects.equals(endNumber, that.endNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(series, startNumber, endNumber);
    }
}
