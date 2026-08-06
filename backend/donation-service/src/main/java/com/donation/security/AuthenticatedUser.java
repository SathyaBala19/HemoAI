package com.donation.security;

// A small holder for "who is making this request", built from the JWT's
// claims. This becomes the Authentication's principal (see JwtAuthFilter),
// so DonationController can read the real, server-verified email/name
// instead of trusting whatever a client claims about itself in the
// request body - that's what stops a donor from logging a donation
// under someone else's name.
public record AuthenticatedUser(String email, String name) {
}
