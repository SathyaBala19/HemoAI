package com.kce.auth.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

// This class knows how to create and check JWT tokens.
// auth-service is the only service that ever CREATES (signs) tokens.
// employee-service only CHECKS (verifies) them, using the exact same
// secret key. That's what lets employee-service confirm a token is real
// without having to call auth-service over the network every time.
@Component
public class JwtUtil {

    // Read from application.properties: app.jwt.secret
    @Value("${app.jwt.secret}")
    private String secret;

    // How long (in milliseconds) a token stays valid before expiring.
    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey signingKey;

    // Build the signing key once and reuse it (small performance shortcut).
    private SecretKey key() {
        if (signingKey == null) {
            signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        }
        return signingKey;
    }

    // Creates a new signed token. The "subject" is the user's email, and
    // we also attach their id, name, and role as extra claims so other
    // services can read them straight from the token instead of trusting
    // whatever the client claims about itself (e.g. donation-service uses
    // the name claim so a donor can't submit a donation under a fake name).
    public String generateToken(String email, Long userId, String name, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("name", name)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key())
                .compact();
    }

    // Pulls the email back out of a token.
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    // A token is valid only if: it belongs to the expected user AND it
    // hasn't expired yet. If parsing throws an error (bad signature,
    // corrupted token, etc.) we just treat it as invalid.
    public boolean isTokenValid(String token, String expectedEmail) {
        try {
            String email = extractUsername(token);
            Date expiration = parseClaims(token).getExpiration();
            return email.equals(expectedEmail) && expiration.after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Verifies the token's signature (using our secret key) and reads its
    // contents (claims) back out.
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
