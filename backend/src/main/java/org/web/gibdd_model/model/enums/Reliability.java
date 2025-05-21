package org.web.gibdd_model.model.enums;

import lombok.Getter;

public enum Reliability {
    LOW("Низкая"),
    MEDIUM("Средняя"),
    HIGH("Высокая");

    @Getter
    private final String description;

    private Reliability(String description) {
        this.description = description;
    }
}
