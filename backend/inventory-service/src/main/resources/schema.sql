-- NOTE: with spring.jpa.hibernate.ddl-auto=update (set in application.properties),
-- Hibernate creates this table for you automatically on first run - you do NOT
-- need to run this file by hand. It's here as a reference / manual-creation option.

-- Run once, as any MySQL user with CREATE privileges:
-- CREATE DATABASE IF NOT EXISTS inventory_service_db;
-- USE inventory_service_db;

CREATE TABLE IF NOT EXISTS BLOOD_INVENTORY (
    INVENTORY_ID       BIGINT AUTO_INCREMENT PRIMARY KEY,
    BLOOD_GROUP        VARCHAR(3) NOT NULL UNIQUE,
    UNITS               INT NOT NULL,
    MINIMUM_THRESHOLD   INT NOT NULL,
    LAST_UPDATED        DATETIME NOT NULL,
    CONSTRAINT CHK_INVENTORY_UNITS CHECK (UNITS >= 0),
    CONSTRAINT CHK_INVENTORY_THRESHOLD CHECK (MINIMUM_THRESHOLD >= 0)
);
