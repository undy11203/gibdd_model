package org.web.gibdd_model.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.web.gibdd_model.model.User;
import org.web.gibdd_model.repository.UserRepository;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        
        user.getRoles().forEach(role -> {
            // Add the role itself
            authorities.add(new SimpleGrantedAuthority(role.getName()));
            
            // Add all permissions for non-superadmin roles
            if (!role.isSuperAdmin()) {
                authorities.addAll(role.getPermissions().stream()
                    .map(permission -> new SimpleGrantedAuthority(
                        permission.getResource() + "_" + permission.getAction()))
                    .collect(Collectors.toList()));
            }
        });

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.isActive(),
                true,
                true,
                true,
                authorities
        );
    }
}
