package com.auth.entity;

// The three states an account can be in.
//   PENDING  - registered but not yet reviewed (staff roles only)
//   APPROVED - can log in normally
//   REJECTED - registration was turned down
// See AppUser.status and AccountApprovalController.
public enum AccountStatus {
    PENDING,
    APPROVED,
    REJECTED
}
