<?php
/**
 * Configuration file for Portfolio API
 * Copy this file to config.local.php and update the values for your environment
 */

// Prevent direct access
if (!defined('API_ALLOWED')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Database configuration (allow overrides from config.local.php)
if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME') ?: 'portfolio');
if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER') ?: 'root');
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', getenv('DB_PASSWORD') ?: '');
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8mb4');

// JWT Configuration
if (!defined('JWT_SECRET')) define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your-secret-key-change-in-production-' . time());
if (!defined('JWT_EXPIRY')) define('JWT_EXPIRY', 86400); // 24 hours in seconds

// Security settings
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_TIME', 900); // 15 minutes in seconds

// Upload settings
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_MIME_TYPES', [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'application/pdf'
]);

// CORS settings
$allowedOrigins = getenv('ALLOWED_ORIGINS') ? explode(',', getenv('ALLOWED_ORIGINS')) : ['*'];
define('ALLOWED_ORIGINS', $allowedOrigins);

// API URL (for frontend)
define('API_URL', getenv('API_URL') ?: 'http://localhost/portfolio-php/api');

// Ensure uploads directory exists
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}
