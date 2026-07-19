-- NOTE: with spring.jpa.hibernate.ddl-auto=update (set in application.properties),
-- Hibernate creates this table for you automatically on first run - you do NOT
-- need to run this file by hand. It's here as a reference for the exact shape
-- of the table, and useful if you ever want to create it manually instead.

-- Run once, as any MySQL user with CREATE privileges:
-- CREATE DATABASE IF NOT EXISTS auth_service_db;
-- USE auth_service_db;

-- ROLE is one of EMPLOYEE, MANAGER, ADMIN (see com.auth.entity.Role).
CREATE TABLE IF NOT EXISTS APP_USERS (
    USER_ID   BIGINT AUTO_INCREMENT PRIMARY KEY,
    NAME      VARCHAR(100) NOT NULL,
    EMAIL     VARCHAR(150) NOT NULL UNIQUE,
    PASSWORD  VARCHAR(255) NOT NULL,
    ROLE      VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE'
);
