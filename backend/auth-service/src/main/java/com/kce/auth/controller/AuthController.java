package com.kce.auth.controller;

import com.kce.auth.dto.AuthResponse;
import com.kce.auth.dto.LoginRequest;
import com.kce.auth.dto.RegisterRequest;
import com.kce.auth.bean.AccountStatus;
import com.kce.auth.bean.AppUser;
import com.kce.auth.bean.Role;
import com.kce.auth.dao.AppUserRepository;
import com.kce.auth.util.AccountNotApprovedException;
import com.kce.auth.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

// This controller handles user registration and login.
// Every method here is exposed as a REST endpoint under /api/auth/...
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    // Spring automatically injects these beans for us (constructor injection).
    public AuthController(AppUserRepository appUserRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtUtil jwtUtil) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    // POST /api/auth/register
    // Creates a new user account. We hash the password before saving it,
    // so the plain-text password is never stored in the database.
    // "role" is optional - if the caller doesn't send one, we default to
    // DONOR since that's the normal public sign-up role.
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        // Don't allow two accounts with the same email.
        if (appUserRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        String requestedRole = request.getRole() == null || request.getRole().isBlank()
                ? Role.DONOR.name()
                : request.getRole().trim().toUpperCase();

        // Make sure the role the client sent actually exists in our enum.
        boolean validRole = Arrays.stream(Role.values())
                .anyMatch(role -> role.name().equals(requestedRole));
        if (!validRole) {
            return ResponseEntity.badRequest().body(
                    "Invalid role. Must be one of: " + Arrays.toString(Role.values()));
        }

        AppUser user = new AppUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        // Never save the raw password - always encode/hash it first.
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(requestedRole);
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setBloodGroup(request.getBloodGroup());
        // DONOR is frictionless - approved immediately, matches the
        // "Instant - start donating right away" copy on the registration
        // page. Staff roles need a DHO to approve them first (see
        // AccountApprovalController) before they can log in.
        user.setStatus(Role.DONOR.name().equals(requestedRole)
                ? AccountStatus.APPROVED.name()
                : AccountStatus.PENDING.name());
        appUserRepository.save(user);

        return ResponseEntity.ok(Role.DONOR.name().equals(requestedRole)
                ? "Account created. You can sign in right away."
                : "Account created. A DHO needs to approve it before you can sign in.");
    }

    // POST /api/auth/login
    // Checks the email/password. If they're correct, we generate a JWT
    // token and send it back. The client (frontend) then attaches this
    // token to every future request as proof that they're logged in.
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // This throws an exception automatically if the credentials are wrong,
        // which Spring turns into a 401/403 response for us.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        AppUser user = appUserRepository.findByEmail(request.getEmail()).orElseThrow();

        // A NULL status means this account predates the approval feature
        // entirely - treat that the same as APPROVED so old accounts keep
        // working. Anything explicitly PENDING or REJECTED is blocked here.
        if (user.getStatus() != null && !AccountStatus.APPROVED.name().equals(user.getStatus())) {
            throw new AccountNotApprovedException(user.getStatus(), user.getRejectionReason());
        }

        // Build the token, embedding the user's id, name, and role inside it.
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getName(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getEmail(), user.getName(), user.getRole()));
    }
}
