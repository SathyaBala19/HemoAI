package com.kce.auth.bean;

import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

// This class maps directly to the APP_USERS table in the database.
// @Entity tells Hibernate/JPA "this is a database table", and each
// field below becomes a column. This is the ONLY place user login info
// (email/password/role) is stored - employee-service never touches this
// table directly, it only trusts the JWT tokens auth-service issues.
@Entity
@Table(name = "APP_USERS", check = {
        // Belt-and-suspenders: AuthController already checks the role
        // against Role.java before saving, but this stops a bad value
        // from ever landing in the table even if some other code path
        // ever writes to this table directly.
        @CheckConstraint(name = "CHK_APP_USERS_ROLE",
                constraint = "ROLE IN ('DONOR','BLOOD_BANK_OFFICER','HOSPITAL_ADMIN','DHO')"),
        @CheckConstraint(name = "CHK_APP_USERS_STATUS",
                constraint = "STATUS IS NULL OR STATUS IN ('PENDING','APPROVED','REJECTED')")
})
public class AppUser {

    // Primary key, auto-incremented by the database.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    private Long id;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "EMAIL", nullable = false, unique = true, length = 150)
    private String email;

    // This holds a BCrypt hash, NOT the plain password. We must never
    // store real passwords in the database.
    @Column(name = "PASSWORD", nullable = false, length = 255)
    private String password;

    @Column(name = "ROLE", nullable = false, length = 20)
    private String role = "DONOR";

    // These three are only really meaningful for DONOR accounts - staff
    // roles just leave them null. Used by DonorMap/DonorProfile on the
    // frontend so donor location/blood group are real, not hardcoded.
    @Column(name = "CITY", length = 100)
    private String city;

    @Column(name = "STATE", length = 100)
    private String state;

    @Column(name = "BLOOD_GROUP", length = 3)
    private String bloodGroup;

    // nullable=true at the DB level on purpose: Hibernate's auto-update
    // can't add a brand-new NOT NULL column to a table that already has
    // rows (MySQL has nothing to fill old rows with, so it fails).
    // The app itself always sets this (see the field default below), so
    // it's still effectively never null in practice.
    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();

    // PENDING, APPROVED, or REJECTED. DONOR accounts are auto-approved
    // at registration (see AuthController.register()); staff roles
    // (HOSPITAL_ADMIN, BLOOD_BANK_OFFICER, DHO) start PENDING and need a
    // DHO to approve them before they can log in - see
    // AccountApprovalController and AuthController.login().
    //
    // Same nullable=true reasoning as CREATED_AT above - a row from
    // before this column existed has NULL here, and login treats NULL
    // the same as APPROVED so existing accounts keep working.
    @Column(name = "STATUS", length = 20)
    private String status = "PENDING";

    // Set when a DHO rejects an account, so the person knows why.
    @Column(name = "REJECTION_REASON", length = 255)
    private String rejectionReason;

    // Empty constructor - required by JPA/Hibernate.
    public AppUser() {
    }

    // Standard getters and setters so Spring/Hibernate can read and
    // write these fields.
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
