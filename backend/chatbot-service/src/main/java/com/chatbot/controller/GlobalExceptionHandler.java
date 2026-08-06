package com.chatbot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // OllamaService throws this when it can't reach Ollama, or Ollama
    // itself errors out - 503 (Service Unavailable) is more accurate
    // here than a generic 500, since the problem is a dependency being
    // down, not a bug in this service.
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleOllamaFailure(IllegalStateException exception) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(exception.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleUnexpected(Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Something went wrong. Please try again.");
    }
}
