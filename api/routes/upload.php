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
        
        // Return media ID for use in portfolio items
        // Use full API URL so frontend on GitHub Pages can fetch it
        $apiUrl = getenv('API_URL') ?: 'https://portfolio-api.example.com/api';
        
        // Determine endpoint based on MIME type
        $isVideo = strpos($uploadResult['mimeType'], 'video/') === 0;
        $endpoint = $isVideo ? 'video' : 'image';
        $mediaUrl = $apiUrl . '/' . $endpoint . '/' . $imageId;
        
        jsonResponse([
            'id' => $imageId,
            'url' => $mediaUrl,
            'filename' => $uploadResult['filename']
        ]);
    } catch (Exception $e) {
        errorResponse($e->getMessage(), 400);
    }
}
