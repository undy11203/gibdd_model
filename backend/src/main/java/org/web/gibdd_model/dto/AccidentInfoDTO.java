package org.web.gibdd_model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.web.gibdd_model.model.enums.AccidentCause;
import org.web.gibdd_model.model.enums.AccidentRole;
import org.web.gibdd_model.model.enums.AccidentType;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccidentInfoDTO {
    private Long id;
    private LocalDate date;
    private AccidentType type;
    private String description;
    private Integer victimsCount;
    private Double damageAmount;
    private AccidentCause cause;
    private String roadConditions;
    private AccidentRole role; // AccidentRole as string

}
