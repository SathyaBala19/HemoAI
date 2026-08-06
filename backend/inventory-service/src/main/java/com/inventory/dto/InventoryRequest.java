package com.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

// What the client sends for create/update. No "id" here on purpose - see
// EmployeeRequest in employee-service for why binding the entity
// directly is a bad idea (lets a caller overwrite an unrelated row by
// smuggling an id into the request body).
//
// These annotations are what actually get checked when the controller
// takes this as @Valid - without them, negative units/threshold would
// sail straight through to the database.
public class InventoryRequest {

    @NotBlank
    private String bloodGroup;

    @Min(value = 0, message = "Units cannot be negative")
    private int units;

    @Min(value = 0, message = "Minimum threshold cannot be negative")
    private int minimumThreshold;

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public int getUnits() { return units; }
    public void setUnits(int units) { this.units = units; }
    public int getMinimumThreshold() { return minimumThreshold; }
    public void setMinimumThreshold(int minimumThreshold) { this.minimumThreshold = minimumThreshold; }
}
