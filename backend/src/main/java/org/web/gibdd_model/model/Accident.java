package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;
import org.locationtech.jts.geom.Point;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.web.gibdd_model.model.enums.AccidentType;
import org.web.gibdd_model.model.enums.AccidentCause;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "accident")
public class Accident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point location;

    @Enumerated(EnumType.STRING)
    private AccidentType type;

    private String description;

    private Integer victimsCount;

    private Double damageAmount;

    @Enumerated(EnumType.STRING)
    private AccidentCause cause; // Причина происшествия

    private String roadConditions;
}
