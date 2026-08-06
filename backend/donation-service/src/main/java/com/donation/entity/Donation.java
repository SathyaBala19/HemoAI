package com.donation.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

// Maps to the DONATIONS table - one row per completed blood donation.
// donorEmail ties this row back to the account in auth-service that made
// it (we don't share a database between services, so email is how we
// connect the two without a foreign key across services).
@Entity
@Table(name = "DONATIONS", indexes = {
        // Every "my donation history" lookup filters by donor email
        // (see DonationRepository.findByDonorEmailOrderByDonationDateDesc) -
        // without this index that query has to scan the whole table.
        @Index(name = "IDX_DONATIONS_DONOR_EMAIL", columnList = "DONOR_EMAIL")
})
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DONATION_ID")
    private Long id;

    @Column(name = "DONOR_EMAIL", nullable = false, length = 150)
    private String donorEmail;

    @Column(name = "DONOR_NAME", nullable = false, length = 100)
    private String donorName;

    @Column(name = "BLOOD_GROUP", nullable = false, length = 3)
    private String bloodGroup;

    @Column(name = "DONATION_DATE", nullable = false)
    private LocalDate donationDate;

    @Column(name = "LOCATION", nullable = false, length = 150)
    private String location;

    // A simple human-readable certificate reference, e.g. "HEMOAI-000042" -
    // generated once when the row is first saved (see DonationService).
    @Column(name = "CERTIFICATE_ID", nullable = false, unique = true, length = 30)
    private String certificateId;

    public Donation() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }
    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public LocalDate getDonationDate() { return donationDate; }
    public void setDonationDate(LocalDate donationDate) { this.donationDate = donationDate; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getCertificateId() { return certificateId; }
    public void setCertificateId(String certificateId) { this.certificateId = certificateId; }
}
