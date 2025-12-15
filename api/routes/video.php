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
    
    // Allow cross-origin streaming (useful when frontend and API are on different origins)
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Range, Content-Type, Accept');
    // Expose debugging and range headers to the client
    header('Access-Control-Expose-Headers: Accept-Ranges, Content-Range, X-Server-Video-Mime, X-Server-Video-Size');
    // Debug headers to help identify MIME/size issues during troubleshooting
    header('X-Server-Video-Mime: ' . $mimeType);
    header('X-Server-Video-Size: ' . $filesize);
    header('Accept-Ranges: bytes');
    header('Cache-Control: public, max-age=86400');

    // Handle range requests for seeking in video (do NOT send Content-Length until we know full vs partial)
    if (isset($_SERVER['HTTP_RANGE'])) {
        if (preg_match('/bytes=(\d+)-(\d*)/', $_SERVER['HTTP_RANGE'], $matches)) {
            $start = intval($matches[1]);
            $end = $matches[2] !== '' ? intval($matches[2]) : $filesize - 1;

            if ($start <= $end && $end < $filesize) {
                $length = $end - $start + 1;
                http_response_code(206);
                header('Content-Type: ' . $mimeType);
                header('Content-Range: bytes ' . $start . '-' . $end . '/' . $filesize);
                header('Content-Length: ' . $length);
                echo substr($video['image_data'], $start, $length);
                exit;
            }
        }
    }

    // Normal (full) response
    header('Content-Type: ' . $mimeType);
    header('Content-Length: ' . $filesize);
    http_response_code(200);
    echo $video['image_data'];
    exit;
}
