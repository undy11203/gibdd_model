package org.web.gibdd_model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.web.gibdd_model.model.Role;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
    boolean existsByName(String name);
}
