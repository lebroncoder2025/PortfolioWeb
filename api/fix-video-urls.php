<?php
/**
 * Fix video URLs in database - change /portfolio-php/api/image/ to /api/video/
 */

// Check if accessed through index.php router
if (!defined('API_ALLOWED')) {
    define('API_ALLOWED', true);
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/Database.php';
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $db = Database::getInstance();
    
    $fixed = [];
    
    // Fix portfolio_images table - change /portfolio-php/api/image/ to /api/video/ for videos
    $images = $db->fetchAll(
        "SELECT pi.id, pi.url 
         FROM portfolio_images pi 
         WHERE pi.url LIKE '%/portfolio-php/api/image/%'"
    );
    
    foreach ($images as $img) {
        $oldUrl = $img['url'];
        $uploadId = basename($oldUrl);
        
        // Check if this is a video in portfolio_uploads
        $upload = $db->fetchOne(
            "SELECT mime_type FROM portfolio_uploads WHERE id = ?",
            [$uploadId]
        );
        
        if ($upload && strpos($upload['mime_type'], 'video/') === 0) {
            // This is a video - use /api/video/
            $newUrl = str_replace('/portfolio-php/api/image/', '/api/video/', $oldUrl);
        } else {
            // This is an image - use /api/image/
            $newUrl = str_replace('/portfolio-php/api/image/', '/api/image/', $oldUrl);
        }
        
        $db->query(
            "UPDATE portfolio_images SET url = ? WHERE id = ?",
            [$newUrl, $img['id']]
        );
        
        $fixed[] = [
            'table' => 'portfolio_images',
            'id' => $img['id'],
            'oldUrl' => $oldUrl,
            'newUrl' => $newUrl,
            'type' => ($upload && strpos($upload['mime_type'], 'video/') === 0) ? 'video' : 'image'
        ];
    }
    
    // Fix portfolio_featured table
    $featured = $db->fetchAll(
        "SELECT pf.id, pf.url 
         FROM portfolio_featured pf 
         WHERE pf.url LIKE '%/portfolio-php/api/image/%'"
    );
    
    foreach ($featured as $fm) {
        $oldUrl = $fm['url'];
        $uploadId = basename($oldUrl);
        
        $upload = $db->fetchOne(
            "SELECT mime_type FROM portfolio_uploads WHERE id = ?",
            [$uploadId]
        );
        
        if ($upload && strpos($upload['mime_type'], 'video/') === 0) {
            $newUrl = str_replace('/portfolio-php/api/image/', '/api/video/', $oldUrl);
        } else {
            $newUrl = str_replace('/portfolio-php/api/image/', '/api/image/', $oldUrl);
        }
        
        $db->query(
            "UPDATE portfolio_featured SET url = ? WHERE id = ?",
            [$newUrl, $fm['id']]
        );
        
        $fixed[] = [
            'table' => 'portfolio_featured',
            'id' => $fm['id'],
            'oldUrl' => $oldUrl,
            'newUrl' => $newUrl
        ];
    }
    
    echo json_encode([
        'success' => true,
        'fixed' => $fixed,
        'count' => count($fixed)
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
