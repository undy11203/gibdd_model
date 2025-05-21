package org.web.gibdd_model.service;

import org.springframework.stereotype.Service;
import org.web.gibdd_model.model.enums.Reliability;

import java.util.Collection;
import java.util.List;
import java.util.stream.Stream;

@Service
public class AlarmSystemService {

    public Collection<Object> getReliableAlarmSystems() {
        return List.of(Stream.of(Reliability.values())
                .map(Reliability::getDescription)
                .toArray(String[]::new));
    }
}
