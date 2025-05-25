package org.web.gibdd_model.dto;

import lombok.Data;
import org.web.gibdd_model.model.enums.WantedStatus;

import java.time.LocalDate;

@Data
public class WantedVehicleDTO {
    private Long vehicleId;
    private LocalDate addedDate;
    private String reason;
    private String status;
}
