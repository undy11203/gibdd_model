package org.web.gibdd_model.model.enums;

import lombok.Getter;

public enum AccidentCause {
    SPEEDING("Превышение скорости"),
    DRUNK_DRIVING("Вождение в нетрезвом состоянии"),
    DISTRACTED_DRIVING("Невнимательность за рулем"),
    WEATHER_CONDITIONS("Погодные условия"),
    VEHICLE_MALFUNCTION("Неисправность транспортного средства"),
    ROAD_CONDITIONS("Состояние дороги"),
    TRAFFIC_VIOLATION("Нарушение ПДД"),
    INEXPERIENCED_DRIVER("Неопытность водителя"),
    OTHER("Прочие причины");

    @Getter
    private final String description;

    private AccidentCause(String description) {
        this.description = description;
    }

    public static AccidentCause fromDescription(String description) {
        for (AccidentCause e : AccidentCause.values()) {
            if (e.description.equals(description)) {
                return e;
            }
        }
        return null;
    }
}
