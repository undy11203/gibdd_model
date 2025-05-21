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
}