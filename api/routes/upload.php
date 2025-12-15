<?php
/**
 * Upload routes
 */

function handleUpload($user) {
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        errorResponse('No file uploaded', 400);
    }
    
    try {
        $uploadResult = handleFileUpload($_FILES['file']);
        if (!$uploadResult) {
            errorResponse('File upload failed', 400);
        }
        
        $db = Database::getInstance();
        $imageId = generateUUID();
        
        // Store image in database
        $db->insert('portfolio_uploads', [
            'id' => $imageId,
            'filename' => $uploadResult['filename'],
            'mime_type' => $uploadResult['mimeType'],
            'image_data' => $uploadResult['imageData'],
            'uploaded_at' => date('Y-m-d H:i:s')
        ]);
        
        // Return image ID for use in portfolio items
        jsonResponse([
            'id' => $imageId,
            'url' => '/image/' . $imageId,
            'filename' => $uploadResult['filename']
        ]);
    } catch (Exception $e) {
        errorResponse($e->getMessage(), 400);
    }
}
