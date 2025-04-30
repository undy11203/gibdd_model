package org.web.gibdd_model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.web.gibdd_model.dto.RoleManagementDTO.*;
import org.web.gibdd_model.model.Permission;
import org.web.gibdd_model.model.Role;
import org.web.gibdd_model.model.User;
import org.web.gibdd_model.repository.PermissionRepository;
import org.web.gibdd_model.repository.RoleRepository;
import org.web.gibdd_model.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import jakarta.persistence.EntityNotFoundException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleManagementService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;

    public Set<PermissionResponse> getCurrentUserPermissions() {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));

        // Collect all permissions from user's roles
        return user.getRoles().stream()
            .flatMap(role -> role.getPermissions().stream())
            .map(this::mapPermissionToResponse)
            .collect(Collectors.toSet());
    }

    public boolean hasPermission(String resource, String action) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));

        // Check if user has superadmin role
        boolean isSuperAdmin = user.getRoles().stream()
            .anyMatch(Role::isSuperAdmin);
        if (isSuperAdmin) {
            return true;
        }

        // Check if user has the specific permission
        return user.getRoles().stream()
            .flatMap(role -> role.getPermissions().stream())
            .anyMatch(permission -> 
                permission.getResource().equals(resource) && 
                permission.getAction().equals(action)
            );
    }

    @Transactional
    public RoleResponse createRole(CreateRoleRequest request) {
        // Only superadmin can create superadmin roles
        if (request.isSuperAdmin()) {
            // This check should be done at the controller level using @PreAuthorize
            throw new IllegalArgumentException("Only superadmin can create superadmin roles");
        }

        Set<Permission> permissions = request.getPermissionIds().stream()
            .map(id -> permissionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Permission not found: " + id)))
            .collect(Collectors.toSet());

        Role role = new Role();
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        role.setPermissions(permissions);
        role.setSuperAdmin(request.isSuperAdmin());

        role = roleRepository.save(role);
        return mapRoleToResponse(role);
    }

    @Transactional
    public RoleResponse updateRole(Long roleId, UpdateRoleRequest request) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new EntityNotFoundException("Role not found: " + roleId));

        // Cannot modify superadmin role except by another superadmin
        if (role.isSuperAdmin()) {
            // This check should be done at the controller level using @PreAuthorize
            throw new IllegalArgumentException("Only superadmin can modify superadmin roles");
        }

        Set<Permission> permissions = request.getPermissionIds().stream()
            .map(id -> permissionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Permission not found: " + id)))
            .collect(Collectors.toSet());

        role.setName(request.getName());
        role.setDescription(request.getDescription());
        role.setPermissions(permissions);

        role = roleRepository.save(role);
        return mapRoleToResponse(role);
    }

    @Transactional
    public PermissionResponse createPermission(CreatePermissionRequest request) {
        Permission permission = new Permission();
        permission.setName(request.getName());
        permission.setResource(request.getResource());
        permission.setAction(request.getAction());
        permission.setDescription(request.getDescription());

        permission = permissionRepository.save(permission);
        return mapPermissionToResponse(permission);
    }

    @Transactional
    public void assignRolesToUser(AssignRoleRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + request.getUserId()));

        Set<Role> roles = request.getRoleIds().stream()
            .map(id -> roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found: " + id)))
            .collect(Collectors.toSet());

        user.setRoles(roles);
        userRepository.save(user);
    }

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
            .map(this::mapRoleToResponse)
            .collect(Collectors.toList());
    }

    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
            .map(this::mapPermissionToResponse)
            .collect(Collectors.toList());
    }

    private RoleResponse mapRoleToResponse(Role role) {
        return RoleResponse.builder()
            .id(role.getId())
            .name(role.getName())
            .description(role.getDescription())
            .permissions(role.getPermissions().stream()
                .map(this::mapPermissionToResponse)
                .collect(Collectors.toSet()))
            .isSuperAdmin(role.isSuperAdmin())
            .build();
    }

    private PermissionResponse mapPermissionToResponse(Permission permission) {
        return PermissionResponse.builder()
            .id(permission.getId())
            .name(permission.getName())
            .resource(permission.getResource())
            .action(permission.getAction())
            .description(permission.getDescription())
            .build();
    }
}
