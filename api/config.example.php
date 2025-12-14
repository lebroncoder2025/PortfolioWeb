<?php
/**
 * Example config (do NOT commit real credentials)
 */
if (!defined('API_ALLOWED')) exit('Direct access not allowed');

// Database
if (!defined('DB_HOST')) define('DB_HOST', 'your-db-host');
if (!defined('DB_NAME')) define('DB_NAME', 'your-db-name');
if (!defined('DB_USER')) define('DB_USER', 'your-db-user');
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', 'your-db-password');
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8mb4');

// API defaults
if (!defined('API_URL')) define('API_URL', '/portfolio-php/api');

return true;
