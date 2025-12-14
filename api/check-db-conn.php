<?php
define('API_ALLOWED', true);
// Load local override first so constants in config.local.php take precedence
if (file_exists(__DIR__ . '/config.local.php')) require_once __DIR__ . '/config.local.php';
require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
$host = defined('DB_HOST') ? DB_HOST : (defined('DBHOST') ? DBHOST : '127.0.0.1');
$port = 3306;
$result = [
    'host' => $host,
    'port' => $port,
    'tcp' => null,
    'pdo' => null,
];

// TCP check
$fp = @fsockopen($host, $port, $errno, $errstr, 5);
if ($fp) {
    $result['tcp'] = ['ok' => true];
    fclose($fp);
} else {
    $result['tcp'] = ['ok' => false, 'errno' => $errno, 'errstr' => $errstr];
}

// PDO check
try {
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $host, $port, DB_NAME);
    $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 5]);
    $stmt = $pdo->query('SELECT 1');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $result['pdo'] = ['ok' => true, 'result' => $row];
} catch (Exception $e) {
    $result['pdo'] = ['ok' => false, 'message' => $e->getMessage()];
}

echo json_encode($result, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
