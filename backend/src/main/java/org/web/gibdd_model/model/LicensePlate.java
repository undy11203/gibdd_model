package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "license_plate")
public class LicensePlate {

    @Id
    @Column(name = "license_number", nullable = false)
    private String licenseNumber;

    private Integer number;

    @Column(name = "series")
    private String series;

    @Column(name = "status")
    private Boolean status; // true = свободен, false = занят

    @Column(nullable = false)
    private LocalDate date;
}