package org.web.gibdd_model.dto;

import lombok.Data;
import org.locationtech.jts.geom.Point;
import org.web.gibdd_model.model.enums.AccidentRole;
import org.web.gibdd_model.model.enums.AccidentType;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateAccidentDTO {
    private LocalDate date;
    private LocationDTO location;
    private String type;
    private String description;
    private Integer victimsCount;
    private Double damageAmount;
    private String cause;
    private String roadConditions;
    private List<ParticipantDTO> participants;

    @Data
    public static class LocationDTO {
        private Double latitude;
        private Double longitude;
    }

    @Data
    public static class ParticipantDTO {
        private String licensePlate;
        private String role;
    }
}
