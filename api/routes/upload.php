<?php
/**
 * Upload routes
 */

function handleUpload($user) {
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        errorResponse('No file uploaded', 400);
    }
    
    try {
        $url = handleFileUpload($_FILES['file']);
        jsonResponse(['url' => $url]);
    } catch (Exception $e) {
        errorResponse($e->getMessage(), 400);
    }
}
