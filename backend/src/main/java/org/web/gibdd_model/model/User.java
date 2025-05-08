package org.web.gibdd_model.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
            .flatMap(role -> {
                if (role.isSuperAdmin()) {
                    return Set.of(new SimpleGrantedAuthority("ROLE_SUPERADMIN")).stream();
                }
                return role.getPermissions().stream()
                    .map(permission -> new SimpleGrantedAuthority(
                        permission.getResource() + "_" + permission.getAction()
                    ));
            })
            .collect(Collectors.toSet());
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
