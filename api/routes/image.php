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
    
    // Stream image with correct headers and allow cross-origin usage
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Range, Content-Type, Accept');
    header('Access-Control-Expose-Headers: Accept-Ranges, Content-Range');
    header('Content-Type: ' . ($image['mime_type'] ?: 'application/octet-stream'));
    header('Cache-Control: public, max-age=86400');
    echo $image['image_data'];
    exit;
}
