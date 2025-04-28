package org.web.gibdd_model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web.gibdd_model.model.Vehicle;
import org.web.gibdd_model.repository.VehicleRepository;

import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public org.web.gibdd_model.dto.VehicleDossierDTO getVehicleDossier(String licensePlate) {
        Vehicle vehicle = vehicleRepository.findByLicensePlate(licensePlate);
        if (vehicle == null) {
            return null;
        }

        List<org.web.gibdd_model.dto.AccidentInfoDTO> accidents = vehicleRepository.findAccidentsByLicensePlate(licensePlate);

        List<org.web.gibdd_model.model.TechnicalInspection> inspections = vehicleRepository.findInspectionsByLicensePlate(licensePlate);
        boolean passedInspection = false;
        if (inspections != null && !inspections.isEmpty()) {
            passedInspection = "Пройден".equals(inspections.get(0).getResult());
        }

        org.web.gibdd_model.dto.VehicleDossierDTO dossier = new org.web.gibdd_model.dto.VehicleDossierDTO();
        dossier.setEngineNumber(vehicle.getEngineNumber());
        dossier.setChassisNumber(vehicle.getChassisNumber());
        dossier.setBodyNumber(vehicle.getBodyNumber());
        dossier.setInAccident(!accidents.isEmpty());
        dossier.setPassedInspection(passedInspection);
        dossier.setAccidents(accidents);

        return dossier;
    }

    public org.web.gibdd_model.model.Owner getOwnerByLicenseNumber(String licenseNumber) {
        return vehicleRepository.findOwnerByLicenseNumber(licenseNumber);
    }
}
