package com.donation.service;

import com.donation.entity.Donation;
import com.donation.repository.DonationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationService {

    private final DonationRepository repository;

    public DonationService(DonationRepository repository) {
        this.repository = repository;
    }

    public List<Donation> getAll() {
        return repository.findAll();
    }

    public List<Donation> getForDonor(String donorEmail) {
        return repository.findByDonorEmailOrderByDonationDateDesc(donorEmail);
    }

    // Records a new donation. donorEmail/donorName come from the caller's
    // verified JWT (set by the controller), never from the request body -
    // that way a donor can't log a donation under a different identity.
    public Donation create(Donation donation) {
        if (donation.getBloodGroup() == null || donation.getBloodGroup().isBlank()) {
            throw new IllegalArgumentException("Blood group is required");
        }
        if (donation.getDonationDate() == null) {
            throw new IllegalArgumentException("Donation date is required");
        }
        if (donation.getLocation() == null || donation.getLocation().isBlank()) {
            throw new IllegalArgumentException("Location is required");
        }

        // A simple, readable certificate number - "HEMOAI-000001",
        // "HEMOAI-000002", and so on, based on how many donations exist
        // so far. Fine for a learning project; a real system would use
        // something collision-proof like a UUID instead.
        long nextNumber = repository.count() + 1;
        donation.setCertificateId(String.format("HEMOAI-%06d", nextNumber));

        return repository.save(donation);
    }
}
