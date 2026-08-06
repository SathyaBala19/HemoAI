package com.auth.dto;

// Sent back when someone tries to log in to an account that isn't
// approved yet. The frontend checks for this specific shape (a "status"
// field) to show a proper "pending approval" / "rejected: <reason>"
// banner instead of a generic error message.
public class AccountStatusResponse {

    private String status;
    private String reason;

    public AccountStatusResponse(String status, String reason) {
        this.status = status;
        this.reason = reason;
    }

    public String getStatus() { return status; }
    public String getReason() { return reason; }
}
