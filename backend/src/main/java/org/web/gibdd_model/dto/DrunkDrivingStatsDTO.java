package org.web.gibdd_model.dto;

import lombok.Data;

@Data
public class DrunkDrivingStatsDTO {
    private Long totalAccidents;
    private Long drunkDrivingAccidents;
    private Double drunkDrivingPercentage;
    private Double averageDamageAmount;
    private Integer totalVictims;
}
