package org.web.gibdd_model.service;

import org.springframework.stereotype.Service;
import org.web.gibdd_model.model.enums.TheftPopularity;

import java.util.Collection;
import java.util.List;
import java.util.stream.Stream;

@Service
public class BrandService {
    public Collection<Object> getTheftPopularity() {
        return List.of(Stream.of(TheftPopularity.values())
                .map(TheftPopularity::getDescription)
                .toArray(String[]::new));
    }
}
