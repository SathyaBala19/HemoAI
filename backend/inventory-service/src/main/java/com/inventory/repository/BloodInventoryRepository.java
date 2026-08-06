package com.inventory.repository;

import com.inventory.entity.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Spring Data JPA builds the implementation of this interface for us -
// save(), findAll(), findById(), deleteById() come for free.
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {
    Optional<BloodInventory> findByBloodGroup(String bloodGroup);
    boolean existsByBloodGroup(String bloodGroup);
}
