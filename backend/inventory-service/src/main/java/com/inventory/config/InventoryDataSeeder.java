package com.inventory.config;

import com.inventory.entity.BloodInventory;
import com.inventory.repository.BloodInventoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Runs once automatically after startup and makes sure all 8 standard
// blood groups have a row in the inventory table, so the frontend's
// Inventory screen always has real data to show instead of an empty
// table on a fresh database. Only ever CREATES a row if it's missing -
// safe to restart the app as many times as you like.
@Component
public class InventoryDataSeeder implements CommandLineRunner {

    private final BloodInventoryRepository repository;

    public InventoryDataSeeder(BloodInventoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        seedIfMissing("A+", 412, 100);
        seedIfMissing("A-", 48, 60);
        seedIfMissing("B+", 234, 80);
        seedIfMissing("B-", 61, 75);
        seedIfMissing("O+", 389, 120);
        seedIfMissing("O-", 12, 50);
        seedIfMissing("AB+", 175, 70);
        seedIfMissing("AB-", 88, 60);
    }

    private void seedIfMissing(String bloodGroup, int units, int minimumThreshold) {
        if (repository.existsByBloodGroup(bloodGroup)) {
            return;
        }
        BloodInventory inventory = new BloodInventory();
        inventory.setBloodGroup(bloodGroup);
        inventory.setUnits(units);
        inventory.setMinimumThreshold(minimumThreshold);
        repository.save(inventory);
    }
}
