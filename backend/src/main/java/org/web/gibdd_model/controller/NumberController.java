//package org.web.gibdd_model.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.web.gibdd_model.model.LicensePlate;
//import org.web.gibdd_model.repository.LicensePlateRepository;
//
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/numbers")
//public class NumberController {
//
//    @Autowired
//    private LicensePlateRepository licensePlateRepository;
//
//    @GetMapping
//    public Page<LicensePlate> getNumbers(
//            @RequestParam(required = false) Boolean status,
//            @RequestParam(required = false) String series,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int limit) {
//        Pageable pageable = PageRequest.of(page, limit);
//        if (status != null && series != null && !series.isEmpty()) {
//            return licensePlateRepository.findByStatusAndSeries(status, series, pageable);
//        } else if (status != null) {
//            return licensePlateRepository.findByStatus(status, pageable);
//        } else if (series != null && !series.isEmpty()) {
//            return licensePlateRepository.findBySeries(series, pageable);
//        }
//        return licensePlateRepository.findAll(pageable);
//    }
//
//    @PostMapping
//    public LicensePlate createNumber(@RequestBody LicensePlate licensePlate) {
//        return licensePlateRepository.save(licensePlate);
//    }
//
//    @GetMapping("/{number}")
//    public ResponseEntity<LicensePlate> getNumberById(@PathVariable String number) {
//        Optional<LicensePlate> licensePlate = licensePlateRepository.findByNumber(number);
//        return licensePlate.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    @PutMapping("/{number}")
//    public ResponseEntity<LicensePlate> updateNumber(@PathVariable String number, @RequestBody LicensePlate licensePlateDetails) {
//        return licensePlateRepository.findByNumber(number).map(licensePlate -> {
//            licensePlate.setGosNumber(licensePlateDetails.getGosNumber());
//            licensePlate.setNumber(licensePlateDetails.getNumber());
//            licensePlate.setSeries(licensePlateDetails.getSeries());
//            licensePlate.setStatus(licensePlateDetails.getStatus());
//            LicensePlate updatedLicensePlate = licensePlateRepository.save(licensePlate);
//            return ResponseEntity.ok(updatedLicensePlate);
//        }).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    @DeleteMapping("/{number}")
//    public ResponseEntity<Void> deleteNumber(@PathVariable String number) {
//        return licensePlateRepository.findByNumber(number).map(licensePlate -> {
//            licensePlateRepository.delete(licensePlate);
//            return ResponseEntity.<Void>ok().build();
//        }).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//}
