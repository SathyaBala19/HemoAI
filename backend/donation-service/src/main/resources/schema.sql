-- NOTE: with spring.jpa.hibernate.ddl-auto=update, Hibernate creates this
-- table for you automatically on first run - this file is just a reference.

-- CREATE DATABASE IF NOT EXISTS donation_service_db;
-- USE donation_service_db;

CREATE TABLE IF NOT EXISTS DONATIONS (
    DONATION_ID    BIGINT AUTO_INCREMENT PRIMARY KEY,
    DONOR_EMAIL    VARCHAR(150) NOT NULL,
    DONOR_NAME     VARCHAR(100) NOT NULL,
    BLOOD_GROUP    VARCHAR(3) NOT NULL,
    DONATION_DATE  DATE NOT NULL,
    LOCATION       VARCHAR(150) NOT NULL,
    CERTIFICATE_ID VARCHAR(30) NOT NULL UNIQUE
);

-- Speeds up "my donation history" lookups (filtered by donor email).
CREATE INDEX IDX_DONATIONS_DONOR_EMAIL ON DONATIONS (DONOR_EMAIL);
