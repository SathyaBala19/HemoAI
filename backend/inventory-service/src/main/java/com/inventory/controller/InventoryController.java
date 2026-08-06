package com.inventory.controller;

import com.inventory.entity.BloodInventory;
import com.inventory.dto.InventoryRequest;
import com.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST controller for blood inventory CRUD. Every method just calls into
// InventoryService and returns the result as JSON - who's actually
// allowed to call which method is enforced in SecurityConfig, not here.
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // GET /api/inventory - the full stock table, one row per blood group.
    @GetMapping
    public List<BloodInventory> list() {
        return inventoryService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodInventory> get(@PathVariable long id) {
        BloodInventory inventory = inventoryService.getById(id);
        return inventory != null ? ResponseEntity.ok(inventory) : ResponseEntity.notFound().build();
    }

    // POST /api/inventory - add a brand-new blood group row (rare - the
    // 8 standard groups are seeded automatically on startup). Takes
    // InventoryRequest, not BloodInventory - see InventoryRequest for why.
    // @Valid triggers InventoryRequest's constraints (blank group,
    // negative units/threshold) - GlobalExceptionHandler turns a failure
    // there into a 400 with field errors.
    @PostMapping
    public BloodInventory create(@Valid @RequestBody InventoryRequest request) {
        return inventoryService.create(toInventory(request));
    }

    // PUT /api/inventory/5 - update units/threshold for one blood group,
    // e.g. after a donation comes in or units get dispatched to a hospital.
    @PutMapping("/{id}")
    public ResponseEntity<BloodInventory> update(@PathVariable long id, @Valid @RequestBody InventoryRequest request) {
        if (inventoryService.getById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        BloodInventory inventory = toInventory(request);
        inventory.setId(id);
        return ResponseEntity.ok(inventoryService.update(inventory));
    }

    // DELETE /api/inventory/5 - DHO only, enforced in SecurityConfig.
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        if (inventoryService.getById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        inventoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private static BloodInventory toInventory(InventoryRequest request) {
        BloodInventory inventory = new BloodInventory();
        inventory.setBloodGroup(request.getBloodGroup());
        inventory.setUnits(request.getUnits());
        inventory.setMinimumThreshold(request.getMinimumThreshold());
        return inventory;
    }
}
