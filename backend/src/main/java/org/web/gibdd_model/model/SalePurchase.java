package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "sales_purchases")
public class SalePurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private LocalDate date;

    private Double cost;

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private Owner buyer;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private Owner seller;
}