package com.kce.employee.config;

import com.kce.employee.util.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// Security rules for the Employee Service.
// Roles used here MUST be exactly the ones auth-service can issue - see
// com.kce.auth.bean.Role over there: DONOR, BLOOD_BANK_OFFICER,
// HOSPITAL_ADMIN, DHO. A token from auth-service carries one of these
// names as its "role" claim, and JwtAuthFilter turns that into a Spring
// Security authority this class then checks against.
//
// Permission model for employee records in this service:
//   - HOSPITAL_ADMIN, BLOOD_BANK_OFFICER, DHO can all READ employee records
//   - HOSPITAL_ADMIN and DHO can CREATE/UPDATE employee records
//   - only DHO (the highest authority in the hierarchy) can DELETE one
//
// There are two ways shown here to check roles:
//   1. requestMatchers(...).hasAnyRole(...) below - checks by URL + HTTP method
//   2. @PreAuthorize on EmployeeController.deleteEmployee() - checks right on
//      the method itself
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // No CSRF needed - this is a stateless JSON API, not a browser form app.
            .csrf(csrf -> csrf.disable())
            // Turn on CORS using the corsConfigurationSource() bean below, so the
            // React dev server (a different origin: localhost:5173) is allowed
            // to call this API (localhost:8082) from the browser.
            .cors(cors -> {})
            // No sessions - every request must carry its own JWT token.
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    // Let Spring's internal error forwarding through, otherwise a
                    // real 500 error would get turned into a confusing 403.
                    .requestMatchers("/error").permitAll()
                    // Reading employee data: hospital admins, blood bank officers, and DHOs.
                    .requestMatchers(HttpMethod.GET, "/api/employees/**")
                        .hasAnyRole("HOSPITAL_ADMIN", "BLOOD_BANK_OFFICER", "DHO")
                    // Creating/updating: hospital admins and DHOs only.
                    .requestMatchers(HttpMethod.POST, "/api/employees/**")
                        .hasAnyRole("HOSPITAL_ADMIN", "DHO")
                    .requestMatchers(HttpMethod.PUT, "/api/employees/**")
                        .hasAnyRole("HOSPITAL_ADMIN", "DHO")
                    // DELETE isn't listed here on purpose - it's protected instead
                    // with @PreAuthorize("hasRole('DHO')") directly on the method
                    // in EmployeeController, showing the other way to do role checks.
                    .anyRequest().authenticated())
            .exceptionHandling(handling -> handling
                    // No token / bad token => return a clean 401 JSON message
                    // instead of Spring Security's default blank response.
                    .authenticationEntryPoint((request, response, ex) -> {
                        response.setStatus(HttpStatus.UNAUTHORIZED.value());
                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                        response.getWriter().write("{\"error\":\"Missing or invalid token\"}");
                    })
                    // Valid token but wrong role => 403 with a readable message.
                    .accessDeniedHandler((request, response, ex) -> {
                        response.setStatus(HttpStatus.FORBIDDEN.value());
                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                        response.getWriter().write("{\"error\":\"You do not have permission for this action\"}");
                    }))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
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
