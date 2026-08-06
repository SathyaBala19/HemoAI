package com.auth.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// This filter runs on every single request before it reaches our
// controllers. Its job: look for a JWT token in the request, check if
// it's valid, and if so, tell Spring Security "this user is logged in".
// OncePerRequestFilter just guarantees it only runs once per request.
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // Tokens are expected in the format: Authorization: Bearer <token>
        String header = request.getHeader(HEADER);

        // No token, or wrong format -> just let the request continue.
        // Spring Security will reject it later if the endpoint requires login.
        if (header == null || !header.startsWith(PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Strip off "Bearer " to get just the raw token string.
        String token = header.substring(PREFIX.length());
        String email = jwtUtil.extractUsername(token);

        boolean noAuthYet = SecurityContextHolder.getContext().getAuthentication() == null;

        if (email != null && noAuthYet) {
            // Look up the user this token claims to belong to.
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // Double check the token's signature/expiry match this user.
            if (jwtUtil.isTokenValid(token, userDetails.getUsername())) {
                // Tell Spring Security "this request is authenticated as this user".
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Always continue to the next filter/controller.
        filterChain.doFilter(request, response);
    }
}
