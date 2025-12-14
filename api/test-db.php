<?php
header('Content-Type: application/json');

$host = getenv('DB_HOST') ?: '';
$port = getenv('DB_PORT') ?: '3306';
$db   = getenv('DB_NAME') ?: '';
$user = getenv('DB_USER') ?: '';
$pass = getenv('DB_PASSWORD') ?: '';

$out = [
    'env' => [
        'DB_HOST' => $host,
        'DB_PORT' => $port,
        'DB_NAME' => $db,
        'DB_USER' => $user,
    ]
];

try {
    $dsn = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";
    $opts = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 5];
    $pdo = new PDO($dsn, $user, $pass, $opts);
    $stmt = $pdo->query('SELECT NOW() as now');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $out['ok'] = true;
    $out['now'] = $row['now'] ?? null;
} catch (Exception $e) {
    $out['ok'] = false;
    $out['error'] = $e->getMessage();
}

echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
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
