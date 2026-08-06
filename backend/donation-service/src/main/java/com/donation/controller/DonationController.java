package com.donation.controller;

import com.donation.dto.DonationRequest;
import com.donation.entity.Donation;
import com.donation.security.AuthenticatedUser;
import com.donation.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    // GET /api/donations - every donation, for staff dashboards/reports.
    // Only HOSPITAL_ADMIN, BLOOD_BANK_OFFICER, DHO can call this - see
    // SecurityConfig.
    @GetMapping
    public List<Donation> listAll() {
        return donationService.getAll();
    }

    // GET /api/donations/mine - just the logged-in donor's own history.
    // "mine" is figured out from the JWT (currentUser.email()), not from
    // anything the client could tamper with.
    @GetMapping("/mine")
    public List<Donation> listMine(@AuthenticationPrincipal AuthenticatedUser currentUser) {
        return donationService.getForDonor(currentUser.email());
    }

    // POST /api/donations - log a new donation. donorEmail/donorName are
    // taken from the verified token, not the request body. Validation
    // errors are caught by GlobalExceptionHandler, not here.
    @PostMapping
    public Donation create(@Valid @RequestBody DonationRequest request,
                            @AuthenticationPrincipal AuthenticatedUser currentUser) {
        Donation donation = new Donation();
        donation.setDonorEmail(currentUser.email());
        donation.setDonorName(currentUser.name());
        donation.setBloodGroup(request.getBloodGroup());
        donation.setDonationDate(request.getDonationDate());
        donation.setLocation(request.getLocation());

        return donationService.create(donation);
    }
}
