package com.chatbot.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private static final String SECRET = "test-secret-key-must-be-at-least-32-bytes-long";

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", SECRET);
    }

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
        String token = buildToken("donor@example.com", "DONOR", 3600000);

        assertEquals("donor@example.com", jwtUtil.extractUsername(token));
    }

    @Test
    void extractsRoleFromToken() {
        String token = buildToken("donor@example.com", "DONOR", 3600000);

        assertEquals("DONOR", jwtUtil.extractRole(token));
    }

    @Test
    void tokenIsValidForTheUserItWasIssuedTo() {
        String token = buildToken("donor@example.com", "DONOR", 3600000);

        assertTrue(jwtUtil.isTokenValid(token, "donor@example.com"));
    }

    @Test
    void expiredTokenIsNotValid() {
        String token = buildToken("donor@example.com", "DONOR", -1);

        assertFalse(jwtUtil.isTokenValid(token, "donor@example.com"));
    }
}
