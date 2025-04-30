package org.web.gibdd_model.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Set;

public class RoleManagementDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRoleRequest {
        private String name;
        private String description;
        private Set<Long> permissionIds;
        private boolean isSuperAdmin;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRoleRequest {
        private String name;
        private String description;
        private Set<Long> permissionIds;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatePermissionRequest {
        private String name;
        private String resource;
        private String action;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoleResponse {
        private Long id;
        private String name;
        private String description;
        private Set<PermissionResponse> permissions;
        private boolean isSuperAdmin;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PermissionResponse {
        private Long id;
        private String name;
        private String resource;
        private String action;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignRoleRequest {
        private Long userId;
        private Set<Long> roleIds;
    }
}
