-- NOTE: with spring.jpa.hibernate.ddl-auto=update (set in application.properties),
-- Hibernate creates this table for you automatically on first run - you do NOT
-- need to run this file by hand. It's here as a reference for the exact shape
-- of the table, and useful if you ever want to create it manually instead.

-- Run once, as any MySQL user with CREATE privileges:
-- CREATE DATABASE IF NOT EXISTS auth_service_db;
-- USE auth_service_db;

<<<<<<< HEAD
-- ROLE is one of DONOR, BLOOD_BANK_OFFICER, HOSPITAL_ADMIN, DHO
-- (see com.auth.entity.Role).
-- CITY/STATE/BLOOD_GROUP are only really used for DONOR accounts (see
-- DonorReg.jsx on the frontend) - staff accounts just leave them NULL.
-- STATUS is PENDING, APPROVED, or REJECTED. DONOR accounts start
-- APPROVED (frictionless sign-up); staff roles start PENDING and need a
-- DHO to approve them (see AccountApprovalController) before they can log in.
CREATE TABLE IF NOT EXISTS APP_USERS (
    USER_ID           BIGINT AUTO_INCREMENT PRIMARY KEY,
    NAME              VARCHAR(100) NOT NULL,
    EMAIL             VARCHAR(150) NOT NULL UNIQUE,
    PASSWORD          VARCHAR(255) NOT NULL,
    ROLE              VARCHAR(20) NOT NULL DEFAULT 'DONOR',
    CITY              VARCHAR(100),
    STATE             VARCHAR(100),
    BLOOD_GROUP       VARCHAR(3),
    CREATED_AT        DATETIME,
    STATUS            VARCHAR(20) DEFAULT 'PENDING',
    REJECTION_REASON  VARCHAR(255),
    CONSTRAINT CHK_APP_USERS_ROLE CHECK (ROLE IN ('DONOR','BLOOD_BANK_OFFICER','HOSPITAL_ADMIN','DHO')),
    CONSTRAINT CHK_APP_USERS_STATUS CHECK (STATUS IS NULL OR STATUS IN ('PENDING','APPROVED','REJECTED'))
=======
-- ROLE is one of EMPLOYEE, MANAGER, ADMIN (see com.auth.entity.Role).
CREATE TABLE IF NOT EXISTS APP_USERS (
    USER_ID   BIGINT AUTO_INCREMENT PRIMARY KEY,
    NAME      VARCHAR(100) NOT NULL,
    EMAIL     VARCHAR(150) NOT NULL UNIQUE,
    PASSWORD  VARCHAR(255) NOT NULL,
    ROLE      VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE'
>>>>>>> d443f13996365e28c56f7f856e51bfdb693e1717
);
