package com.kce.auth.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

// Unit tests for JwtUtil - the class that creates and checks login tokens.
// These don't start the whole Spring app (no @SpringBootTest needed), so
// they run fast and don't need a database connection.
class JwtUtilTest {

    private JwtUtil jwtUtil;

    // Runs before every single @Test method below - gives each test a
    // fresh JwtUtil with the same test secret/expiry, so tests can't
    // accidentally affect each other.
    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // JwtUtil normally gets these from application.properties via
        // @Value, but there's no Spring context in a plain unit test, so
        // we set them by hand with ReflectionTestUtils instead.
        ReflectionTestUtils.setField(jwtUtil, "secret", "test-secret-key-must-be-at-least-32-bytes-long");
        ReflectionTestUtils.setField(jwtUtil, "expirationMs", 3600000L);
    }

    @Test
    void generatedTokenContainsCorrectUsername() {
        String token = jwtUtil.generateToken("donor@example.com", 1L, "Test Donor", "DONOR");

        assertEquals("donor@example.com", jwtUtil.extractUsername(token));
    }

    @Test
    void tokenIsValidForTheUserItWasIssuedTo() {
        String token = jwtUtil.generateToken("donor@example.com", 1L, "Test Donor", "DONOR");

        assertTrue(jwtUtil.isTokenValid(token, "donor@example.com"));
    }

    @Test
    void tokenIsNotValidForADifferentUser() {
        String token = jwtUtil.generateToken("donor@example.com", 1L, "Test Donor", "DONOR");

        assertFalse(jwtUtil.isTokenValid(token, "someone-else@example.com"));
    }

    @Test
    void garbageTokenIsNeverValid() {
        assertFalse(jwtUtil.isTokenValid("this-is-not-a-real-token", "donor@example.com"));
    }

    @Test
    void alreadyExpiredTokenIsNotValid() {
        // Force expiration to be in the past (-1 ms) so the token is
        // already expired the instant it's created.
        ReflectionTestUtils.setField(jwtUtil, "expirationMs", -1L);
        String token = jwtUtil.generateToken("donor@example.com", 1L, "Test Donor", "DONOR");

        assertFalse(jwtUtil.isTokenValid(token, "donor@example.com"));
    }
}
