<?php
/**
 * Video serving route - stream videos from database
 */

function serveVideo($id) {
    $db = Database::getInstance();
    
    if (!$id) {
        errorResponse('Video ID required', 400);
    }
    
    // Get video from database
    $video = $db->fetchOne(
        'SELECT image_data, mime_type FROM portfolio_uploads WHERE id = ?',
        [$id]
    );
    
    if (!$video || !$video['image_data']) {
        errorResponse('Video not found', 404);
    }
    
    // Stream video with correct headers for range requests (seek support)
    $filesize = strlen($video['image_data']);
    $mimeType = $video['mime_type'] ?: 'video/mp4';
    
    header('Content-Type: ' . $mimeType);
    header('Content-Length: ' . $filesize);
    header('Accept-Ranges: bytes');
    header('Cache-Control: public, max-age=86400');
    
    // Handle range requests for seeking in video
    if (isset($_SERVER['HTTP_RANGE'])) {
        if (preg_match('/bytes=(\d+)-(\d*)/', $_SERVER['HTTP_RANGE'], $matches)) {
            $start = intval($matches[1]);
            $end = $matches[2] !== '' ? intval($matches[2]) : $filesize - 1;
            
            if ($start <= $end && $end < $filesize) {
                http_response_code(206);
                header('Content-Range: bytes ' . $start . '-' . $end . '/' . $filesize);
                header('Content-Length: ' . ($end - $start + 1));
                echo substr($video['image_data'], $start, $end - $start + 1);
                exit;
            }
        }
    }
    
    // Normal response
    echo $video['image_data'];
    exit;
}
