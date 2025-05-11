package org.web.gibdd_model.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.web.gibdd_model.dto.AuthDTO.LoginRequest;
import org.web.gibdd_model.dto.AuthDTO.RegisterRequest;
import org.web.gibdd_model.dto.AuthDTO.AuthResponse;
import org.web.gibdd_model.model.Role;
import org.web.gibdd_model.model.User;
import org.web.gibdd_model.repository.RoleRepository;
import org.web.gibdd_model.repository.UserRepository;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        Role defaultRole = roleRepository.findByName("ROLE_SEARCH_OPERATOR")
            .orElseThrow(() -> new RuntimeException("Default role not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRoles(Set.of(defaultRole));
        user.setActive(true);

        user = userRepository.save(user);

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
            .token(token)
            .username(user.getUsername())
            .fullName(user.getFullName())
            .roles(user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList())
                .toArray(new String[0]))
            .build();
    }

    public AuthResponse login(LoginRequest request) {
//        Authentication authentication = authenticationManager.authenticate(
//            new UsernamePasswordAuthenticationToken(
//                request.getUsername(),
//                request.getPassword()
//            )
//        );

        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
            .token(token)
            .username(user.getUsername())
            .fullName(user.getFullName())
            .roles(user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList())
                .toArray(new String[0]))
            .build();
    }
}
