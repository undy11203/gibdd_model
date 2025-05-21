package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.web.gibdd_model.model.AlarmSystem;
import org.web.gibdd_model.repository.AlarmSystemRepository;

@RestController
@RequestMapping("/api/alarm-systems")
public class AlarmSystemController {

    private final AlarmSystemRepository alarmSystemRepository;

    @Autowired
    public AlarmSystemController(AlarmSystemRepository alarmSystemRepository) {
        this.alarmSystemRepository = alarmSystemRepository;
    }

    @GetMapping
    public Page<AlarmSystem> getAlarmSystems(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        
        return alarmSystemRepository.findByNameContaining(search, PageRequest.of(page, limit));
    }

    @GetMapping("/reliable")
    public List<Object[]> getMostReliableAlarmSystems() {
        return alarmSystemRepository.getMostReliableAlarmSystems();
    }
}
