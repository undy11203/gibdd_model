package org.web.gibdd_model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.web.gibdd_model.model.Permission;
import java.util.List;
import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByName(String name);
    List<Permission> findByResource(String resource);
    List<Permission> findByResourceAndAction(String resource, String action);
    boolean existsByNameAndResourceAndAction(String name, String resource, String action);
}
