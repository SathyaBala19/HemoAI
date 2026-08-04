package com.kce.employee.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kce.employee.bean.Employee;

// Spring Data JPA builds the actual implementation of this interface for
// us at startup - we never have to write it ourselves.
// save(), findAll(), findById(), deleteById() all come for free just by
// extending JpaRepository.
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
