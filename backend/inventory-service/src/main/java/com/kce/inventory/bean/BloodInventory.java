package com.kce.inventory.bean;

import jakarta.persistence.*;

import java.time.LocalDateTime;

// Maps to the BLOOD_INVENTORY table - one row per blood group (A+, O-, etc.),
// tracking how many units are currently on hand and the minimum we want to
// always keep in stock. Hibernate creates/updates this table automatically
// to match this class (see spring.jpa.hibernate.ddl-auto=update).
@Entity
@Table(name = "BLOOD_INVENTORY")
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "INVENTORY_ID")
    private Long id;

    // "A+", "O-", etc. - unique, since there's only one running total per group.
    @Column(name = "BLOOD_GROUP", nullable = false, unique = true, length = 3)
    private String bloodGroup;

    @Column(name = "UNITS", nullable = false)
    private int units;

    // If units falls below this, the stock is considered low/critical -
    // the frontend uses this to decide what color/label to show.
    @Column(name = "MINIMUM_THRESHOLD", nullable = false)
    private int minimumThreshold;

    @Column(name = "LAST_UPDATED", nullable = false)
    private LocalDateTime lastUpdated = LocalDateTime.now();

    public BloodInventory() {
    }

    // Automatically stamps "now" every time this row is saved/updated, so
    // we never have to remember to set lastUpdated by hand in the service layer.
    @PrePersist
    @PreUpdate
    public void touch() {
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public int getUnits() { return units; }
    public void setUnits(int units) { this.units = units; }
    public int getMinimumThreshold() { return minimumThreshold; }
    public void setMinimumThreshold(int minimumThreshold) { this.minimumThreshold = minimumThreshold; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
