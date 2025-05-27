package org.web.gibdd_model.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.web.gibdd_model.model.User;
import org.web.gibdd_model.repository.UserRepository;

import java.io.Serializable;

@Component
@RequiredArgsConstructor
public class CustomPermissionEvaluator implements PermissionEvaluator {

    private final UserRepository userRepository;

    @Override
    public boolean hasPermission(Authentication authentication, Object permissionTarget, Object permission) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        // For simple permission checks where the permission name is passed directly
        if (permissionTarget instanceof String) {
            String permissionName = (String) permissionTarget;
            return checkPermission(authentication, permissionName);
        }

        return false;
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        // For resource-specific permission checks
        if (permission instanceof String) {
            String action = (String) permission;
            return checkResourcePermission(authentication, targetType, action);
        }

        return false;
    }

    private boolean checkPermission(Authentication authentication, String permissionName) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null) {
            return false;
        }

        // Check if user is a superadmin
        if (user.isSuperAdmin()) {
            return true;
        }

        // For simple permission names, we check if any of the user's roles has a permission
        // with the matching name
        return user.getRoles().stream()
                .anyMatch(role -> role.getPermissions().stream()
                        .anyMatch(permission -> permission.getName().equals(permissionName)));
    }

    private boolean checkResourcePermission(Authentication authentication, String resource, String action) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null) {
            return false;
        }

        // Check if user is a superadmin
        if (user.isSuperAdmin()) {
            return true;
        }

        // Check if the user has the specific resource-action permission
        return user.hasPermission(resource, action);
    }
}
