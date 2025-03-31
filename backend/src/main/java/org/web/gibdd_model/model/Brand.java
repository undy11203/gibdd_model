package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;
import org.web.gibdd_model.model.enums.TheftPopularity;

@Data
@Entity
@Table(name = "brand")
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "theft_popularity")
    private TheftPopularity theftPopularity;
}