package org.web.gibdd_model.model.enums;

import lombok.Getter;

public enum VehicleType {
    PASSENGER("пассажирские"), //легковые
    TRUCK("грузовые"), //грузовые
    MOTORCYCLE("мотоциклы"), //мотоциклы
    BUS("автобусы"), //автобусы
    TRAILER("прицепы"); //прицепы

    @Getter
    private final String description;

    VehicleType(String description) {
        this.description = description;
    }
}
