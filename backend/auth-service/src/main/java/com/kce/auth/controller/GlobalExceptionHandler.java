package com.kce.auth.controller;

import com.kce.auth.dto.AccountStatusResponse;
import com.kce.auth.util.AccountNotApprovedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

// Catches any exception that escapes a controller method and turns it
// into a clean JSON error instead of Spring Boot's default error page.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Thrown when a @Valid @RequestBody fails its constraints (blank
    // email, missing password, etc. - see RegisterRequest/LoginRequest).
    // Without this handler it falls through to the generic 500 below
    // instead of a proper 400 that tells the caller which field was wrong.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError error : exception.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(fieldErrors);
    }

    // AuthController calls authenticationManager.authenticate() directly
    // (not through a security filter), so a wrong email/password throws
    // this right inside the controller method - without this handler it
    // would fall through to the generic 500 below instead of a proper 401.
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> handleBadCredentials(AuthenticationException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

    // Correct password, but the account is PENDING or REJECTED - 403 with
    // a structured body so the frontend can show which one.
    @ExceptionHandler(AccountNotApprovedException.class)
    public ResponseEntity<AccountStatusResponse> handleNotApproved(AccountNotApprovedException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new AccountStatusResponse(exception.getStatus(), exception.getReason()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadInput(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleUnexpected(Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Something went wrong. Please try again.");
    }
}
