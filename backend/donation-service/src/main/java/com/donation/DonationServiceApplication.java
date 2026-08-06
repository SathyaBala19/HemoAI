package com.donation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Starting point of the Donation Service - stores each donor's donation
// history and generates their certificate numbers. Boots an embedded
// server on port 8084 (see application.properties).
@SpringBootApplication
public class DonationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DonationServiceApplication.class, args);
    }
}
