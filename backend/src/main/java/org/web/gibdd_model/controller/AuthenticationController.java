package org.web.gibdd_model.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.security.AuthenticationService;
import org.web.gibdd_model.dto.AuthDTO.LoginRequest;
import org.web.gibdd_model.dto.AuthDTO.RegisterRequest;
import org.web.gibdd_model.dto.AuthDTO.AuthResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authenticationService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authenticationService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Void> checkAuthentication() {
        // This endpoint is just for checking if the token is valid
        // If the request reaches here, it means the token is valid
        // (due to JWT filter authentication)
        return ResponseEntity.ok().build();
    }
}
