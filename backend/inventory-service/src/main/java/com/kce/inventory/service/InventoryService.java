package com.kce.inventory.service;

import com.kce.inventory.bean.BloodInventory;
import com.kce.inventory.dao.BloodInventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// The actual inventory business logic - the controller just forwards
// requests here, same pattern as employee-service's EmployeeService.
@Service
public class InventoryService {

    private final BloodInventoryRepository repository;

    public InventoryService(BloodInventoryRepository repository) {
        this.repository = repository;
    }

    public List<BloodInventory> getAll() {
        return repository.findAll();
    }

    public BloodInventory getById(long id) {
        return repository.findById(id).orElse(null);
    }

    public BloodInventory create(BloodInventory inventory) {
        validate(inventory);
        if (repository.existsByBloodGroup(inventory.getBloodGroup())) {
            throw new IllegalArgumentException(
                    "A row for blood group " + inventory.getBloodGroup() + " already exists - update it instead");
        }
        return repository.save(inventory);
    }

    public BloodInventory update(BloodInventory inventory) {
        validate(inventory);
        return repository.save(inventory);
    }

    public void delete(long id) {
        repository.deleteById(id);
    }

    private void validate(BloodInventory inventory) {
        if (inventory.getBloodGroup() == null || inventory.getBloodGroup().isBlank()) {
            throw new IllegalArgumentException("Blood group is required");
        }
        if (inventory.getUnits() < 0) {
            throw new IllegalArgumentException("Units cannot be negative");
        }
        if (inventory.getMinimumThreshold() < 0) {
            throw new IllegalArgumentException("Minimum threshold cannot be negative");
        }
    }
}
