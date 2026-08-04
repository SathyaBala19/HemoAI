package com.kce.auth.util;

// Thrown by AuthController.login() when the credentials are correct but
// the account isn't APPROVED yet. Carries the status/reason so
// GlobalExceptionHandler can send the frontend enough detail to show
// "pending approval" vs "rejected: <reason>" instead of a generic error.
public class AccountNotApprovedException extends RuntimeException {

    private final String status;
    private final String reason;

    public AccountNotApprovedException(String status, String reason) {
        super("Account is not approved: " + status);
        this.status = status;
        this.reason = reason;
    }

    public String getStatus() { return status; }
    public String getReason() { return reason; }
}
