package com.kce.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// What the frontend sends us when someone signs up for a new account.
public class RegisterRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    // Optional. One of DONOR, BLOOD_BANK_OFFICER, HOSPITAL_ADMIN, DHO
    // (not case-sensitive). If left blank, AuthController.register()
    // defaults this to DONOR.
    private String role;

    // Optional donor profile fields - only meaningful when role is DONOR,
    // but there's no harm storing them for other roles too. Used by
    // DonorMap/DonorProfile on the frontend.
    private String city;
    private String state;
    private String bloodGroup;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
}
