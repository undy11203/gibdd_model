package org.web.gibdd_model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web.gibdd_model.model.FreeLicensePlateRange;
import org.web.gibdd_model.model.LicensePlate;
import org.web.gibdd_model.repository.FreeLicensePlateRangeRepository;
import org.web.gibdd_model.repository.LicensePlateRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class LicensePlateService {

    @Autowired
    private LicensePlateRepository licensePlateRepository;

    @Autowired
    private FreeLicensePlateRangeRepository freeLicensePlateRangeRepository;

    private static final Pattern LICENSE_PLATE_PATTERN = Pattern.compile("^[ABEKMHOPCTYX]{1}\\d{3}[ABEKMHOPCTYX]{2}$");

    // Проверка корректности номера с учетом паттерна, таблицы номеров и диапазонов
    public boolean validateLicensePlateFormat(String licenseNumber) {
        if (licenseNumber == null) {
            return false;
        }
        if (!LICENSE_PLATE_PATTERN.matcher(licenseNumber).matches()) {
            return false;
        }
        if (licenseNumber.length() != 6) {
            return false;
        }
        var plateOpt = licensePlateRepository.findById(licenseNumber);
        if (plateOpt.isPresent()) {
            return plateOpt.get().getStatus();
        }
        String series = licenseNumber.substring(0, 1) + licenseNumber.substring(4, 6);
        String numberStr = licenseNumber.substring(1, 4);
        int number;
        try {
            number = Integer.parseInt(numberStr);
        } catch (NumberFormatException e) {
            return false;
        }
        var freeRangeOpt = freeLicensePlateRangeRepository.findById(series);
        if (freeRangeOpt.isEmpty()) {
            return false;
        }
        var freeRange = freeRangeOpt.get();
        return number >= freeRange.getStartNumber() && number <= freeRange.getEndNumber();
    }

    // Создание номера из свободных диапазонов
    public LicensePlate createLicensePlate(String series) {
        Optional<FreeLicensePlateRange> freeRangeOpt = freeLicensePlateRangeRepository.findById(series);
        if (freeRangeOpt.isEmpty()) {
            return null;
        }
        FreeLicensePlateRange freeRange = freeRangeOpt.get();

        for (int num = freeRange.getStartNumber(); num <= freeRange.getEndNumber(); num++) {
            String licenseNumber = buildLicenseNumber(num, series);
            Optional<LicensePlate> existingPlate = licensePlateRepository.findById(licenseNumber);
            if (existingPlate.isEmpty() || (existingPlate.isPresent() && existingPlate.get().getStatus())) {
                LicensePlate plate = existingPlate.orElse(new LicensePlate());
                plate.setLicenseNumber(licenseNumber);
                plate.setSeries(series);
                plate.setNumber(num);
                plate.setStatus(false);
                plate.setDate(LocalDate.now());
                licensePlateRepository.save(plate);
                return plate;
            }
        }
        return null;
    }

    // Освобождение номера
    public boolean freeLicensePlate(String licenseNumber) {
        Optional<LicensePlate> plateOpt = licensePlateRepository.findById(licenseNumber);
        if (plateOpt.isPresent()) {
            LicensePlate plate = plateOpt.get();
            plate.setStatus(true);
            licensePlateRepository.save(plate);
            return true;
        }
        return false;
    }

    // Получение всех использованных номеров
    public java.util.List<LicensePlate> getHotLicensePlates() {
        return licensePlateRepository.findAllByStatusFalseOrStatusTrue();
    }

    private String buildLicenseNumber(int number, String series) {
        if (series.length() != 3) {
            throw new IllegalArgumentException("Series must be 3 letters");
        }
        return series.charAt(0) + String.format("%03d", number) + series.substring(1);
    }
}
