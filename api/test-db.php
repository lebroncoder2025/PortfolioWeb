<?php
// Simple DB connectivity test - call via browser: /api/test-db.php
define('API_ALLOWED', true);
// Load local override first so config.local.php constants override defaults
if (file_exists(__DIR__ . '/config.local.php')) require_once __DIR__ . '/config.local.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Database.php';

header('Content-Type: application/json; charset=utf-8');
try {
    $db = Database::getInstance();
    $conn = $db->getConnection();
    $stmt = $conn->query('SELECT 1 AS ok');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['ok' => true, 'db' => 'connected', 'result' => $row]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
