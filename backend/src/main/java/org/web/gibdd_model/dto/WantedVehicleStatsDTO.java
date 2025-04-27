package org.web.gibdd_model.dto;

import lombok.Data;

@Data
public class WantedVehicleStatsDTO {
    private long totalWantedVehicles;
    private long foundVehicles;
    private double foundPercentage;
    private long hitAndRunCount;
    private long stolenCount;
    private double averageSearchTime; // в днях
}
