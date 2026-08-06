package com.auth.config;

import com.auth.entity.AccountStatus;
import com.auth.entity.AppUser;
import com.auth.entity.Role;
import com.auth.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// A CommandLineRunner's run() method executes once, automatically, right
// after the app finishes starting up. We use that here to make sure a
// handful of demo accounts always exist in the database - one for each
// role - so the frontend's login screen (which has a "quick pick" button
// per role) always has a real account to log in with.
//
// This only ever CREATES an account if it doesn't already exist, so it's
// safe to restart the app as many times as you want.
@Component
public class DemoDataSeeder implements CommandLineRunner {

    // All demo accounts share this password. It only exists so this
    // project is easy to try out locally - never do this in a real app.
    public static final String DEMO_PASSWORD = "Password123!";

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeeder(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // The 4 main demo accounts - pre-approved so the login screen's
        // quick-pick buttons always work immediately, without anyone
        // having to go approve them first.
        seedIfMissing("Sathya Bala", "sathya.bala@cityhospital.gov.in", Role.HOSPITAL_ADMIN, AccountStatus.APPROVED);
        seedIfMissing("Rajan Kumar", "rajan.k@cityhospital.gov.in", Role.BLOOD_BANK_OFFICER, AccountStatus.APPROVED);
        seedIfMissing("P. Selvam", "p.selvam@coimbatore.tn.gov.in", Role.DHO, AccountStatus.APPROVED);
        seedIfMissing("Arjun Kumar", "arjun.kumar@gmail.com", Role.DONOR, AccountStatus.APPROVED);

        // One PENDING staff account so PendingApprovals.jsx has something
        // real to show/approve right after a fresh install, instead of
        // starting on an empty screen.
        seedIfMissing("Meena Devi", "meena.devi@apollohospital.gov.in", Role.HOSPITAL_ADMIN, AccountStatus.PENDING);
    }

    private void seedIfMissing(String name, String email, Role role, AccountStatus status) {
        if (appUserRepository.existsByEmail(email)) {
            return; // already there from a previous run - leave it alone
        }

        AppUser user = new AppUser();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(DEMO_PASSWORD));
        user.setRole(role.name());
        user.setStatus(status.name());
        appUserRepository.save(user);
    }
}
