<?php
/**
 * Fix video URLs in database - change /portfolio-php/api/image/ to /api/video/
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $db = Database::getInstance();
    
    // Find all URLs with old pattern
    $images = $db->fetchAll(
        "SELECT pi.id, pi.url, pu.mime_type 
         FROM portfolio_images pi 
         LEFT JOIN portfolio_uploads pu ON SUBSTRING_INDEX(pi.url, '/', -1) = pu.id
         WHERE pi.url LIKE '%/portfolio-php/api/image/%'"
    );
    
    $fixed = [];
    $errors = [];
    
    foreach ($images as $img) {
        $oldUrl = $img['url'];
        $uploadId = basename($oldUrl);
        
        // Check if this is a video
        $upload = $db->fetchOne(
            "SELECT mime_type FROM portfolio_uploads WHERE id = ?",
            [$uploadId]
        );
        
        if ($upload && strpos($upload['mime_type'], 'video/') === 0) {
            // This is a video - fix the URL
            $newUrl = str_replace('/portfolio-php/api/image/', '/api/video/', $oldUrl);
            
            $db->query(
                "UPDATE portfolio_images SET url = ? WHERE id = ?",
                [$newUrl, $img['id']]
            );
            
            $fixed[] = [
                'id' => $img['id'],
                'oldUrl' => $oldUrl,
                'newUrl' => $newUrl,
                'mimeType' => $upload['mime_type']
            ];
        } else {
            // Not a video, just fix to /api/image/
            $newUrl = str_replace('/portfolio-php/api/image/', '/api/image/', $oldUrl);
            
            $db->query(
                "UPDATE portfolio_images SET url = ? WHERE id = ?",
                [$newUrl, $img['id']]
            );
            
            $fixed[] = [
                'id' => $img['id'],
                'oldUrl' => $oldUrl,
                'newUrl' => $newUrl,
                'type' => 'image'
            ];
        }
    }
    
    // Also check portfolio_featured table
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
            'id' => $fm['id'],
            'table' => 'portfolio_featured',
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
