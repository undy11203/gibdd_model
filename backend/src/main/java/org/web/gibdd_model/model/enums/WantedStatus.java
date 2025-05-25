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

//    @Override
//    public String toString() {
//        return description;
//    }

    public static WantedStatus fromDescription(String description) {
        for (WantedStatus e : WantedStatus.values()) {
            if (e.description.equals(description)) {
                return e;
            }
        }
        return null;
    }
}
