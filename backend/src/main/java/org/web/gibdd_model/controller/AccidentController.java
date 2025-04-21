//package org.web.gibdd_model.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.web.gibdd_model.model.Accident;
//import org.web.gibdd_model.repository.AccidentRepository;
//
//import java.time.LocalDate;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/accidents")
//public class AccidentController {
//
//    @Autowired
//    private AccidentRepository accidentRepository;
//
//    @GetMapping
//    public Page<Accident> getAccidents(
//            @RequestParam(required = false) LocalDate dateFrom,
//            @RequestParam(required = false) LocalDate dateTo,
//            @RequestParam(required = false) String type,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int limit) {
//        Pageable pageable = PageRequest.of(page, limit);
//        if (dateFrom != null && dateTo != null && type != null && !type.isEmpty()) {
//            return accidentRepository.findByDateBetweenAndType(dateFrom, dateTo, type, pageable);
//        } else if (dateFrom != null && dateTo != null) {
//            return accidentRepository.findByDateBetween(dateFrom, dateTo, pageable);
//        } else if (type != null && !type.isEmpty()) {
//            return accidentRepository.findByType(type, pageable);
//        }
//        return accidentRepository.findAll(pageable);
//    }
//
//    @PostMapping
//    public Accident createAccident(@RequestBody Accident accident) {
//        return accidentRepository.save(accident);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Accident> getAccidentById(@PathVariable Long id) {
//        Optional<Accident> accident = accidentRepository.findById(id);
//        return accident.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<Accident> updateAccident(@PathVariable Long id, @RequestBody Accident accidentDetails) {
//        return accidentRepository.findById(id).map(accident -> {
//            accident.setDate(accidentDetails.getDate());
//            accident.setLocation(accidentDetails.getLocation());
//            accident.setType(accidentDetails.getType());
//            accident.setDescription(accidentDetails.getDescription());
//            accident.setVictimsCount(accidentDetails.getVictimsCount());
//            accident.setDamageAmount(accidentDetails.getDamageAmount());
//            accident.setCause(accidentDetails.getCause());
//            accident.setRoadConditions(accidentDetails.getRoadConditions());
//            Accident updatedAccident = accidentRepository.save(accident);
//            return ResponseEntity.ok(updatedAccident);
//        }).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Object> deleteAccident(@PathVariable Long id) {
//        return accidentRepository.findById(id).map(accident -> {
//            accidentRepository.delete(accident);
//            return ResponseEntity.<Void>ok().build();
//        }).orElseGet(() -> ResponseEntity.<Void>notFound().build());
//    }
//}
