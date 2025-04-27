package org.web.gibdd_model.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AccidentInfoDTO {
    private Long id;
    private LocalDate date;
    private String type;
    private String description;
    private Integer victimsCount;
    private Double damageAmount;
    private String cause;
    private String roadConditions;
    private String role; // AccidentRole as string
}
