package com.kce.employee.controller;

import com.kce.employee.bean.Employee;
import com.kce.employee.dto.EmployeeRequest;
import com.kce.employee.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST controller for basic employee CRUD (Create, Read, Update, Delete).
// Every method here just calls into EmployeeService and returns the
// result as JSON.
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // GET /api/employees - list everyone
    @GetMapping
    public List<Employee> listEmployees() {
        return employeeService.getAllEmployees();
    }

    // GET /api/employees/5 - look up one employee by id
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable long id) {
        Employee employee = employeeService.getEmployeeById(id);
        return employee != null ? ResponseEntity.ok(employee) : ResponseEntity.notFound().build();
    }

    // POST /api/employees - add a new employee. Takes EmployeeRequest, not
    // Employee - the request has no "id" field, so nobody can create a
    // "new" employee that's actually an overwrite of an existing one.
    // @Valid triggers the constraints on EmployeeRequest (blank name,
    // bad email, non-positive salary, etc.) - GlobalExceptionHandler
    // turns a failure there into a 400 with field errors.
    @PostMapping
    public Employee createEmployee(@Valid @RequestBody EmployeeRequest request) {
        Employee employee = toEmployee(request);
        employeeService.addEmployee(employee);
        return employee;
    }

    // PUT /api/employees/5 - update an existing employee. The id always
    // comes from the URL, never from the request body.
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable long id, @Valid @RequestBody EmployeeRequest request) {
        if (employeeService.getEmployeeById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        Employee employee = toEmployee(request);
        employee.setId(id);
        employeeService.updateEmployee(employee);
        return ResponseEntity.ok(employee);
    }

    // DELETE /api/employees/5 - only a DHO (District Health Officer) is
    // allowed to delete a record. This check happens right here with
    // @PreAuthorize, instead of in SecurityConfig like the other methods -
    // just a different way of writing the same kind of role check.
    @PreAuthorize("hasRole('DHO')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable long id) {
        if (employeeService.getEmployeeById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    private static Employee toEmployee(EmployeeRequest request) {
        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setSalary(request.getSalary());
        employee.setJoinDate(request.getJoinDate());
        return employee;
    }
}
