package com.donation.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// Same pattern as the other services: reads the JWT, verifies it, and
// marks the request authenticated with the role from the token's claims.
// The authenticated "username" here is the donor's/staff member's email -
// DonationController uses that to filter "my donations".
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader(HEADER);

        if (header == null || !header.startsWith(PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(PREFIX.length());
        String email = jwtUtil.extractUsername(token);

        boolean noAuthYet = SecurityContextHolder.getContext().getAuthentication() == null;

        if (email != null && noAuthYet && jwtUtil.isTokenValid(token, email)) {
            String role = jwtUtil.extractRole(token);
            String name = jwtUtil.extractName(token);
            List<SimpleGrantedAuthority> authorities =
                    List.of(new SimpleGrantedAuthority("ROLE_" + (role != null ? role : "USER")));

            // Principal is our AuthenticatedUser record (email + name),
            // not just a plain string - so controllers can read the
            // caller's real name straight from the verified token.
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(new AuthenticatedUser(email, name), null, authorities);
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}
