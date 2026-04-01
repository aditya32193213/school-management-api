CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

CREATE TABLE IF NOT EXISTS schools (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255)   NOT NULL,
    address     VARCHAR(255)   NOT NULL,
    latitude    DECIMAL(10,8)  NOT NULL,   -- range: -90  to  +90  (2 digits before decimal ✓)
    longitude   DECIMAL(11,8)  NOT NULL,   -- range: -180 to +180  (3 digits before decimal ✓)
    created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_location (latitude, longitude)
);