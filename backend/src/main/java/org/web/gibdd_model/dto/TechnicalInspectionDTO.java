package org.web.gibdd_model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for Technical Inspection data transfer
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicalInspectionDTO {
    private Long vehicleId;
    private LocalDate inspectionDate;
    private String result;
    private LocalDate nextInspectionDate;
}
