package com.auth.entity;

// All the possible user roles in HemoAI.
// DONOR is the normal public role anyone can sign up as.
// BLOOD_BANK_OFFICER, HOSPITAL_ADMIN, and DHO are staff roles.
// employee-service's SecurityConfig has matching hasRole(...)/
// hasAnyRole(...) checks that use these exact same names, so if you
// add a role here, update it over there too.
public enum Role {
    DONOR,
    BLOOD_BANK_OFFICER,
    HOSPITAL_ADMIN,
    DHO
}
