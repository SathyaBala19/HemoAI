package com.kce.auth.dto;

import java.time.LocalDateTime;

// What GET /api/users/profile, /api/users/donors, and /api/users/pending
// return - a safe view of an AppUser that leaves out the password hash.
public class UserProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String city;
    private String state;
    private String bloodGroup;
    private LocalDateTime createdAt;
    private String status;
    private String rejectionReason;

    public UserProfileResponse(Long id, String name, String email, String role,
                                String city, String state, String bloodGroup, LocalDateTime createdAt,
                                String status, String rejectionReason) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.city = city;
        this.state = state;
        this.bloodGroup = bloodGroup;
        this.createdAt = createdAt;
        this.status = status;
        this.rejectionReason = rejectionReason;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getBloodGroup() { return bloodGroup; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getStatus() { return status; }
    public String getRejectionReason() { return rejectionReason; }
}
