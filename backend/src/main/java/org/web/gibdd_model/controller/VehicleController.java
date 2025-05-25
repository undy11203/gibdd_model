package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.dto.VehicleDTO;
import org.web.gibdd_model.model.Vehicle;
import org.web.gibdd_model.model.enums.VehicleType;
import org.web.gibdd_model.repository.VehicleRepository;
import org.web.gibdd_model.model.Brand;
import org.web.gibdd_model.model.Owner;
import org.web.gibdd_model.model.Organization;
import org.web.gibdd_model.model.AlarmSystem;
import org.web.gibdd_model.model.LicensePlate;
import org.web.gibdd_model.model.FreeLicensePlateRange;
import org.web.gibdd_model.service.LicensePlateService;
import org.web.gibdd_model.repository.FreeLicensePlateRangeRepository;
import org.web.gibdd_model.repository.BrandRepository;
import org.web.gibdd_model.repository.OwnerRepository;
import org.web.gibdd_model.repository.OrganizationRepository;
import org.web.gibdd_model.repository.AlarmSystemRepository;
import org.web.gibdd_model.repository.LicensePlateRepository;
import org.web.gibdd_model.service.VehicleService;

import java.util.Collection;
import java.util.List;
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

    @Autowired
    private VehicleService vehicleService;

//
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

//
    @GetMapping("/owner-by-license")
    public ResponseEntity<?> getOwnerByLicense(@RequestParam String licenseNumber) {
        var owner = vehicleService.getOwnerByLicenseNumber(licenseNumber);
        if (owner == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(owner);
    }

//
    @GetMapping("/dossier-by-license")
    public ResponseEntity<?> getVehicleDossierByLicense(@RequestParam String licenseNumber) {
        var dossier = vehicleService.getVehicleDossier(licenseNumber);
        if (dossier == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dossier);
    }

//
    @Autowired
    private LicensePlateService licensePlateService;
    
    @Autowired
    private FreeLicensePlateRangeRepository freeLicensePlateRangeRepository;

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody VehicleDTO vehicleDTO) {
        // If the vehicle has a license plate number string but no actual license plate object
        if (vehicleDTO.getLicenseNumber() == null) {
            return ResponseEntity.badRequest().build();
        }

        String licenseNumber = vehicleDTO.getLicenseNumber();

        // Check if the license plate is valid and available
        if (!licensePlateService.validateLicensePlateFormat(licenseNumber)) {
            return ResponseEntity.badRequest().build();
        }

        // Extract the series from the license number (first letter + last two letters)
        String series = licenseNumber.substring(0, 1) + licenseNumber.substring(4, 6);
        int number = Integer.parseInt(licenseNumber.substring(1, 4));

        // Create or update the license plate
        LicensePlate licensePlate = licensePlateRepository.findById(licenseNumber)
                .orElseGet(() -> {
                    LicensePlate newPlate = new LicensePlate();
                    newPlate.setLicenseNumber(licenseNumber);
                    newPlate.setSeries(series);
                    newPlate.setNumber(number);
                    newPlate.setStatus(false); // Mark as used
                    newPlate.setDate(java.time.LocalDate.now());
                    return licensePlateRepository.save(newPlate);
                });

        // If the plate exists but is already in use
        Boolean state = licensePlate.getStatus();
        if (licensePlate.getStatus() != null && state) {
            return ResponseEntity.badRequest().build();
        }

        // Mark the plate as used
        licensePlate.setStatus(false);
        licensePlateRepository.save(licensePlate);

        // Update the free license plate range if needed
        updateFreeLicensePlateRange(series, number);

        // Create a new Vehicle object from VehicleDTO
        Vehicle vehicle = new Vehicle();
        vehicle.setAlarmSystem(alarmSystemRepository.findById(vehicleDTO.getAlarmSystemId()).orElse(null));
        vehicle.setBodyNumber(vehicleDTO.getBodyNumber());
        vehicle.setBrand(brandRepository.findById((long) vehicleDTO.getBrandId()).orElse(null));
        vehicle.setChassisNumber(vehicleDTO.getChassisNumber());
        vehicle.setColor(vehicleDTO.getColor());
        vehicle.setEngineNumber(vehicleDTO.getEngineNumber());
        vehicle.setEngineVolume(Float.valueOf(vehicleDTO.getEngineVolume()));
        vehicle.setLicensePlate(licensePlate);
        vehicle.setOrganization(organizationRepository.findById((long) vehicleDTO.getOrganizationId()).orElse(null));
        vehicle.setOwner(ownerRepository.findById((long) vehicleDTO.getOwnerId()).orElse(null));
        vehicle.setReleaseDate(vehicleDTO.getReleaseDate().atStartOfDay());
        vehicle.setVehicleType(VehicleType.fromDescription(vehicleDTO.getVehicleType()));

        // Save the vehicle
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(savedVehicle);
    }

    private void updateFreeLicensePlateRange(String series, int allocatedNumber) {
        List<FreeLicensePlateRange> ranges = freeLicensePlateRangeRepository.findBySeries(series);

        for (FreeLicensePlateRange range : ranges) {
            if (range.getStartNumber() == allocatedNumber) {
                // Если выделенный номер на начале диапазона, увеличиваем начало
                FreeLicensePlateRange updatedRange = FreeLicensePlateRange.create(
                        series,
                        allocatedNumber + 1,
                        range.getEndNumber()
                );

                // Удаляем старый диапазон и сохраняем новый
                freeLicensePlateRangeRepository.delete(range);
                freeLicensePlateRangeRepository.save(updatedRange);
                break;
            } else if (range.getEndNumber() == allocatedNumber) {
                // Если выделенный номер на конце диапазона, уменьшаем конец
                FreeLicensePlateRange updatedRange = FreeLicensePlateRange.create(
                        series,
                        range.getStartNumber(),
                        allocatedNumber - 1
                );

                // Удаляем старый диапазон и сохраняем новый
                freeLicensePlateRangeRepository.delete(range);
                freeLicensePlateRangeRepository.save(updatedRange);
                break;
            } else if (allocatedNumber > range.getStartNumber() && allocatedNumber < range.getEndNumber()) {
                // Если выделенный номер находится в середине диапазона, делим его на два диапазона

                // Создаем первый диапазон (от оригинального начала до номера перед выделенным)
                FreeLicensePlateRange firstRange = FreeLicensePlateRange.create(
                        series,
                        range.getStartNumber(),
                        allocatedNumber - 1
                );

                // Создаем второй диапазон (от номера после выделенного до оригинального конца)
                FreeLicensePlateRange secondRange = FreeLicensePlateRange.create(
                        series,
                        allocatedNumber + 1,
                        range.getEndNumber()
                );

                // Удаляем оригинальный диапазон и сохраняем два новых диапазона
                freeLicensePlateRangeRepository.delete(range);
                freeLicensePlateRangeRepository.save(firstRange);
                freeLicensePlateRangeRepository.save(secondRange);

                break;
            }
        }
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

    @GetMapping("/vehicle-types")
    public ResponseEntity<Collection<Object>> getVehicleTypes() {
        return ResponseEntity.ok().body(vehicleService.getVehicleTypes());
    }
}
