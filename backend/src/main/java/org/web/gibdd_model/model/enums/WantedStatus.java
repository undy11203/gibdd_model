// Перечисление для статуса розыска
package org.web.gibdd_model.model.enums;

import lombok.Getter;

public enum WantedStatus {
    WANTED("Розыскивается"), // Розыскивается
    FOUND("Найден"); // Найден

    @Getter
    private final String description;

    private WantedStatus(String description) {
        this.description = description;
    }
}