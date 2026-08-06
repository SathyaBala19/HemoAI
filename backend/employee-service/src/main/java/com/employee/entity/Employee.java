package com.employee.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Maps to the EMPLOYEES table. Each field below = one column.
// Hibernate/JPA reads these annotations and creates/updates the table
// for us automatically (see spring.jpa.hibernate.ddl-auto=update).
@Entity
@Table(name = "EMPLOYEES")
public class Employee {

    // Auto-generated primary key.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EMPLOYEE_ID")
    private Long id;

    @Column(name = "EMPLOYEE_NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "EMAIL", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "DEPARTMENT", nullable = false, length = 80)
    private String department;

    // BigDecimal instead of double/float - important for money values,
    // since floating point numbers can lose precision with currency.
    @Column(name = "SALARY", nullable = false, precision = 12, scale = 2)
    private BigDecimal salary;

    @Column(name = "JOIN_DATE", nullable = false)
    private LocalDate joinDate;

    // Empty constructor required by JPA.
    public Employee() {
    }

    // Getters and setters - JPA/Jackson use these to read and fill in
    // the fields when converting between Java objects, the database,
    // and JSON.
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
