package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;
import org.web.gibdd_model.model.enums.WantedStatus;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "wanted_vehicles")
public class WantedVehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private LocalDate addedDate;

    private String reason;

    @Enumerated(EnumType.STRING)
    private WantedStatus status;
}

