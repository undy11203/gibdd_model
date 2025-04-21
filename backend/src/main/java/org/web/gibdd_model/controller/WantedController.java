//package org.web.gibdd_model.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.web.gibdd_model.model.WantedVehicle;
//import org.web.gibdd_model.repository.WantedVehicleRepository;
//
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/wanted")
//public class WantedController {
//
//    @Autowired
//    private WantedVehicleRepository wantedVehicleRepository;
//
//    @GetMapping
//    public Page<WantedVehicle> getWantedVehicles(
//            @RequestParam(required = false) String status,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int limit) {
//        Pageable pageable = PageRequest.of(page, limit);
//        if (status != null && !status.isEmpty()) {
//            return wantedVehicleRepository.findByStatus(status, pageable);
//        }
//        return wantedVehicleRepository.findAll(pageable);
//    }
//
//    @PostMapping
//    public WantedVehicle createWantedVehicle(@RequestBody WantedVehicle wantedVehicle) {
//        return wantedVehicleRepository.save(wantedVehicle);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<WantedVehicle> getWantedVehicleById(@PathVariable Long id) {
//        Optional<WantedVehicle> wantedVehicle = wantedVehicleRepository.findById(Math.toIntExact(id));
//        return wantedVehicle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<WantedVehicle> updateWantedVehicle(@PathVariable Long id, @RequestBody WantedVehicle wantedVehicleDetails) {
//        return wantedVehicleRepository.findById(Math.toIntExact(id)).map(wantedVehicle -> {
//            wantedVehicle.setVehicle(wantedVehicleDetails.getVehicle());
//            wantedVehicle.setAddedDate(wantedVehicleDetails.getAddedDate());
//            wantedVehicle.setReason(wantedVehicleDetails.getReason());
//            wantedVehicle.setStatus(wantedVehicleDetails.getStatus());
//            WantedVehicle updatedWantedVehicle = wantedVehicleRepository.save(wantedVehicle);
//            return ResponseEntity.ok(updatedWantedVehicle);
//        }).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Object> deleteWantedVehicle(@PathVariable Long id) {
//        return wantedVehicleRepository.findById(Math.toIntExact(id)).map(wantedVehicle -> {
//            wantedVehicleRepository.delete(wantedVehicle);
//            return ResponseEntity.<Void>ok().build();
//        }).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//}
