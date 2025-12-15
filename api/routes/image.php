<?php
/**
 * Image serving route - stream images from database
 */

function serveImage($id) {
    $db = Database::getInstance();
    
    if (!$id) {
        errorResponse('Image ID required', 400);
    }
    
    // Get image from database
    $image = $db->fetchOne(
        'SELECT image_data, mime_type FROM portfolio_uploads WHERE id = ?',
        [$id]
    );
    
    if (!$image || !$image['image_data']) {
        errorResponse('Image not found', 404);
    }
    
    // Stream image with correct headers
    header('Content-Type: ' . ($image['mime_type'] ?: 'application/octet-stream'));
    header('Cache-Control: public, max-age=86400');
    echo $image['image_data'];
    exit;
}
