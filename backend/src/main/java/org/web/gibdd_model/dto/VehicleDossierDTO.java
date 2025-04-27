package org.web.gibdd_model.dto;

import lombok.Data;
import java.util.List;

@Data
public class VehicleDossierDTO {
    private String engineNumber;
    private String chassisNumber;
    private String bodyNumber;
    private boolean inAccident;
    private boolean passedInspection;
    private List<AccidentInfoDTO> accidents;
}
