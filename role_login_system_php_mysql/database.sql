CREATE DATABASE IF NOT EXISTS role_login_system
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE role_login_system;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('staff','admin','headadmin','customer') NOT NULL DEFAULT 'customer',
    email_verified_at DATETIME NULL,
    verification_token_hash CHAR(64) NULL,
    verification_expires_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_verification (verification_token_hash)
) ENGINE=InnoDB;
