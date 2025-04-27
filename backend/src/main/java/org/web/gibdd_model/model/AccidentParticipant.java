package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;
import org.web.gibdd_model.model.enums.AccidentRole;

@Data
@Entity
@Table(name = "accident_participants")
public class AccidentParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "accident_id", nullable = false)
    private Accident accident;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    @Enumerated(EnumType.STRING)
    private AccidentRole role;
}
