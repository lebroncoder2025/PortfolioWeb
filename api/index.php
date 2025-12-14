<?php
/**
 * Main API Router
 * Handles all API requests and routes them to appropriate handlers
 */

// Allow API access
define('API_ALLOWED', true);

// Load configuration
// Load local override first (so it can set constants), then defaults
if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}
require_once __DIR__ . '/config.php';

// Load dependencies
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/JWT.php';
require_once __DIR__ . '/helpers.php';

// Set CORS headers
setCorsHeaders();

// Handle preflight requests
handlePreflight();

// Parse request
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Remove query string and base path
$uri = parse_url($uri, PHP_URL_PATH);

// Remove /api prefix if present
$uri = preg_replace('#^.*/api#', '', $uri);

// Remove trailing slash
$uri = rtrim($uri, '/');

// If request targets a direct PHP file in this API folder, serve it
if (preg_match('#^/([a-zA-Z0-9_\-]+\.php)$#', $uri, $m)) {
    $target = __DIR__ . '/' . $m[1];
    if (file_exists($target)) {
        include $target;
        exit;
    }
}

// Route the request
try {
    // Public routes (no auth required)
    if ($uri === '/site' && $method === 'GET') {
        require __DIR__ . '/routes/site.php';
        getSiteData();
    }
    // Login
    elseif ($uri === '/login' && $method === 'POST') {
        require __DIR__ . '/routes/auth.php';
        handleLogin();
    }
    // Protected routes (auth required)
    elseif (preg_match('#^/site/(hero|about|contact|social|services|portfolio|categories|layout)#', $uri)) {
        $user = requireAuth();
        require __DIR__ . '/routes/site.php';
        handleSiteUpdate($uri, $method, $user);
    }
    // Upload
    elseif ($uri === '/upload' && $method === 'POST') {
        $user = requireAuth();
        require __DIR__ . '/routes/upload.php';
        handleUpload($user);
    }
    // Users management
    elseif (preg_match('#^/users#', $uri)) {
        $user = requireAuth();
        requireAdmin($user);
        require __DIR__ . '/routes/users.php';
        handleUsers($uri, $method, $user);
    }
    // Logs
    elseif ($uri === '/logs' && $method === 'GET') {
        $user = requireAuth();
        requireAdmin($user);
        require __DIR__ . '/routes/logs.php';
        getLogs();
    }
    // Client error logging
    elseif ($uri === '/client-error' && $method === 'POST') {
        require __DIR__ . '/routes/logs.php';
        logClientError();
    }
    // 404 for unknown routes
    else {
        errorResponse('Not found', 404);
    }
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    errorResponse($e->getMessage(), 500);
}
