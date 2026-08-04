package com.kce.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// This is the starting point of the Auth Service.
// Spring Boot looks at the @SpringBootApplication annotation and
// automatically sets up the whole application for us (web server,
// database connection, security, etc).
@SpringBootApplication
public class AuthServiceApplication {

    // main() is the first method that runs when we start the app.
    // SpringApplication.run() boots up the embedded server (Tomcat)
    // on the port we set in application.properties (8081).
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
