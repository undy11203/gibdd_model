package org.web.gibdd_model.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.web.gibdd_model.model.*;
import org.web.gibdd_model.repository.*;

import java.util.*;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Initialize permissions
        List<Permission> permissions = initializePermissions();
        
        // Initialize roles
        Map<String, Role> roles = initializeRoles(permissions);
        
        // Initialize users
        initializeUsers(roles);
    }

    private List<Permission> initializePermissions() {
        List<Permission> permissions = Arrays.asList(
            createPermission("VIEW_ACCIDENTS", "accidents", "read", "Просмотр записей о ДТП"),
            createPermission("CREATE_ACCIDENTS", "accidents", "write", "Создание записей о ДТП"),
            createPermission("VIEW_VEHICLES", "vehicles", "read", "Просмотр информации о ТС"),
            createPermission("MANAGE_VEHICLES", "vehicles", "write", "Управление записями о ТС"),
            createPermission("VIEW_OWNERS", "owners", "read", "Просмотр информации о владельцах"),
            createPermission("MANAGE_OWNERS", "owners", "write", "Управление записями о владельцах"),
            createPermission("VIEW_WANTED", "wanted", "read", "Просмотр списка розыска"),
            createPermission("MANAGE_WANTED", "wanted", "write", "Управление списком розыска"),
            createPermission("EXECUTE_QUERIES", "sql", "execute", "Выполнение SQL запросов"),
            createPermission("MANAGE_ROLES", "roles", "manage", "Управление ролями и разрешениями"),
            createPermission("VIEW_STATISTICS", "statistics", "read", "Просмотр статистики"),
            createPermission("VIEW_INSPECTIONS", "inspections", "read", "Просмотр тех. осмотров"),
            createPermission("MANAGE_INSPECTIONS", "inspections", "write", "Управление тех. осмотрами")
        );

        return permissionRepository.saveAll(permissions);
    }

    private Map<String, Role> initializeRoles(List<Permission> permissions) {
        Map<String, Role> roles = new HashMap<>();

        // Суперадминистратор
        Role superAdminRole = new Role();
        superAdminRole.setName("ROLE_SUPERADMIN");
        superAdminRole.setDescription("Суперадминистратор системы");
        superAdminRole.setPermissions(new HashSet<>(permissions));
        superAdminRole.setSuperAdmin(true);
        roles.put("superadmin", roleRepository.save(superAdminRole));

        // Инспектор ГИБДД
        Role inspectorRole = new Role();
        inspectorRole.setName("ROLE_INSPECTOR");
        inspectorRole.setDescription("Инспектор ГИБДД");
        inspectorRole.setPermissions(new HashSet<>(Arrays.asList(
            findPermission(permissions, "VIEW_ACCIDENTS"),
            findPermission(permissions, "CREATE_ACCIDENTS"),
            findPermission(permissions, "VIEW_VEHICLES"),
            findPermission(permissions, "MANAGE_VEHICLES"),
            findPermission(permissions, "VIEW_OWNERS"),
            findPermission(permissions, "VIEW_WANTED"),
            findPermission(permissions, "VIEW_STATISTICS"),
            findPermission(permissions, "VIEW_INSPECTIONS")
        )));
        roles.put("inspector", roleRepository.save(inspectorRole));

        // Оператор тех. осмотра
        Role technicianRole = new Role();
        technicianRole.setName("ROLE_TECHNICIAN");
        technicianRole.setDescription("Оператор технического осмотра");
        technicianRole.setPermissions(new HashSet<>(Arrays.asList(
            findPermission(permissions, "VIEW_VEHICLES"),
            findPermission(permissions, "VIEW_OWNERS"),
            findPermission(permissions, "VIEW_INSPECTIONS"),
            findPermission(permissions, "MANAGE_INSPECTIONS")
        )));
        roles.put("technician", roleRepository.save(technicianRole));

        // Оператор розыска
        Role searchOperatorRole = new Role();
        searchOperatorRole.setName("ROLE_SEARCH_OPERATOR");
        searchOperatorRole.setDescription("Оператор розыска");
        searchOperatorRole.setPermissions(new HashSet<>(Arrays.asList(
            findPermission(permissions, "VIEW_VEHICLES"),
            findPermission(permissions, "VIEW_OWNERS"),
            findPermission(permissions, "VIEW_WANTED"),
            findPermission(permissions, "MANAGE_WANTED")
        )));
        roles.put("search_operator", roleRepository.save(searchOperatorRole));

        return roles;
    }

    private void initializeUsers(Map<String, Role> roles) {
        // Администратор системы
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin"));
            adminUser.setFullName("Системный Администратор");
            adminUser.setEmail("admin@gibdd.local");
            adminUser.setRoles(Set.of(roles.get("superadmin")));
            userRepository.save(adminUser);
        }

        // Инспектор ГИБДД
        if (!userRepository.existsByUsername("inspector")) {
            User inspectorUser = new User();
            inspectorUser.setUsername("inspector");
            inspectorUser.setPassword(passwordEncoder.encode("inspector"));
            inspectorUser.setFullName("Иванов Иван Иванович");
            inspectorUser.setEmail("inspector@gibdd.local");
            inspectorUser.setRoles(Set.of(roles.get("inspector")));
            userRepository.save(inspectorUser);
        }

        // Оператор тех. осмотра
        if (!userRepository.existsByUsername("technician")) {
            User technicianUser = new User();
            technicianUser.setUsername("technician");
            technicianUser.setPassword(passwordEncoder.encode("technician"));
            technicianUser.setFullName("Петров Петр Петрович");
            technicianUser.setEmail("technician@gibdd.local");
            technicianUser.setRoles(Set.of(roles.get("technician")));
            userRepository.save(technicianUser);
        }

        // Оператор розыска
        if (!userRepository.existsByUsername("search")) {
            User searchUser = new User();
            searchUser.setUsername("search");
            searchUser.setPassword(passwordEncoder.encode("search"));
            searchUser.setFullName("Сидоров Сидор Сидорович");
            searchUser.setEmail("search@gibdd.local");
            searchUser.setRoles(Set.of(roles.get("search_operator")));
            userRepository.save(searchUser);
        }
    }

    private Permission createPermission(String name, String resource, String action, String description) {
        Permission permission = new Permission();
        permission.setName(name);
        permission.setResource(resource);
        permission.setAction(action);
        permission.setDescription(description);
        return permission;
    }

    private Permission findPermission(List<Permission> permissions, String name) {
        return permissions.stream()
            .filter(p -> p.getName().equals(name))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Permission not found: " + name));
    }
}
