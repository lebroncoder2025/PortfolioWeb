<?php
header('Content-Type: application/json');

$uploadBase = getenv('UPLOAD_BASE_URL') ?: '/portfolio-php';

// Simple DB connectivity test - call via browser: /api/test-db.php
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
        'UPLOAD_BASE_URL' => $uploadBase,
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

// Test normalizeUrls
require_once __DIR__ . '/helpers.php';
$testData = [
    'portfolio' => [
        [
            'images' => [
                ['url' => '/uploads/test.jpg', 'caption' => '']
            ]
        ]
    ]
];

$normalized = normalizeUrls($testData);
echo "\n\nNormalized test:\n" . json_encode($normalized, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

// Check DB URLs
try {
    $stmt = $pdo->query('SELECT url FROM portfolio_images LIMIT 5');
    $urls = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "\n\nDB URLs:\n" . json_encode($urls, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (Exception $e) {
    echo "\n\nDB URLs error: " . $e->getMessage();
}
