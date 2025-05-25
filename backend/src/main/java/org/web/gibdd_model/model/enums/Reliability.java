package org.web.gibdd_model.model.enums;

import lombok.Getter;

public enum Reliability  {
    LOW("Низкая"),
    MEDIUM("Средняя"),
    HIGH("Высокая");

    @Getter
    private final String description;

    private Reliability(String description) {
        this.description = description;
    }

//    @Override
//    public String toString() {
//        return description;
//    }

    public static Reliability fromDescription(String description) {
        for (Reliability e : Reliability.values()) {
            if (e.description.equals(description)) {
                return e;
            }
        }
        return null;
    }
}
