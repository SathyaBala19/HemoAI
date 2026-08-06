package com.auth.dto;

// What the DHO optionally sends when rejecting an account - just a
// reason, shown to the applicant so they know what to fix.
public class RejectRequest {
    private String reason;

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
