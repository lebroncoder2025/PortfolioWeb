<?php
header('Content-Type: application/json; charset=utf-8');
// Attempt to load API config (local override)
$cfg = __DIR__ . '/api/config.local.php';
if (file_exists($cfg)) include $cfg;
// Fallbacks
$host = defined('DB_HOST') ? DB_HOST : (defined('DBHOST') ? DBHOST : 's8.jchost08.pl');
$port = 3306;
$user = defined('DB_USER') ? DB_USER : (defined('DBUSER') ? DBUSER : 'pawelskie_portfolio');
$pass = defined('DB_PASSWORD') ? DB_PASSWORD : (defined('DBPASS') ? DBPASS : '');
$db   = defined('DB_NAME') ? DB_NAME : (defined('DBNAME') ? DBNAME : 'pawelskie_portfolio');

$out = ['host'=>$host,'port'=>$port];

$fp = @fsockopen($host, $port, $errno, $errstr, 5);
if ($fp) { $out['tcp'] = ['ok'=>true]; fclose($fp); }
else { $out['tcp'] = ['ok'=>false,'errno'=>$errno,'errstr'=>$errstr]; }

try {
    $dsn = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT=>5]);
    $s = $pdo->query('SELECT 1');
    $out['pdo'] = ['ok'=>true,'result'=>$s->fetch(PDO::FETCH_ASSOC)];
} catch (Exception $e) {
    $out['pdo'] = ['ok'=>false,'message'=>$e->getMessage()];
}

echo json_encode($out, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
