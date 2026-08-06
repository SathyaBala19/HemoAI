package com.employee.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

// What the client sends for create/update. No "id" field here on
// purpose - the id always comes from the URL/database, never from the
// request body. Binding the Employee entity directly used to let a
// caller sneak an id into the JSON and overwrite someone else's record.
//
// These annotations are what actually get checked when the controller
// takes this as @Valid - without them, an empty name or a negative
// salary would sail straight through to the database.
public class EmployeeRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String department;

    @NotNull
    @DecimalMin(value = "0.01", message = "Salary must be greater than zero")
    private BigDecimal salary;

    @NotNull
    private LocalDate joinDate;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }
    public LocalDate getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDate joinDate) { this.joinDate = joinDate; }
}
