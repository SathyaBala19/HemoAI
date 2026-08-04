package com.kce.auth.config;

import com.kce.auth.util.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// This class tells Spring Security how to protect our API.
// Basically: "which URLs are open to everyone, which ones need login,
// and how do we check if someone is logged in".
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Our custom filter that reads the JWT token from each request.
    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    // This bean is the main security rulebook for the app.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // We disable CSRF because this is a stateless REST API (no browser
            // forms/sessions), not a normal server-rendered website.
            .csrf(csrf -> csrf.disable())
            // Turn on CORS using the corsConfigurationSource() bean below, so
            // the React dev server (localhost:5173) is allowed to call this
            // API (localhost:8081) from the browser.
            .cors(cors -> {})
            // STATELESS means Spring won't create HTTP sessions. Every request
            // must prove who it is by sending a JWT token - nothing is remembered
            // on the server between requests.
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    // Anyone can call register/login without already being logged in.
                    .requestMatchers("/api/auth/**").permitAll()
                    // Spring forwards unexpected errors (like a DB crash) to /error.
                    // If we don't allow it here too, that forward gets blocked by
                    // security and we see a confusing 403 instead of the real error.
                    .requestMatchers("/error").permitAll()
                    // The donor directory is staff-only - a donor shouldn't be
                    // able to list every other donor's name/city/blood group.
                    .requestMatchers("/api/users/donors")
                        .hasAnyRole("HOSPITAL_ADMIN", "BLOOD_BANK_OFFICER", "DHO")
                    // Reviewing and deciding on pending staff sign-ups is a
                    // DHO-only power - matches AccountApprovalController.
                    .requestMatchers("/api/users/pending", "/api/users/*/approve", "/api/users/*/reject")
                        .hasRole("DHO")
                    // Everything else just needs a valid JWT token (any role).
                    .anyRequest().authenticated())
            // Run our JWT filter before Spring's normal login filter, so the
            // token gets checked on every request.
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // BCrypt is a one-way hashing algorithm for passwords - we never store
    // the real password anywhere, only this hash.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Needed so we can call authenticationManager.authenticate(...) manually
    // inside AuthController when a user logs in.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Tells Spring exactly which frontend origins/headers/methods are
    // allowed to call this API from a browser. Without this, the browser
    // blocks every request from the Vite dev server before it even
    // reaches our controllers, regardless of what SecurityFilterChain says.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
