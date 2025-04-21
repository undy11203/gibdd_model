//package org.web.gibdd_model.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.web.gibdd_model.model.Theft;
//import org.web.gibdd_model.repository.TheftRepository;
//
//import java.time.LocalDate;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/thefts")
//public class TheftController {
//
//    @Autowired
//    private TheftRepository theftRepository;
//
//    @GetMapping
//    public Page<Theft> getThefts(
//            @RequestParam(required = false) LocalDate dateFrom,
//            @RequestParam(required = false) LocalDate dateTo,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int limit) {
//        Pageable pageable = PageRequest.of(page, limit);
//        if (dateFrom != null && dateTo != null) {
//            return theftRepository.findByTheftDateBetween(dateFrom, dateTo, pageable);
//        }
//        return theftRepository.findAll(pageable);
//    }
//
//    @PostMapping
//    public Theft createTheft(@RequestBody Theft theft) {
//        return theftRepository.save(theft);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Theft> getTheftById(@PathVariable Long id) {
//        Optional<Theft> theft = theftRepository.findById(id);
//        return theft.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<Theft> updateTheft(@PathVariable Long id, @RequestBody Theft theftDetails) {
//        return theftRepository.findById(id).map(theft -> {
//            theft.setVehicle(theftDetails.getVehicle());
//            theft.setTheftDate(theftDetails.getTheftDate());
//            theft.setLocation(theftDetails.getLocation());
//            theft.setDescription(theftDetails.getDescription());
//            Theft updatedTheft = theftRepository.save(theft);
//            return ResponseEntity.ok(updatedTheft);
//        }).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Object> deleteTheft(@PathVariable Long id) {
//        return theftRepository.findById(id).map(theft -> {
//            theftRepository.delete(theft);
//            return ResponseEntity.<Void>ok().build();
//        }).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//}
