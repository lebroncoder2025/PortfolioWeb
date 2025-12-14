<?php
/**
 * Logs routes
 */

function getLogs() {
    $db = Database::getInstance();
    
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? 50);
    $logType = $_GET['type'] ?? 'all';
    $offset = ($page - 1) * $limit;
    
    // Get logs with user info
    $logs = $db->fetchAll("
        SELECT l.*, u.email as userEmail, u.name as userName, u.role as userRole
        FROM user_logs l
        LEFT JOIN users u ON l.userId = u.id
        ORDER BY l.createdAt DESC
        LIMIT ? OFFSET ?
    ", [$limit, $offset]);
    
    // Get total count
    $countResult = $db->fetchOne('SELECT COUNT(*) as total FROM user_logs');
    $total = $countResult['total'];
    
    // Format logs
    $formattedLogs = [];
    foreach ($logs as $log) {
        $details = $log['details'] ? json_decode($log['details'], true) : [];
        $logTypeFromDetails = $details['logType'] ?? 'unknown';
        
        // Filter by logType
        if ($logType !== 'all' && $logTypeFromDetails !== $logType) {
            continue;
        }
        
        $formattedLogs[] = [
            'id' => $log['id'],
            'userId' => $log['userId'],
            'userEmail' => $log['userEmail'],
            'userName' => $log['userName'],
            'userRole' => $log['userRole'],
            'action' => $log['action'],
            'details' => $details,
            'logType' => $logTypeFromDetails,
            'ipAddress' => $log['ipAddress'],
            'createdAt' => $log['createdAt']
        ];
    }
    
    jsonResponse([
        'logs' => $formattedLogs,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
}

function logClientError() {
    $data = getJsonBody();
    
    error_log('[CLIENT ERROR] ' . json_encode($data));
    
    // Write to file
    $logFile = __DIR__ . '/../../logs/client-errors.log';
    $logDir = dirname($logFile);
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logLine = date('Y-m-d H:i:s') . ' ' . json_encode($data) . "\n";
    file_put_contents($logFile, $logLine, FILE_APPEND);
    
    jsonResponse(['ok' => true]);
}
