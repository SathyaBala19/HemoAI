package com.kce.auth.dao;

import com.kce.auth.bean.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// A repository is how we talk to the database without writing SQL by hand.
// Just by extending JpaRepository, we automatically get methods like
// save(), findById(), findAll(), delete(), etc.
// The methods below are "derived queries" - Spring reads the method name
// and generates the SQL for us automatically.
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
    List<AppUser> findByRole(String role);

    // Staff accounts (anything that isn't DONOR) waiting on a DHO's
    // decision - used by AccountApprovalController's pending-list endpoint.
    List<AppUser> findByStatusAndRoleNot(String status, String role);
}
