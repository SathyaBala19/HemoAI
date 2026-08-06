package com.employee.service;

import com.employee.entity.Employee;
import com.employee.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// Unit tests for EmployeeService's validation rules. We use Mockito to
// fake the EmployeeRepository, so these tests don't need a real database -
// they only check the validation logic inside EmployeeService itself.
class EmployeeServiceTest {

    private EmployeeRepository employeeRepository;
    private EmployeeService employeeService;

    @BeforeEach
    void setUp() {
        employeeRepository = mock(EmployeeRepository.class);
        employeeService = new EmployeeService(employeeRepository);
    }

    private Employee validEmployee() {
        Employee employee = new Employee();
        employee.setName("Rajan Kumar");
        employee.setEmail("rajan.k@cityhospital.gov.in");
        employee.setDepartment("Blood Bank");
        employee.setSalary(new BigDecimal("45000.00"));
        employee.setJoinDate(LocalDate.of(2024, 1, 15));
        return employee;
    }

    @Test
    void validEmployeeIsSavedSuccessfully() {
        Employee employee = validEmployee();

        employeeService.addEmployee(employee);

        verify(employeeRepository).save(employee);
    }

    @Test
    void blankNameIsRejected() {
        Employee employee = validEmployee();
        employee.setName("  ");

        assertThrows(IllegalArgumentException.class, () -> employeeService.addEmployee(employee));
        verify(employeeRepository, never()).save(any());
    }

    @Test
    void missingEmailIsRejected() {
        Employee employee = validEmployee();
        employee.setEmail(null);

        assertThrows(IllegalArgumentException.class, () -> employeeService.addEmployee(employee));
    }

    @Test
    void zeroOrNegativeSalaryIsRejected() {
        Employee employee = validEmployee();
        employee.setSalary(BigDecimal.ZERO);

        assertThrows(IllegalArgumentException.class, () -> employeeService.addEmployee(employee));
    }

    @Test
    void missingJoinDateIsRejected() {
        Employee employee = validEmployee();
        employee.setJoinDate(null);

        assertThrows(IllegalArgumentException.class, () -> employeeService.addEmployee(employee));
    }
}
