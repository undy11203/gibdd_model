package org.web.gibdd_model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.web.gibdd_model.model.Vehicle;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    //Досье на автомобиль
    @Query("SELECT a.engineNumber, a.chassisNumber, a.bodyNumber, " +
            "CASE WHEN dtp.id IS NOT NULL THEN 'Да' ELSE 'Нет' END AS inAccident, " +
            "CASE WHEN tos.result = 'Пройден' THEN 'Да' ELSE 'Нет' END AS passedInspection " +
            "FROM Vehicle a " +
            "LEFT JOIN AccidentParticipant udp ON a.id = udp.vehicle.id " +
            "LEFT JOIN Accident dtp ON udp.accident.id = dtp.id " +
            "LEFT JOIN TechnicalInspection tos ON a.id = tos.vehicle.id " +
            "WHERE a.licensePlate.licenseNumber = :licensePlate")
    List<Object[]> getVehicleDossier(@Param("licensePlate") String licensePlate);
}
