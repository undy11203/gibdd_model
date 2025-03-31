package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "organization")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "district")
    private String district;

    @Column(name = "address")
    private String address;

    @Column(name = "director")
    private String director;
}