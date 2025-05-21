package org.web.gibdd_model.model.enums;


import lombok.Getter;

public enum AccidentType {
    COLLISION("Коллизия"), // Столкновение
    OVERTURNING("Опрокидывание"), // Опрокидывание
    HIT_AND_RUN("Наезд и скрытие"), // Наезд и скрытие
    PEDESTRIAN_HIT("Наезд на пешехода"), // Наезд на пешехода
    OTHER("Прочие"); // Прочие

    @Getter
    private final String description;

    private AccidentType(String description) {
        this.description = description;
    }
}