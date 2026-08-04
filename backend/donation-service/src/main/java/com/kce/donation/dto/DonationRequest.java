package com.kce.donation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

// What the client sends when logging a new donation. Deliberately does
// NOT include donorEmail/donorName - those come from the caller's own
// verified JWT instead (see DonationController), so nobody can log a
// donation under someone else's identity just by editing a request body.
public class DonationRequest {

    @NotBlank
    private String bloodGroup;

    @NotNull
    private LocalDate donationDate;

    @NotBlank
    private String location;

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public LocalDate getDonationDate() { return donationDate; }
    public void setDonationDate(LocalDate donationDate) { this.donationDate = donationDate; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
