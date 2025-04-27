package org.web.gibdd_model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OwnerOverdueInspectionDTO {
    private String fullName;
    private Long totalCount;
}
