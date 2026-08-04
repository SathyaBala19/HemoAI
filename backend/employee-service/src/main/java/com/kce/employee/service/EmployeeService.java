package com.kce.employee.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kce.employee.bean.Employee;
import com.kce.employee.dao.EmployeeRepository;

// This is where the actual employee business logic lives - the controller
// just forwards requests here. Keeping this logic out of the controller
// makes it easier to test and reuse.
@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    // Constructor injection instead of @Autowired on the field - this way
    // employeeRepository is guaranteed to be set (final) as soon as this
    // object exists, and it's easy to pass in a fake repository in tests.
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public void addEmployee(Employee employee) {
        validateEmployee(employee);
        employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(long id) {
        // orElse(null) instead of throwing - the controller checks for
        // null and returns a proper 404 response itself.
        return employeeRepository.findById(id).orElse(null);
    }

    public void updateEmployee(Employee employee) {
        validateEmployee(employee);
        employeeRepository.save(employee);
    }

    public void deleteEmployee(long id) {
        employeeRepository.deleteById(id);
    }

    // Simple manual validation - make sure required fields are actually
    // filled in before we save anything to the database.
    private void validateEmployee(Employee employee) {
        if (employee.getName() == null || employee.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Employee name is required");
        }

        if (employee.getEmail() == null || employee.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (employee.getDepartment() == null || employee.getDepartment().trim().isEmpty()) {
            throw new IllegalArgumentException("Department is required");
        }

        if (employee.getSalary() == null || employee.getSalary().doubleValue() <= 0) {
            throw new IllegalArgumentException("Salary must be greater than zero");
        }

        if (employee.getJoinDate() == null) {
            throw new IllegalArgumentException("Join date is required");
        }
    }
}
