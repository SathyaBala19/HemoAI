package com.kce.auth.controller;

import com.kce.auth.bean.AccountStatus;
import com.kce.auth.bean.AppUser;
import com.kce.auth.bean.Role;
import com.kce.auth.dao.AppUserRepository;
import com.kce.auth.dto.RejectRequest;
import com.kce.auth.dto.UserProfileMapper;
import com.kce.auth.dto.UserProfileResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Lets a DHO review staff sign-ups (HOSPITAL_ADMIN, BLOOD_BANK_OFFICER,
// DHO) before they're allowed to log in. Donors never appear here - they
// were already auto-approved at registration (see AuthController.register()).
//
// Every endpoint here is DHO-only - see SecurityConfig, which restricts
// "/api/users/pending" and "/api/users/*/approve" / "/api/users/*/reject"
// the same way "/api/users/donors" is already restricted to staff roles.
@RestController
@RequestMapping("/api/users")
public class AccountApprovalController {

    private final AppUserRepository appUserRepository;

    public AccountApprovalController(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    // GET /api/users/pending - every staff account still waiting on a decision.
    @GetMapping("/pending")
    public List<UserProfileResponse> pending() {
        return appUserRepository.findByStatusAndRoleNot(AccountStatus.PENDING.name(), Role.DONOR.name())
                .stream()
                .map(UserProfileMapper::toResponse)
                .toList();
    }

    // POST /api/users/{id}/approve
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable long id) {
        AppUser user = appUserRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setStatus(AccountStatus.APPROVED.name());
        user.setRejectionReason(null);
        appUserRepository.save(user);
        return ResponseEntity.ok(UserProfileMapper.toResponse(user));
    }

    // POST /api/users/{id}/reject
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable long id, @RequestBody(required = false) RejectRequest request) {
        AppUser user = appUserRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setStatus(AccountStatus.REJECTED.name());
        user.setRejectionReason(request != null ? request.getReason() : null);
        appUserRepository.save(user);
        return ResponseEntity.ok(UserProfileMapper.toResponse(user));
    }
}
