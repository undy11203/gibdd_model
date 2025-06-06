package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.web.gibdd_model.model.enums.Reliability;

@Data
@Entity
@Table(name = "alarm_system")
public class AlarmSystem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "reliability")
    @Enumerated(EnumType.STRING)
    private Reliability reliability; // надежность
}