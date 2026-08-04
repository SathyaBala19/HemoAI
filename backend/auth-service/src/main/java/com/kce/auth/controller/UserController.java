package com.kce.auth.controller;

import com.kce.auth.dto.UserProfileMapper;
import com.kce.auth.dto.UserProfileResponse;
import com.kce.auth.bean.AppUser;
import com.kce.auth.bean.Role;
import com.kce.auth.dao.AppUserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    private final AppUserRepository appUserRepository;

    public UserController(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    // GET /api/users/profile - the logged-in user's own full profile
    // (used by DonorProfile.jsx). "Own" is determined from the token,
    // not anything the client could tamper with.
    @GetMapping("/api/users/profile")
    public UserProfileResponse myProfile(@AuthenticationPrincipal UserDetails currentUser) {
        AppUser user = appUserRepository.findByEmail(currentUser.getUsername()).orElseThrow();
        return UserProfileMapper.toResponse(user);
    }

    // GET /api/users/donors - every donor's public profile info (name,
    // city, state, blood group - never the password hash). Used by
    // DonorMap.jsx. Restricted to staff roles in SecurityConfig.
    @GetMapping("/api/users/donors")
    public List<UserProfileResponse> donors() {
        return appUserRepository.findByRole(Role.DONOR.name())
                .stream()
                .map(UserProfileMapper::toResponse)
                .toList();
    }
}
