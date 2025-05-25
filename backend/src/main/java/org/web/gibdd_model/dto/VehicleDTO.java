package org.web.gibdd_model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class VehicleDTO {
    private int alarmSystemId;      // ID системы сигнализации
    private String bodyNumber;       // Номер кузова
    private int brandId;             // ID марки автомобиля
    private String chassisNumber;     // Номер шасси
    private String color;             // Цвет автомобиля
    private String engineNumber;      // Номер двигателя
    private String engineVolume;      // Объем двигателя
    private String licenseNumber;     // Номер лицензии
    private int licensePlateId;       // ID номерного знака
    private int organizationId;       // ID организации
    private int ownerId;              // ID владельца
    private LocalDate releaseDate;    // Дата выпуска
    private String vehicleType;       // Тип автомобиля (например, "грузовые")

}