package org.web.gibdd_model.dto;

import lombok.Data;
import org.web.gibdd_model.model.enums.AccidentCause;

import java.util.List;

@Data
public class AccidentAnalysisDTO {
    private List<DangerousLocationDTO> dangerousLocations;
    private CauseAnalysisDTO mostFrequentCause;

    @Data
    public static class DangerousLocationDTO {
        private Double latitude;
        private Double longitude;
        private Long accidentCount;
        private Double averageDamage;
        private Integer totalVictims;
    }

    @Data
    public static class CauseAnalysisDTO {
        private AccidentCause cause;
        private Long accidentCount;
        private Double percentageOfTotal;
    }
}
