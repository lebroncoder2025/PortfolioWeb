<?php
/**
 * Health check endpoint for debugging
 */

// Allow API access
define('API_ALLOWED', true);

// Load configuration
if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}
require_once __DIR__ . '/config.php';

// Response
header('Content-Type: application/json');

$response = [
    'status' => 'OK',
    'timestamp' => date('Y-m-d H:i:s'),
    'environment' => [
        'DB_HOST' => DB_HOST,
        'DB_NAME' => DB_NAME,
        'DB_USER' => DB_USER,
        'DB_PASSWORD' => strlen(DB_PASSWORD) . ' chars',
        'API_URL' => API_URL,
        'PHP_VERSION' => phpversion(),
    ]
];

// Test database connection
try {
    require_once __DIR__ . '/Database.php';
    $db = Database::getInstance();
    $response['database'] = 'Connected ✓';
    
    // Try a simple query
    $result = $db->fetchOne('SELECT 1 as test');
    $response['database_query'] = 'Query successful ✓';
} catch (Exception $e) {
    $response['database'] = 'Connection failed: ' . $e->getMessage();
    $response['database_query'] = 'Query failed';
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
