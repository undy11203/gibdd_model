package org.web.gibdd_model.model.enums;

import lombok.Getter;

public enum AccidentRole {
    CULPRIT("Инициатор"), //инициатор
    VICTIM("Жертва"), //жертва
    WITNESS("Свидетель"); //свидетель

    @Getter
    private final String description;

    private AccidentRole(String description) {
        this.description = description;
    }

//    @Override
//    public String toString() {
//        return description;
//    }

    public static AccidentRole fromDescription(String description) {
        for (AccidentRole e : AccidentRole.values()) {
            if (e.description.equals(description)) {
                return e;
            }
        }
        return null;
    }
}