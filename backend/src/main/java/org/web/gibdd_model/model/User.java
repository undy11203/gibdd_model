package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Set;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true)
    private String email;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

    @Column(nullable = false)
    private boolean active = true;

    // Helper method to check if user has specific permission
    public boolean hasPermission(String resource, String action) {
        return roles.stream()
            .anyMatch(role -> role.isSuperAdmin() || 
                role.getPermissions().stream()
                    .anyMatch(permission -> 
                        permission.getResource().equals(resource) && 
                        permission.getAction().equals(action)
                    )
            );
    }

    // Helper method to check if user is super admin
    public boolean isSuperAdmin() {
        return roles.stream().anyMatch(Role::isSuperAdmin);
    }
}
