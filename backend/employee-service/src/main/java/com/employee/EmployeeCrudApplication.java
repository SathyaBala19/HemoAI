package com.employee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Starting point of the Employee Service. Just like AuthServiceApplication,
// this boots up an embedded Tomcat server (this time on port 8082, see
// application.properties) and wires up all the @Component/@Service/
// @RestController classes automatically.
@SpringBootApplication
public class EmployeeCrudApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeCrudApplication.class, args);
    }
}
