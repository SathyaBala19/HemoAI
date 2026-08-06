package com.donation.service;

import com.donation.entity.Donation;
import com.donation.repository.DonationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DonationServiceTest {

    private DonationRepository repository;
    private DonationService service;

    @BeforeEach
    void setUp() {
        repository = mock(DonationRepository.class);
        service = new DonationService(repository);
    }

    private Donation validDonation() {
        Donation donation = new Donation();
        donation.setDonorEmail("arjun.kumar@gmail.com");
        donation.setDonorName("Arjun Kumar");
        donation.setBloodGroup("O+");
        donation.setDonationDate(LocalDate.of(2026, 1, 15));
        donation.setLocation("Coimbatore Central Blood Bank");
        return donation;
    }

    @Test
    void validDonationGetsACertificateNumberAndIsSaved() {
        Donation donation = validDonation();
        when(repository.count()).thenReturn(4L);
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Donation saved = service.create(donation);

        assertEquals("HEMOAI-000005", saved.getCertificateId());
        verify(repository).save(donation);
    }

    @Test
    void missingBloodGroupIsRejected() {
        Donation donation = validDonation();
        donation.setBloodGroup(null);

        assertThrows(IllegalArgumentException.class, () -> service.create(donation));
        verify(repository, never()).save(any());
    }

    @Test
    void missingDonationDateIsRejected() {
        Donation donation = validDonation();
        donation.setDonationDate(null);

        assertThrows(IllegalArgumentException.class, () -> service.create(donation));
    }

    @Test
    void missingLocationIsRejected() {
        Donation donation = validDonation();
        donation.setLocation("  ");

        assertThrows(IllegalArgumentException.class, () -> service.create(donation));
    }

    @Test
    void getForDonorFiltersByEmail() {
        List<Donation> expected = List.of(validDonation());
        when(repository.findByDonorEmailOrderByDonationDateDesc("arjun.kumar@gmail.com")).thenReturn(expected);

        List<Donation> result = service.getForDonor("arjun.kumar@gmail.com");

        assertEquals(expected, result);
    }
}
