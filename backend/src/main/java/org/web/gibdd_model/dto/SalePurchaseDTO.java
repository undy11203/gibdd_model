package org.web.gibdd_model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalePurchaseDTO {
    private Integer vehicleId;
    private LocalDate date;
    private Double cost;
    private Integer buyerId;
    private Integer sellerId;
}

