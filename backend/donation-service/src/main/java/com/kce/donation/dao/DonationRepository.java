package com.kce.donation.dao;

import com.kce.donation.bean.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    // Used for "my donation history" - only this donor's own rows.
    List<Donation> findByDonorEmailOrderByDonationDateDesc(String donorEmail);

    // Used to generate the next certificate number.
    long count();
}
