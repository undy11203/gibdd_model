package org.web.gibdd_model.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.web.gibdd_model.model.*;
import org.web.gibdd_model.repository.*;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        // Initialize permissions
        List<Permission> permissions = initializePermissions();
        
        // Initialize roles
        Map<String, Role> roles = initializeRoles(permissions);
        
        // Initialize users
        initializeUsers(roles);
        
        // Initialize database triggers
        initializeTriggers();
    }
    
    private void initializeTriggers() {
        try {
            // Load SQL triggers from file
            ClassPathResource resource = new ClassPathResource("triggers.sql");
            Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
            String sql = FileCopyUtils.copyToString(reader);
            
            // Execute SQL triggers
            jdbcTemplate.execute(sql);
            
            System.out.println("Database triggers initialized successfully");
        } catch (IOException e) {
            System.err.println("Error initializing database triggers: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private List<Permission> initializePermissions() {
        List<Permission> requiredPermissions = Arrays.asList(
            // Accidents
            createPermission("VIEW_ACCIDENTS", "accidents", "read", "Просмотр записей о ДТП"),
            createPermission("CREATE_ACCIDENTS", "accidents", "write", "Создание записей о ДТП"),
            
            // Vehicles
            createPermission("VIEW_VEHICLES", "vehicles", "read", "Просмотр информации о ТС"),
            createPermission("MANAGE_VEHICLES", "vehicles", "write", "Управление записями о ТС"),
            
            // Owners
            createPermission("VIEW_OWNERS", "owners", "read", "Просмотр информации о владельцах"),
            createPermission("MANAGE_OWNERS", "owners", "write", "Управление записями о владельцах"),
            
            // Wanted
            createPermission("VIEW_WANTED", "wanted", "read", "Просмотр списка розыска"),
            createPermission("MANAGE_WANTED", "wanted", "write", "Управление списком розыска"),
            
            // Admin
            createPermission("EXECUTE_QUERIES", "sql", "execute", "Выполнение SQL запросов"),
            createPermission("MANAGE_ROLES", "roles", "manage", "Управление ролями и разрешениями"),
            createPermission("VIEW_STATISTICS", "statistics", "read", "Просмотр статистики"),
            
            // Inspections
            createPermission("VIEW_INSPECTIONS", "inspections", "read", "Просмотр тех. осмотров"),
            createPermission("MANAGE_INSPECTIONS", "inspections", "write", "Управление тех. осмотрами"),
            
            // Organizations
            createPermission("VIEW_ORGANIZATIONS", "organizations", "read", "Просмотр организаций"),
            createPermission("MANAGE_ORGANIZATIONS", "organizations", "write", "Управление организациями"),
            
            // Brands
            createPermission("VIEW_BRANDS", "brands", "read", "Просмотр марок ТС"),
            createPermission("MANAGE_BRANDS", "brands", "write", "Управление марками ТС"),
            
            // License Plates
            createPermission("VIEW_LICENSE_PLATES", "license-plates", "read", "Просмотр гос. номеров"),
            createPermission("MANAGE_LICENSE_PLATES", "license-plates", "write", "Управление гос. номерами"),
            
            // Alarm Systems
            createPermission("VIEW_ALARM_SYSTEMS", "alarm-systems", "read", "Просмотр охранных систем"),
            createPermission("MANAGE_ALARM_SYSTEMS", "alarm-systems", "write", "Управление охранными системами"),
            
            // Sales/Purchases
            createPermission("VIEW_SALES", "sales-purchases", "read", "Просмотр продаж/покупок"),
            createPermission("MANAGE_SALES", "sales-purchases", "write", "Управление продажами/покупками")
        );

        List<Permission> existingPermissions = permissionRepository.findAll();
        Map<String, Permission> existingPermissionMap = existingPermissions.stream()
            .collect(Collectors.toMap(Permission::getName, p -> p));

        List<Permission> newPermissions = new ArrayList<>();
        for (Permission permission : requiredPermissions) {
            if (!existingPermissionMap.containsKey(permission.getName())) {
                newPermissions.add(permission);
            }
        }

        if (!newPermissions.isEmpty()) {
            permissionRepository.saveAll(newPermissions);
        }

        return permissionRepository.findAll();
    }

    private Map<String, Role> initializeRoles(List<Permission> permissions) {
        Map<String, Role> roles = new HashMap<>();

        // Суперадминистратор
        Role superAdminRole = roleRepository.findByName("ROLE_SUPERADMIN")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_SUPERADMIN");
                role.setDescription("Суперадминистратор системы");
                role.setPermissions(new HashSet<>(permissions));
                role.setSuperAdmin(true);
                return roleRepository.save(role);
            });
        roles.put("superadmin", superAdminRole);

        // Инспектор ГИБДД
        Role inspectorRole = roleRepository.findByName("ROLE_INSPECTOR")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_INSPECTOR");
                role.setDescription("Инспектор ГИБДД");
                role.setPermissions(new HashSet<>(Arrays.asList(
                    findPermission(permissions, "VIEW_ACCIDENTS"),
                    findPermission(permissions, "CREATE_ACCIDENTS"),
                    findPermission(permissions, "VIEW_VEHICLES"),
                    findPermission(permissions, "MANAGE_VEHICLES"),
                    findPermission(permissions, "VIEW_OWNERS"),
                    findPermission(permissions, "VIEW_WANTED"),
                    findPermission(permissions, "VIEW_STATISTICS"),
                    findPermission(permissions, "VIEW_INSPECTIONS")
                )));
                return roleRepository.save(role);
            });
        roles.put("inspector", inspectorRole);

        // Оператор тех. осмотра
        Role technicianRole = roleRepository.findByName("ROLE_TECHNICIAN")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_TECHNICIAN");
                role.setDescription("Оператор технического осмотра");
                role.setPermissions(new HashSet<>(Arrays.asList(
                    findPermission(permissions, "VIEW_VEHICLES"),
                    findPermission(permissions, "VIEW_OWNERS"),
                    findPermission(permissions, "VIEW_INSPECTIONS"),
                    findPermission(permissions, "MANAGE_INSPECTIONS")
                )));
                return roleRepository.save(role);
            });
        roles.put("technician", technicianRole);

        // Оператор розыска
        Role searchOperatorRole = roleRepository.findByName("ROLE_SEARCH_OPERATOR")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_SEARCH_OPERATOR");
                role.setDescription("Оператор розыска");
                role.setPermissions(new HashSet<>(Arrays.asList(
                    findPermission(permissions, "VIEW_VEHICLES"),
                    findPermission(permissions, "VIEW_OWNERS"),
                    findPermission(permissions, "VIEW_WANTED"),
                    findPermission(permissions, "MANAGE_WANTED")
                )));
                return roleRepository.save(role);
            });
        roles.put("search_operator", searchOperatorRole);

        // Новые роли для каждого контроллера
        
        // Роль для AccidentController
        Role accidentManagerRole = roleRepository.findByName("ROLE_ACCIDENT_MANAGER")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_ACCIDENT_MANAGER");
                role.setDescription("Менеджер ДТП");
                role.setPermissions(new HashSet<>(Arrays.asList(
                    findPermission(permissions, "VIEW_ACCIDENTS"),
                    findPermission(permissions, "CREATE_ACCIDENTS"),
                    findPermission(permissions, "VIEW_VEHICLES"),
                    findPermission(permissions, "VIEW_OWNERS")
                )));
                return roleRepository.save(role);
            });
        roles.put("accident_manager", accidentManagerRole);

        // Роль для AdminController
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_ADMIN");
                role.setDescription("Администратор");
                role.setPermissions(new HashSet<>(Arrays.asList(
                    findPermission(permissions, "EXECUTE_QUERIES"),
                    findPermission(permissions, "MANAGE_ROLES"),
                    findPermission(permissions, "VIEW_STATISTICS")
                )));
                return roleRepository.save(role);
            });
        roles.put("admin", adminRole);

        // Роль для AlarmSystemController
        Role alarmSystemManagerRole = roleRepository.findByName("ROLE_ALARM_SYSTEM_MANAGER")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_ALARM_SYSTEM_MANAGER");
                role.setDescription("Менеджер охранных систем");
                role.setPermissions(new HashSet<>(Arrays.asList(
                    findPermission(permissions, "VIEW_ALARM_SYSTEMS"),
                    findPermission(permissions, "MANAGE_ALARM_SYSTEMS")
                )));
                return roleRepository.save(role);
            });
        roles.put("alarm_system_manager", alarmSystemManagerRole);

        // Роль для BrandController
        Role brandManagerRole = roleRepository.findByName("ROLE_BRAND_MANAGER")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_BRAND_MANAGER");
                role.setDescription("Менеджер марок ТС");
                role.setPermissions(new HashSet<>(Arrays.asList(
                    findPermission(permissions, "VIEW_BRANDS"),
                    findPermission(permissions, "MANAGE_BRANDS")
                )));
                return roleRepository.save(role);
            });
        roles.put("brand_manager", brandManagerRole);

        // Роль для NumberController (License Plates)
        Role licensePlateManagerRole = roleRepository.findByName("ROLE_LICENSE_PLATE_MANAGER")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_LICENSE_PLATE_MANAGER");
                role.setDescription("Менеджер гос. номеров");
                role.setPermissions(new HashSet<>(Arrays.asList(
                    findPermission(permissions, "VIEW_LICENSE_PLATES"),
                    findPermission(permissions, "MANAGE_LICENSE_PLATES")
                )));
                return roleRepository.save(role);
            });
        roles.put("license_plate_manager", licensePlateManagerRole);

        // Роль для OrganizationController
        Role organizationManagerRole = roleRepository.findByName("ROLE_ORGANIZATION_MANAGER")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_ORGANIZATION_MANAGER");
                role.setDescription("Менеджер организаций");
                role.setPermissions(new HashSet<>(Arrays.asList(
                    findPermission(permissions, "VIEW_ORGANIZATIONS"),
                    findPermission(permissions, "MANAGE_ORGANIZATIONS")
                )));
                return roleRepository.save(role);
            });
        roles.put("organization_manager", organizationManagerRole);

        // Роль для OwnerController
        Role ownerManagerRole = roleRepository.findByName("ROLE_OWNER_MANAGER")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_OWNER_MANAGER");
                role.setDescription("Менеджер владельцев");
                role.setPermissions(new HashSet<>(Arrays.asList(
                    findPermission(permissions, "VIEW_OWNERS"),
                    findPermission(permissions, "MANAGE_OWNERS")
                )));
                return roleRepository.save(role);
            });
        roles.put("owner_manager", ownerManagerRole);

        // Роль для SalePurchaseController
        Role salePurchaseManagerRole = roleRepository.findByName("ROLE_SALE_PURCHASE_MANAGER")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_SALE_PURCHASE_MANAGER");
                role.setDescription("Менеджер продаж/покупок");
                role.setPermissions(new HashSet<>(Arrays.asList(
                    findPermission(permissions, "VIEW_SALES"),
                    findPermission(permissions, "MANAGE_SALES"),
                    findPermission(permissions, "VIEW_VEHICLES"),
                    findPermission(permissions, "VIEW_OWNERS")
                )));
                return roleRepository.save(role);
            });
        roles.put("sale_purchase_manager", salePurchaseManagerRole);

        // Роль для VehicleController
        Role vehicleManagerRole = roleRepository.findByName("ROLE_VEHICLE_MANAGER")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_VEHICLE_MANAGER");
                role.setDescription("Менеджер транспортных средств");
                role.setPermissions(new HashSet<>(Arrays.asList(
                    findPermission(permissions, "VIEW_VEHICLES"),
                    findPermission(permissions, "MANAGE_VEHICLES")
                )));
                return roleRepository.save(role);
            });
        roles.put("vehicle_manager", vehicleManagerRole);

        return roles;
    }

    private void initializeUsers(Map<String, Role> roles) {
        // Администратор системы
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin"));
            adminUser.setFullName("Системный Администратор");
            adminUser.setRoles(Set.of(roles.get("superadmin")));
            userRepository.save(adminUser);
        }

        // Инспектор ГИБДД
        if (!userRepository.existsByUsername("inspector")) {
            User inspectorUser = new User();
            inspectorUser.setUsername("inspector");
            inspectorUser.setPassword(passwordEncoder.encode("inspector"));
            inspectorUser.setFullName("Иванов Иван Иванович");
            inspectorUser.setRoles(Set.of(roles.get("inspector")));
            userRepository.save(inspectorUser);
        }

        // Оператор тех. осмотра
        if (!userRepository.existsByUsername("technician")) {
            User technicianUser = new User();
            technicianUser.setUsername("technician");
            technicianUser.setPassword(passwordEncoder.encode("technician"));
            technicianUser.setFullName("Петров Петр Петрович");
            technicianUser.setRoles(Set.of(roles.get("technician")));
            userRepository.save(technicianUser);
        }

        // Оператор розыска
        if (!userRepository.existsByUsername("search")) {
            User searchUser = new User();
            searchUser.setUsername("search");
            searchUser.setPassword(passwordEncoder.encode("search"));
            searchUser.setFullName("Сидоров Сидор Сидорович");
            searchUser.setRoles(Set.of(roles.get("search_operator")));
            userRepository.save(searchUser);
        }
        
        // Пользователи для новых ролей
        if (!userRepository.existsByUsername("accident_manager")) {
            User user = new User();
            user.setUsername("accident_manager");
            user.setPassword(passwordEncoder.encode("password"));
            user.setFullName("Менеджер ДТП");
            user.setRoles(Set.of(roles.get("accident_manager")));
            userRepository.save(user);
        }
        
        if (!userRepository.existsByUsername("admin_user")) {
            User user = new User();
            user.setUsername("admin_user");
            user.setPassword(passwordEncoder.encode("password"));
            user.setFullName("Администратор");
            user.setRoles(Set.of(roles.get("admin")));
            userRepository.save(user);
        }
        
        if (!userRepository.existsByUsername("alarm_manager")) {
            User user = new User();
            user.setUsername("alarm_manager");
            user.setPassword(passwordEncoder.encode("password"));
            user.setFullName("Менеджер охранных систем");
            user.setRoles(Set.of(roles.get("alarm_system_manager")));
            userRepository.save(user);
        }
        
        if (!userRepository.existsByUsername("brand_manager")) {
            User user = new User();
            user.setUsername("brand_manager");
            user.setPassword(passwordEncoder.encode("password"));
            user.setFullName("Менеджер марок ТС");
            user.setRoles(Set.of(roles.get("brand_manager")));
            userRepository.save(user);
        }
        
        if (!userRepository.existsByUsername("plate_manager")) {
            User user = new User();
            user.setUsername("plate_manager");
            user.setPassword(passwordEncoder.encode("password"));
            user.setFullName("Менеджер гос. номеров");
            user.setRoles(Set.of(roles.get("license_plate_manager")));
            userRepository.save(user);
        }
        
        if (!userRepository.existsByUsername("org_manager")) {
            User user = new User();
            user.setUsername("org_manager");
            user.setPassword(passwordEncoder.encode("password"));
            user.setFullName("Менеджер организаций");
            user.setRoles(Set.of(roles.get("organization_manager")));
            userRepository.save(user);
        }
        
        if (!userRepository.existsByUsername("owner_manager")) {
            User user = new User();
            user.setUsername("owner_manager");
            user.setPassword(passwordEncoder.encode("password"));
            user.setFullName("Менеджер владельцев");
            user.setRoles(Set.of(roles.get("owner_manager")));
            userRepository.save(user);
        }
        
        if (!userRepository.existsByUsername("sale_manager")) {
            User user = new User();
            user.setUsername("sale_manager");
            user.setPassword(passwordEncoder.encode("password"));
            user.setFullName("Менеджер продаж/покупок");
            user.setRoles(Set.of(roles.get("sale_purchase_manager")));
            userRepository.save(user);
        }
        
        if (!userRepository.existsByUsername("vehicle_manager")) {
            User user = new User();
            user.setUsername("vehicle_manager");
            user.setPassword(passwordEncoder.encode("password"));
            user.setFullName("Менеджер транспортных средств");
            user.setRoles(Set.of(roles.get("vehicle_manager")));
            userRepository.save(user);
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
