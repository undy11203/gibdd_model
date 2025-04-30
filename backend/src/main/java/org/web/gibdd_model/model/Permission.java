package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private String resource; // e.g., "accidents", "vehicles", "owners"

    @Column(nullable = false)
    private String action; // "read", "write", "delete", "execute"

    @Column
    private String description;
}
