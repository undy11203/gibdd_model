package org.web.gibdd_model.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.dto.RoleManagementDTO.*;
import org.web.gibdd_model.model.Permission;
import org.web.gibdd_model.service.RoleManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/roles")
@RequiredArgsConstructor
public class RoleManagementController {
    private final RoleManagementService roleManagementService;

//
    @GetMapping("/current-user/permissions")
    public ResponseEntity<Set<PermissionResponse>> getCurrentUserPermissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(roleManagementService.getCurrentUserPermissions());
    }

//
    @GetMapping("/check-permission")
    public ResponseEntity<Boolean> checkPermission(
            @RequestParam String resource,
            @RequestParam String action) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(false);
        }
        return ResponseEntity.ok(roleManagementService.hasPermission(resource, action));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('roles_manage')")
    public ResponseEntity<RoleResponse> createRole(@RequestBody CreateRoleRequest request) {
        return ResponseEntity.ok(roleManagementService.createRole(request));
    }

    @PutMapping("/{roleId}")
    @PreAuthorize("hasAuthority('roles_manage')")
    public ResponseEntity<RoleResponse> updateRole(
            @PathVariable Long roleId,
            @RequestBody UpdateRoleRequest request) {
        return ResponseEntity.ok(roleManagementService.updateRole(roleId, request));
    }

    @PostMapping("/permissions")
    @PreAuthorize("hasAuthority('roles_manage')")
    public ResponseEntity<PermissionResponse> createPermission(@RequestBody CreatePermissionRequest request) {
        return ResponseEntity.ok(roleManagementService.createPermission(request));
    }

    @PostMapping("/assign")
    @PreAuthorize("hasAuthority('roles_manage')")
    public ResponseEntity<Void> assignRolesToUser(@RequestBody AssignRoleRequest request) {
        roleManagementService.assignRolesToUser(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('roles_manage')")
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        return ResponseEntity.ok(roleManagementService.getAllRoles());
    }

    @GetMapping("/permissions")
    @PreAuthorize("hasAuthority('roles_manage')")
    public ResponseEntity<List<PermissionResponse>> getAllPermissions() {
        return ResponseEntity.ok(roleManagementService.getAllPermissions());
    }

    @DeleteMapping("/{roleId}")
    @PreAuthorize("hasAuthority('roles_manage')")
    public ResponseEntity<Void> deleteRole(@PathVariable Long roleId) {
        roleManagementService.deleteRole(roleId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('roles_manage')")
    public ResponseEntity<Void> deletePermission(@PathVariable Long permissionId) {
        roleManagementService.deletePermission(permissionId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('roles_manage')")
    public ResponseEntity<Void> updatePermission(@PathVariable Long permissionId, @RequestBody Permission request) {
        roleManagementService.updatePermission(permissionId, request);
        return ResponseEntity.ok().build();
    }
}
