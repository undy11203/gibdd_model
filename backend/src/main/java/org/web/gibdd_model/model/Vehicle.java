package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;
import org.web.gibdd_model.model.enums.VehicleType;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "vehicle")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(name = "release_date")
    private LocalDateTime releaseDate;

    @Column(name = "engine_volume")
    private Float engineVolume;

    @Column(name = "engine_number")
    private String engineNumber;

    @Column(name = "chassis_number")
    private String chassisNumber;

    @Column(name = "body_number")
    private String bodyNumber;

    @Column(name = "color")
    private String color;

    @Column(name = "vehicle_type")
    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    @OneToOne
    @JoinColumn(name = "license_number")
    private LicensePlate licensePlate;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private Owner owner;

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ManyToOne
    @JoinColumn(name = "alarm_system_id")
    private AlarmSystem alarmSystem;
}
