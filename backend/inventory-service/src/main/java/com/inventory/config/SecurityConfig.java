package com.inventory.config;

import com.inventory.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// Security rules for the Inventory Service. Roles here are exactly the
// ones auth-service can issue (see com.auth.entity.Role there).
//
// Permission model:
//   - HOSPITAL_ADMIN, BLOOD_BANK_OFFICER, DHO can all READ inventory
//   - HOSPITAL_ADMIN and BLOOD_BANK_OFFICER can CREATE/UPDATE stock (they're
//     the ones actually running a facility's blood bank day-to-day)
//   - only DHO can DELETE a blood-group row entirely
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/error").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/inventory/**")
                        .hasAnyRole("HOSPITAL_ADMIN", "BLOOD_BANK_OFFICER", "DHO")
                    .requestMatchers(HttpMethod.POST, "/api/inventory/**")
                        .hasAnyRole("HOSPITAL_ADMIN", "BLOOD_BANK_OFFICER")
                    .requestMatchers(HttpMethod.PUT, "/api/inventory/**")
                        .hasAnyRole("HOSPITAL_ADMIN", "BLOOD_BANK_OFFICER")
                    .requestMatchers(HttpMethod.DELETE, "/api/inventory/**")
                        .hasRole("DHO")
                    .anyRequest().authenticated())
            .exceptionHandling(handling -> handling
                    .authenticationEntryPoint((request, response, ex) -> {
                        response.setStatus(HttpStatus.UNAUTHORIZED.value());
                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                        response.getWriter().write("{\"error\":\"Missing or invalid token\"}");
                    })
                    .accessDeniedHandler((request, response, ex) -> {
                        response.setStatus(HttpStatus.FORBIDDEN.value());
                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                        response.getWriter().write("{\"error\":\"You do not have permission for this action\"}");
                    }))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Same as auth-service/employee-service: lets the Vite dev server
    // (localhost:5173) call this API (localhost:8083) from the browser.
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
