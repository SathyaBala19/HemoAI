-- NOTE: with spring.jpa.hibernate.ddl-auto=update (set in application.properties),
-- Hibernate creates this table for you automatically on first run - you do NOT
-- need to run this file by hand. It's here as a reference / manual-creation option.

-- Run once, as any MySQL user with CREATE privileges:
-- CREATE DATABASE IF NOT EXISTS employee_service_db;
-- USE employee_service_db;

CREATE TABLE IF NOT EXISTS EMPLOYEES (
    EMPLOYEE_ID   BIGINT AUTO_INCREMENT PRIMARY KEY,
    EMPLOYEE_NAME VARCHAR(100) NOT NULL,
    EMAIL         VARCHAR(150) NOT NULL UNIQUE,
    DEPARTMENT    VARCHAR(80) NOT NULL,
    SALARY        DECIMAL(12,2) NOT NULL,
    JOIN_DATE     DATE NOT NULL,
    CONSTRAINT CHK_EMPLOYEE_SALARY CHECK (SALARY > 0)
);
