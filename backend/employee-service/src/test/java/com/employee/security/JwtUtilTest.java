package com.employee.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

import static org.junit.jupiter.api.Assertions.*;

// Unit tests for employee-service's JwtUtil. This service never CREATES
// tokens (only auth-service does that), so these tests build tokens by
// hand with the same secret, the way auth-service would, and check that
// this class can correctly read and validate them.
class JwtUtilTest {

    private static final String SECRET = "test-secret-key-must-be-at-least-32-bytes-long";

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", SECRET);
    }

    // Builds a token the same way auth-service's JwtUtil.generateToken() does.
    private String buildToken(String email, String role, long expiresInMs) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());
        Date now = new Date();
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiresInMs))
                .signWith(key)
                .compact();
    }

    @Test
    void extractsUsernameFromToken() {
        String token = buildToken("officer@example.com", "BLOOD_BANK_OFFICER", 3600000);

        assertEquals("officer@example.com", jwtUtil.extractUsername(token));
    }

    @Test
    void extractsRoleFromToken() {
        String token = buildToken("officer@example.com", "BLOOD_BANK_OFFICER", 3600000);

        assertEquals("BLOOD_BANK_OFFICER", jwtUtil.extractRole(token));
    }

    @Test
    void tokenIsValidForTheUserItWasIssuedTo() {
        String token = buildToken("officer@example.com", "BLOOD_BANK_OFFICER", 3600000);

        assertTrue(jwtUtil.isTokenValid(token, "officer@example.com"));
    }

    @Test
    void expiredTokenIsNotValid() {
        String token = buildToken("officer@example.com", "BLOOD_BANK_OFFICER", -1);

        assertFalse(jwtUtil.isTokenValid(token, "officer@example.com"));
    }

    @Test
    void tokenSignedWithADifferentSecretIsRejected() {
        SecretKey wrongKey = Keys.hmacShaKeyFor("a-completely-different-secret-key-value!".getBytes());
        String token = Jwts.builder()
                .subject("officer@example.com")
                .claim("role", "BLOOD_BANK_OFFICER")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(wrongKey)
                .compact();

        assertFalse(jwtUtil.isTokenValid(token, "officer@example.com"));
    }
}
