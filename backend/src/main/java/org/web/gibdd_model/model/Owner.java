package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "owner")
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "address")
    private String address;

    @Column(name = "phone")
    private String phone;
}