package org.web.gibdd_model.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.web.gibdd_model.repository.BaseRepository;

import java.util.Optional;

public abstract class BaseService<T, ID> {

    protected final BaseRepository<T, ID> repository;

    public BaseService(BaseRepository<T, ID> repository) {
        this.repository = repository;
    }

    // Create
    public T create(T entity) {
        return repository.save(entity);
    }

    // Read (по ID)
    public Optional<T> findById(ID id) {
        return repository.findById(id);
    }

    // Read (все записи с пагинацией)
    public Page<T> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    // Update
    public T update(T entity) {
        return repository.save(entity); // save() также обновляет существующую запись
    }

    // Delete
    public void deleteById(ID id) {
        repository.deleteById(id);
    }
}