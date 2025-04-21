package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.model.Vehicle;
import org.web.gibdd_model.repository.VehicleRepository;
import org.web.gibdd_model.model.Brand;
import org.web.gibdd_model.model.Owner;
import org.web.gibdd_model.model.Organization;
import org.web.gibdd_model.model.AlarmSystem;
import org.web.gibdd_model.model.LicensePlate;
import org.web.gibdd_model.repository.BrandRepository;
import org.web.gibdd_model.repository.OwnerRepository;
import org.web.gibdd_model.repository.OrganizationRepository;
import org.web.gibdd_model.repository.AlarmSystemRepository;
import org.web.gibdd_model.repository.LicensePlateRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private AlarmSystemRepository alarmSystemRepository;

    @Autowired
    private LicensePlateRepository licensePlateRepository;

    @GetMapping
    public ResponseEntity<Page<Vehicle>> getVehicles(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long ownerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Vehicle> vehicles;
        if (type != null && !type.isEmpty() && ownerId != null) {
            vehicles = vehicleRepository.findByVehicleTypeAndOwnerId(type, ownerId, pageable);
        } else if (type != null && !type.isEmpty()) {
            vehicles = vehicleRepository.findByVehicleType(type, pageable);
        } else if (ownerId != null) {
            vehicles = vehicleRepository.findByOwnerId(ownerId, pageable);
        } else {
            vehicles = vehicleRepository.findAll(pageable);
        }
        System.out.println("Size of vehicles: " + vehicles.getContent().size());
        return ResponseEntity.ok(vehicles);
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(savedVehicle);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        return vehicle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicle.setBrand(vehicleDetails.getBrand());
            vehicle.setReleaseDate(vehicleDetails.getReleaseDate());
            vehicle.setEngineVolume(vehicleDetails.getEngineVolume());
            vehicle.setEngineNumber(vehicleDetails.getEngineNumber());
            vehicle.setChassisNumber(vehicleDetails.getChassisNumber());
            vehicle.setBodyNumber(vehicleDetails.getBodyNumber());
            vehicle.setColor(vehicleDetails.getColor());
            vehicle.setVehicleType(vehicleDetails.getVehicleType());
            vehicle.setLicensePlate(vehicleDetails.getLicensePlate());
            vehicle.setOwner(vehicleDetails.getOwner());
            vehicle.setOrganization(vehicleDetails.getOrganization());
            vehicle.setAlarmSystem(vehicleDetails.getAlarmSystem());
            Vehicle updatedVehicle = vehicleRepository.save(vehicle);
            return ResponseEntity.ok(updatedVehicle);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteVehicle(@PathVariable Long id) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicleRepository.delete(vehicle);
            return ResponseEntity.<Void>ok().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

}
