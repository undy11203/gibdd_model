package org.web.gibdd_model.dto;

import lombok.Data;
import org.web.gibdd_model.model.enums.AccidentType;

@Data
public class AccidentStatisticsDTO {
    private AccidentType type;
    private Long count;
    private Double averageDamage;
    private Integer totalVictims;

    public AccidentStatisticsDTO(AccidentType type, Long count, Double averageDamage, Integer totalVictims) {
        this.type = type;
        this.count = count;
        this.averageDamage = averageDamage;
        this.totalVictims = totalVictims;
    }
}
