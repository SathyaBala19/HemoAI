package com.kce.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// This is what the frontend sends us in the request body when logging in:
// just an email and a password.
// The @NotBlank/@Email annotations are validation rules - Spring checks
// these automatically before the controller method even runs.
public class LoginRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
