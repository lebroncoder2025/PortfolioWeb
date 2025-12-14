<?php
/**
 * Authentication routes
 */

// Rate limiting storage (in production, use Redis or database)
$loginAttemptsFile = __DIR__ . '/../cache/login_attempts.json';

function getLoginAttempts() {
    global $loginAttemptsFile;
    if (!file_exists($loginAttemptsFile)) {
        return [];
    }
    $data = json_decode(file_get_contents($loginAttemptsFile), true);
    return $data ?? [];
}

function saveLoginAttempts($attempts) {
    global $loginAttemptsFile;
    $dir = dirname($loginAttemptsFile);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents($loginAttemptsFile, json_encode($attempts));
}

function handleLogin() {
    $data = getJsonBody();
    
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    // Validation
    if (empty($email) || empty($password)) {
        errorResponse('Email/username and password required', 400);
    }
    
    // Rate limiting
    $clientIp = getClientIP();
    $attemptKey = $clientIp . '-' . $email;
    $now = time();
    
    $attempts = getLoginAttempts();
    
    if (isset($attempts[$attemptKey])) {
        $attempt = $attempts[$attemptKey];
        
        // Check if locked out
        if (isset($attempt['lockedUntil']) && $attempt['lockedUntil'] > $now) {
            $remainingMins = ceil(($attempt['lockedUntil'] - $now) / 60);
            errorResponse("Too many attempts. Try again in $remainingMins minutes.", 429);
        }
        
        // Check if should be locked
        if ($attempt['count'] >= MAX_LOGIN_ATTEMPTS) {
            $attempts[$attemptKey] = ['count' => 1, 'lockedUntil' => $now + LOCKOUT_TIME];
            saveLoginAttempts($attempts);
            errorResponse('Too many failed attempts. Account temporarily locked.', 429);
        }
    }
    
    $db = Database::getInstance();
    
    // Find user by email or username
    if (strpos($email, '@') !== false) {
        $user = $db->fetchOne('SELECT * FROM users WHERE email = ?', [strtolower($email)]);
    } else {
        $user = $db->fetchOne('SELECT * FROM users WHERE name = ? OR email = ?', [$email, strtolower($email)]);
    }
    
    if ($user && password_verify($password, $user['passwordHash'])) {
        // Clear attempts on success
        unset($attempts[$attemptKey]);
        saveLoginAttempts($attempts);
        
        // Create token
        $token = JWT::encode([
            'email' => $user['email'],
            'role' => $user['role'],
            'userId' => $user['id']
        ]);
        
        // Log successful login
        logUserAction($user['id'], 'login', [
            'username' => $user['name'] ?? $user['email'],
            'email' => $user['email'],
            'role' => $user['role'],
            'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
        ], $clientIp, 'admin');
        
        jsonResponse([
            'token' => $token,
            'email' => $user['email'],
            'role' => $user['role'],
            'name' => $user['name'] ?? $user['email']
        ]);
    }
    
    // Track failed attempt
    if (isset($attempts[$attemptKey])) {
        $attempts[$attemptKey]['count']++;
    } else {
        $attempts[$attemptKey] = ['count' => 1, 'lockedUntil' => null];
    }
    saveLoginAttempts($attempts);
    
    errorResponse('Invalid credentials', 401);
}
