<?php
/**
 * Local configuration - using remote jchost database
 * This file overrides config.php settings
 */

// Prevent direct access
if (!defined('API_ALLOWED')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

// Database configuration - jchost remote database
if (!defined('DB_HOST')) define('DB_HOST', 's8.jchost08.pl');
if (!defined('DB_NAME')) define('DB_NAME', 'pawelskie_portfolio');
if (!defined('DB_USER')) define('DB_USER', 'pawelskie_portfolio');
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', '2kEpSAtXXs6KKU4c5efT');

// JWT secret
if (!defined('JWT_SECRET')) define('JWT_SECRET', 'default-jwt-secret-CHANGE-THIS-IN-PRODUCTION');
if (!defined('JWT_EXPIRY')) define('JWT_EXPIRY', 86400); // 24 hours

// CORS - allow all for development
if (!defined('ALLOWED_ORIGINS')) define('ALLOWED_ORIGINS', ['*']);

// API URL for local testing
if (!defined('API_URL')) define('API_URL', 'http://localhost/portfolio-php/api');
