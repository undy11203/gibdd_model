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

//    @Override
//    public String toString() {
//        return description;
//    }

    public static TheftPopularity fromDescription(String description) {
        for (TheftPopularity e : TheftPopularity.values()) {
            if (e.description.equals(description)) {
                return e;
            }
        }
        return null;
    }
}
