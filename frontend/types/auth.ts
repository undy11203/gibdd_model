export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    fullName: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    fullName: string;
    roles: string[];
}

export interface Permission {
    id: number;
    name: string;
    resource: string;
    action: string;
    description: string;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    permissions: Permission[];
    isSuperAdmin: boolean;
}

export interface CreateRoleRequest {
    name: string;
    description: string;
    permissionIds: number[];
    isSuperAdmin: boolean;
}

export interface UpdateRoleRequest {
    name: string;
    description: string;
    permissionIds: number[];
}

export interface CreatePermissionRequest {
    name: string;
    resource: string;
    action: string;
    description: string;
}
