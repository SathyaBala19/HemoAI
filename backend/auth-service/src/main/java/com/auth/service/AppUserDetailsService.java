package com.auth.service;

import com.auth.entity.AppUser;
import com.auth.repository.AppUserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

// Spring Security needs a way to look up a user by their username (in our
// case, email) whenever it checks a login or a token. This class is that
// bridge between Spring Security and our own AppUser database table.
@Service
public class AppUserDetailsService implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    public AppUserDetailsService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    // Called automatically by Spring Security during login and JWT checks.
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user with email: " + email));

        // Convert our AppUser entity into the UserDetails object Spring
        // Security understands (username + password + role).
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }
}
