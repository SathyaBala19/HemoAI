package com.inventory.service;

import com.inventory.entity.BloodInventory;
import com.inventory.repository.BloodInventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// Unit tests for InventoryService's validation rules, using a fake
// (mocked) repository so no real database is needed.
class InventoryServiceTest {

    private BloodInventoryRepository repository;
    private InventoryService service;

    @BeforeEach
    void setUp() {
        repository = mock(BloodInventoryRepository.class);
        service = new InventoryService(repository);
    }

    private BloodInventory validRow() {
        BloodInventory row = new BloodInventory();
        row.setBloodGroup("O+");
        row.setUnits(100);
        row.setMinimumThreshold(50);
        return row;
    }

    @Test
    void validRowIsSavedSuccessfully() {
        BloodInventory row = validRow();
        when(repository.existsByBloodGroup("O+")).thenReturn(false);
        when(repository.save(row)).thenReturn(row);

        service.create(row);

        verify(repository).save(row);
    }

    @Test
    void duplicateBloodGroupIsRejected() {
        BloodInventory row = validRow();
        when(repository.existsByBloodGroup("O+")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> service.create(row));
        verify(repository, never()).save(any());
    }

    @Test
    void missingBloodGroupIsRejected() {
        BloodInventory row = validRow();
        row.setBloodGroup("");

        assertThrows(IllegalArgumentException.class, () -> service.create(row));
    }

    @Test
    void negativeUnitsAreRejected() {
        BloodInventory row = validRow();
        row.setUnits(-5);

        assertThrows(IllegalArgumentException.class, () -> service.create(row));
    }

    @Test
    void negativeThresholdIsRejected() {
        BloodInventory row = validRow();
        row.setMinimumThreshold(-1);

        assertThrows(IllegalArgumentException.class, () -> service.create(row));
    }
}
