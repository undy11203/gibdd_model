package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;
import org.locationtech.jts.geom.Point;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "thefts")
public class Theft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private LocalDate theftDate;

    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point location;

    private String description;
}