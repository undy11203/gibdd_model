package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "free_license_plate_ranges")
public class FreeLicensePlateRange {

    @Id
    @Column(nullable = false)
    private String series; //буквы серии(их 12)

    @Column(nullable = false)
    private Integer startNumber; //начало диапазона число

    @Column(nullable = false)
    private Integer endNumber; //конец диапазона число
}