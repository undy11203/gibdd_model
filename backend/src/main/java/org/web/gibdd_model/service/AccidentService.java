package org.web.gibdd_model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.web.gibdd_model.model.Accident;
import org.web.gibdd_model.repository.AccidentRepository;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class AccidentService {

    @Autowired
    private AccidentRepository accidentRepository;

    public Page<Accident> getAccidents(LocalDate dateFrom, LocalDate dateTo, String type, Pageable pageable) {
        if (dateFrom != null && dateTo != null && type != null && !type.isEmpty()) {
            return accidentRepository.findByDateBetweenAndType(dateFrom, dateTo, type, pageable);
        } else if (dateFrom != null && dateTo != null) {
            return accidentRepository.findByDateBetween(dateFrom, dateTo, pageable);
        } else if (type != null && !type.isEmpty()) {
            return accidentRepository.findByType(type, pageable);
        }
        return accidentRepository.findAll(pageable);
    }

    public Accident createAccident(Accident accident) {
        return accidentRepository.save(accident);
    }

    public Optional<Accident> getAccidentById(Long id) {
        return accidentRepository.findById(id);
    }

    public Optional<Accident> updateAccident(Long id, Accident accidentDetails) {
        return accidentRepository.findById(id).map(accident -> {
            accident.setDate(accidentDetails.getDate());
            accident.setLocation(accidentDetails.getLocation());
            accident.setType(accidentDetails.getType());
            accident.setDescription(accidentDetails.getDescription());
            accident.setVictimsCount(accidentDetails.getVictimsCount());
            accident.setDamageAmount(accidentDetails.getDamageAmount());
            accident.setCause(accidentDetails.getCause());
            accident.setRoadConditions(accidentDetails.getRoadConditions());
            return accidentRepository.save(accident);
        });
    }

    public boolean deleteAccident(Long id) {
        return accidentRepository.findById(id).map(accident -> {
            accidentRepository.delete(accident);
            return true;
        }).orElse(false);
    }
}
