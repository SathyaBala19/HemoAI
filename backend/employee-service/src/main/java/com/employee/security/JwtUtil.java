package com.employee.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

// employee-service never creates tokens - only auth-service does that.
// This class only reads and checks a token it's been handed, using the
// exact same secret key auth-service signed it with (see
// app.jwt.secret in application.properties - it must match on both sides).
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    private SecretKey signingKey;

    private SecretKey key() {
        if (signingKey == null) {
            signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        }
        return signingKey;
    }

    // Pulls the email (the token's "subject") back out.
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    // Pulls the role claim back out (added by auth-service when it built the token).
    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    // A token counts as valid only if it belongs to the expected user AND
    // it hasn't expired yet.
    public boolean isTokenValid(String token, String expectedEmail) {
        try {
            String email = extractUsername(token);
            Date expiration = parseClaims(token).getExpiration();
            return email.equals(expectedEmail) && expiration.after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Checks the token's signature against our secret key and reads its
    // contents back out. If the signature doesn't match (someone tampered
    // with the token, or it was signed with a different secret), this
    // throws an exception.
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
