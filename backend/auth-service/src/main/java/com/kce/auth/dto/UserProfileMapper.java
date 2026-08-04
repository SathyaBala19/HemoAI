package com.kce.auth.dto;

import com.kce.auth.bean.AppUser;

// Turns an AppUser (which has the password hash) into a
// UserProfileResponse (which doesn't) - shared by UserController and
// AccountApprovalController so both build the response the same way.
public class UserProfileMapper {

    private UserProfileMapper() {
    }

    public static UserProfileResponse toResponse(AppUser user) {
        return new UserProfileResponse(
                user.getId(), user.getName(), user.getEmail(), user.getRole(),
                user.getCity(), user.getState(), user.getBloodGroup(), user.getCreatedAt(),
                user.getStatus(), user.getRejectionReason());
    }
}
