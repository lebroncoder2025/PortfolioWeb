<?php
// Usage: php scripts/fetch-api.php <output-dir>
$outDir = $argv[1] ?? (__DIR__ . '/../build/api');
if (!is_dir($outDir)) mkdir($outDir, 0755, true);

$host = getenv('DB_HOST') ?: getenv('INPUT_DB_HOST');
$name = getenv('DB_NAME') ?: getenv('INPUT_DB_NAME');
$user = getenv('DB_USER') ?: getenv('INPUT_DB_USER');
$pass = getenv('DB_PASSWORD') ?: getenv('INPUT_DB_PASSWORD');
$charset = getenv('DB_CHARSET') ?: 'utf8mb4';
$port = getenv('DB_PORT') ?: 3306;

if (!$host || !$name || !$user) {
    fwrite(STDERR, "Missing DB credentials. Set DB_HOST, DB_NAME, DB_USER, DB_PASSWORD\n");
    exit(1);
}

$dsn = "mysql:host={$host};dbname={$name};port={$port};charset={$charset}";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (Exception $e) {
    fwrite(STDERR, "DB connection failed: " . $e->getMessage() . "\n");
    exit(2);
}

function fetchOne($pdo, $sql, $params = []) {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetch() ?: null;
}
function fetchAll($pdo, $sql, $params = []) {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

$hero = fetchOne($pdo, 'SELECT * FROM site_hero LIMIT 1') ?: ['title'=>'','subtitle'=>'','image'=>''];
$about = fetchOne($pdo, 'SELECT * FROM site_about LIMIT 1');
if ($about) {
    $about['stats'] = $about['stats'] ? json_decode($about['stats'], true) : [];
} else {
    $about = ['title'=>'','bio'=>'','image'=>'','stats'=>[]];
}
$contact = fetchOne($pdo, 'SELECT * FROM site_contact LIMIT 1') ?: ['email'=>'','phone'=>'','location'=>''];
$services = fetchAll($pdo, 'SELECT * FROM services ORDER BY `order` ASC');
$categories = fetchAll($pdo, 'SELECT * FROM categories ORDER BY name ASC');
$portfolioItems = fetchAll($pdo, 'SELECT * FROM portfolio ORDER BY `order` ASC');
$layoutRows = fetchAll($pdo, 'SELECT * FROM layout ORDER BY `order` ASC');
$socialRow = fetchOne($pdo, 'SELECT * FROM site_social LIMIT 1');

// images & featured
$portfolioIds = array_filter(array_column($portfolioItems, 'id'));
$imagesMap = [];
$featuredMap = [];
if (!empty($portfolioIds)) {
    $placeholders = implode(',', array_fill(0, count($portfolioIds), '?'));
    $images = fetchAll($pdo, "SELECT * FROM portfolio_images WHERE portfolio_id IN ($placeholders) ORDER BY `order` ASC", $portfolioIds);
    foreach ($images as $img) {
        $imagesMap[$img['portfolio_id']][] = ['url'=>$img['url'], 'caption'=>$img['caption'] ?? ''];
    }
    $featured = fetchAll($pdo, "SELECT * FROM portfolio_featured WHERE portfolio_id IN ($placeholders)", $portfolioIds);
    foreach ($featured as $fm) {
        $featuredMap[$fm['portfolio_id']] = ['url'=>$fm['url'], 'caption'=>$fm['caption'] ?? ''];
    }
}

$portfolio = [];
foreach ($portfolioItems as $p) {
    $pImages = $imagesMap[$p['id']] ?? [];
    if (empty($pImages) && !empty($p['images'])) {
        $pImages = is_string($p['images']) ? json_decode($p['images'], true) : $p['images'];
    }
    $pFeatured = $featuredMap[$p['id']] ?? null;
    if (!$pFeatured && !empty($p['featuredMedia'])) {
        $pFeatured = is_string($p['featuredMedia']) ? json_decode($p['featuredMedia'], true) : $p['featuredMedia'];
    }
    $portfolio[] = [
        'id'=>$p['id'],'title'=>$p['title'],'category'=>$p['category'],'images'=>$pImages ?: [],'video'=>$p['video'] ?? null,'order'=>$p['order'],'featuredMedia'=>$pFeatured
    ];
}

$layout = [];
foreach ($layoutRows as $l) {
    $layout[] = ['id'=>$l['sectionId'],'visible'=>(bool)$l['visible'],'order'=>$l['order']];
}

$social = [];
if ($socialRow) {
    $social = [
        'facebook'=>$socialRow['facebook'] ?? '',
        'instagram'=>$socialRow['instagram'] ?? '',
        'twitter'=>$socialRow['twitter'] ?? '',
        'tiktok'=>$socialRow['tiktok'] ?? '',
        'youtube'=>$socialRow['youtube'] ?? '',
        'linkedin'=>$socialRow['linkedin'] ?? '',
        'pinterest'=>$socialRow['pinterest'] ?? '',
        'canva'=>$socialRow['canva'] ?? ''
    ];
}

$response = [
    'hero'=>$hero,'about'=>$about,'contact'=>$contact,'services'=>$services,'categories'=>$categories,'portfolio'=>$portfolio,'layout'=>$layout,'social'=>$social
];

// Fix upload paths (prefix)
array_walk_recursive($response, function (&$v, $k) {
    if (is_string($v) && strpos($v, '/uploads/') === 0) $v = '/PortfolioWeb' . $v;
});

file_put_contents(rtrim($outDir, '/\\') . '/site.json', json_encode($response, JSON_UNESCAPED_UNICODE));

echo "Wrote: " . rtrim($outDir, '/\\') . "/site.json\n";

return 0;
