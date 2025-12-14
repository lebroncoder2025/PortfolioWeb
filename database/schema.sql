-- =====================================================
-- Portfolio Database Schema for MySQL/MariaDB
-- Compatible with XAMPP, jchost, and other PHP hostings
-- =====================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio;

-- =====================================================
-- Users table
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(100),
    passwordHash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'moderator') NOT NULL DEFAULT 'moderator',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Site sections tables
-- =====================================================

-- Hero section
CREATE TABLE IF NOT EXISTS site_hero (
    id INT PRIMARY KEY DEFAULT 1,
    title VARCHAR(200) DEFAULT '',
    subtitle VARCHAR(300) DEFAULT '',
    image VARCHAR(500) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- About section
CREATE TABLE IF NOT EXISTS site_about (
    id INT PRIMARY KEY DEFAULT 1,
    title VARCHAR(200) DEFAULT '',
    bio TEXT,
    image VARCHAR(500) DEFAULT '',
    stats JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact section
CREATE TABLE IF NOT EXISTS site_contact (
    id INT PRIMARY KEY DEFAULT 1,
    email VARCHAR(255) DEFAULT '',
    phone VARCHAR(30) DEFAULT '',
    location VARCHAR(200) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Social media links
CREATE TABLE IF NOT EXISTS site_social (
    id INT PRIMARY KEY DEFAULT 1,
    facebook VARCHAR(500) DEFAULT '',
    instagram VARCHAR(500) DEFAULT '',
    twitter VARCHAR(500) DEFAULT '',
    tiktok VARCHAR(500) DEFAULT '',
    youtube VARCHAR(500) DEFAULT '',
    linkedin VARCHAR(500) DEFAULT '',
    pinterest VARCHAR(500) DEFAULT '',
    canva VARCHAR(500) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Services table
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT '📌',
    `order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Categories table
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    data JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Portfolio tables
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    images JSON,
    video VARCHAR(500),
    featuredMedia JSON,
    `order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Normalized portfolio images
CREATE TABLE IF NOT EXISTS portfolio_images (
    id VARCHAR(36) PRIMARY KEY,
    portfolio_id VARCHAR(36) NOT NULL,
    url VARCHAR(500) NOT NULL,
    caption VARCHAR(500) DEFAULT '',
    `order` INT DEFAULT 0,
    FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Portfolio featured media
CREATE TABLE IF NOT EXISTS portfolio_featured (
    portfolio_id VARCHAR(36) PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    caption VARCHAR(500) DEFAULT '',
    FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Layout configuration
-- =====================================================
CREATE TABLE IF NOT EXISTS layout (
    id INT PRIMARY KEY DEFAULT 1,
    sectionId VARCHAR(50),
    visible TINYINT(1) DEFAULT 1,
    `order` INT DEFAULT 0,
    data JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- User activity logs
-- =====================================================
CREATE TABLE IF NOT EXISTS user_logs (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    details JSON,
    ipAddress VARCHAR(45),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Insert default data
-- =====================================================

-- Default admin user (password: Admin123!)
-- You should change this password after first login!
INSERT INTO users (id, email, name, passwordHash, role, createdAt)
SELECT 
    'default-admin-uuid',
    'admin@example.com',
    'Administrator',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: Admin123!
    'admin',
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin');

-- Initialize site sections with empty data
INSERT IGNORE INTO site_hero (id, title, subtitle, image) VALUES (1, '', '', '');
INSERT IGNORE INTO site_about (id, title, bio, image, stats) VALUES (1, '', '', '', '[]');
INSERT IGNORE INTO site_contact (id, email, phone, location) VALUES (1, '', '', '');
INSERT IGNORE INTO site_social (id) VALUES (1);
INSERT IGNORE INTO layout (id, data) VALUES (1, '[]');

-- =====================================================
-- Create indexes for better performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_order ON portfolio(`order`);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(`order`);
CREATE INDEX IF NOT EXISTS idx_user_logs_userId ON user_logs(userId);
CREATE INDEX IF NOT EXISTS idx_user_logs_createdAt ON user_logs(createdAt);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_portfolio_id ON portfolio_images(portfolio_id);
