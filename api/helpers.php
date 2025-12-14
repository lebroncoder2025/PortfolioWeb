<?php
/**
 * Utility helper functions
 */

/**
 * Generate UUID v4
 */
function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

/**
 * Validate email format
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) && strlen($email) <= 255;
}

/**
 * Validate password strength
 */
function validatePassword($password) {
    return strlen($password) >= 8 
        && preg_match('/[A-Z]/', $password) 
        && preg_match('/[a-z]/', $password) 
        && preg_match('/[0-9]/', $password);
}

/**
 * Sanitize string input
 */
function sanitizeString($str, $maxLength = 500) {
    if (!is_string($str)) return '';
    return substr(trim(preg_replace('/[<>]/', '', $str)), 0, $maxLength);
}

/**
 * Add /portfolio-php prefix to local upload paths
 */
function fixLocalUploadPath($url) {
    if (is_string($url) && strpos($url, '/uploads/') === 0) {
        return '/portfolio-php' . $url;
    }
    return $url;
}

/**
 * Recursively fix URLs in nested structures - search ALL values
 */
function fixUploadPathsRecursive(&$data) {
    if (is_array($data)) {
        foreach ($data as &$item) {
            if (is_array($item) || is_object($item)) {
                // Recurse into arrays and objects
                fixUploadPathsRecursive($item);
            } elseif (is_string($item) && strpos($item, '/uploads/') === 0) {
                // Fix any string that starts with /uploads/
                $item = '/portfolio-php' . $item;
            }
        }
        unset($item); // Unset reference to avoid side effects
    } elseif (is_object($data)) {
        // For objects, iterate through all properties
        foreach ($data as $key => &$value) {
            if (is_array($value) || is_object($value)) {
                fixUploadPathsRecursive($value);
            } elseif (is_string($value) && strpos($value, '/uploads/') === 0) {
                $data->$key = '/portfolio-php' . $value;
            }
        }
        unset($value);
    }
}

/**
 * Normalize image URLs - add /portfolio-php prefix to local uploads
 */
function normalizeUrls($data) {
    if (is_array($data)) {
        $result = [];
        foreach ($data as $key => $value) {
            if ($key === 'url' && is_string($value) && strpos($value, '/uploads/') === 0 && strpos($value, '/portfolio-php') !== 0) {
                // Add /portfolio-php prefix to local upload paths
                $result[$key] = '/portfolio-php' . $value;
            } elseif (is_array($value) || is_object($value)) {
                $result[$key] = normalizeUrls($value);
            } else {
                $result[$key] = $value;
            }
        }
        return $result;
    } elseif (is_object($data)) {
        $obj = clone $data;
        foreach ($obj as $key => $value) {
            if ($key === 'url' && is_string($value) && strpos($value, '/uploads/') === 0 && strpos($value, '/portfolio-php') !== 0) {
                $obj->$key = '/portfolio-php' . $value;
            } elseif (is_array($value) || is_object($value)) {
                $obj->$key = normalizeUrls($value);
            }
        }
        return $obj;
    }
    return $data;
}

/**
 * Send JSON response
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    
    // Encode to JSON
    $json = json_encode($data, JSON_UNESCAPED_UNICODE);
    
    // Simple string replace to add /portfolio-php prefix to local upload paths
    // This is much faster than recursively walking the structure
    $json = str_replace('"\/uploads\/', '"\/portfolio-php\/uploads\/', $json);
    $json = str_replace('"/uploads/', '"/portfolio-php/uploads/', $json);
    
    echo $json;
    exit;
}

/**
 * Send error response
 */
function errorResponse($message, $statusCode = 400) {
    jsonResponse(['error' => $message], $statusCode);
}

/**
 * Get client IP address
 */
function getClientIP() {
    $headers = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 
                'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 
                'REMOTE_ADDR'];
    
    foreach ($headers as $header) {
        if (!empty($_SERVER[$header])) {
            $ips = explode(',', $_SERVER[$header]);
            $ip = trim($ips[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    
    return 'unknown';
}

/**
 * Log user action to database
 */
function logUserAction($userId, $action, $details = [], $ip = null, $logType = 'content') {
    try {
        $db = Database::getInstance();
        
        // Determine if it's an admin action
        $adminActions = ['login', 'logout', 'password_change', 'create_user', 'update_user', 'delete_user', 'role_change'];
        $actualLogType = in_array($action, $adminActions) ? 'admin' : $logType;
        
        $details['logType'] = $actualLogType;
        
        $db->insert('user_logs', [
            'id' => generateUUID(),
            'userId' => $userId,
            'action' => $action,
            'details' => json_encode($details, JSON_UNESCAPED_UNICODE),
            'ipAddress' => $ip ?? getClientIP(),
            'createdAt' => date('Y-m-d H:i:s')
        ]);
    } catch (Exception $e) {
        error_log("Failed to log user action: " . $e->getMessage());
    }
}

/**
 * Set CORS headers
 */
function setCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    
    // Check if origin is allowed
    $allowedOrigins = ALLOWED_ORIGINS;
    if (in_array('*', $allowedOrigins) || in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        header("Access-Control-Allow-Origin: " . $allowedOrigins[0]);
    }
    
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400");
}

/**
 * Handle preflight OPTIONS request
 */
function handlePreflight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        setCorsHeaders();
        http_response_code(204);
        exit;
    }
}

/**
 * Get JSON body from request
 */
function getJsonBody() {
    $rawBody = file_get_contents('php://input');
    $data = json_decode($rawBody, true);
    return $data ?? [];
}

/**
 * Handle file upload
 */
function handleFileUpload($file, $fieldName = 'file') {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return null;
    }
    
    // Check file size
    if ($file['size'] > MAX_FILE_SIZE) {
        throw new Exception('File too large');
    }
    
    // Check MIME type
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);
    
    if (!in_array($mimeType, ALLOWED_MIME_TYPES)) {
        throw new Exception('File type not allowed');
    }
    
    // Generate unique filename
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $baseName = pathinfo($file['name'], PATHINFO_FILENAME);
    $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', $baseName);
    $filename = $safeName . '-' . time() . '.' . $ext;
    
    $destination = UPLOAD_DIR . $filename;
    
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new Exception('Failed to save uploaded file');
    }
    
    return '/uploads/' . $filename;
}

/**
 * Require authentication
 */
function requireAuth() {
    try {
        return JWT::verifyAndGetUser();
    } catch (Exception $e) {
        errorResponse('Unauthorized: ' . $e->getMessage(), 401);
    }
}

/**
 * Require admin role
 */
function requireAdmin($user) {
    if (!isset($user['role']) || $user['role'] !== 'admin') {
        errorResponse('Admin access required', 403);
    }
}

/**
 * Normalize images array
 */
function normalizeImagesArray($images, $legacyImage = null) {
    $raw = is_array($images) ? $images : [];
    $normalized = [];
    
    foreach ($raw as $img) {
        if (empty($img)) continue;
        
        if (is_string($img)) {
            $normalized[] = ['url' => $img, 'caption' => ''];
        } elseif (is_array($img) && !empty($img['url'])) {
            $normalized[] = ['url' => $img['url'], 'caption' => $img['caption'] ?? ''];
        }
    }
    
    if (empty($normalized) && $legacyImage) {
        $normalized[] = ['url' => $legacyImage, 'caption' => ''];
    }
    
    return $normalized;
}
