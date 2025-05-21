package org.web.gibdd_model.model.enums;

import lombok.Getter;

public enum TheftPopularity {
    HIGH("Высокая"),
    MEDIUM("Средняя"),
    LOW("Низкая");

    @Getter
    private final String description;

    private TheftPopularity(String description) {
        this.description = description;
    }
}
