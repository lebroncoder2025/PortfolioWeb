<?php
/**
 * Users management routes
 */

function handleUsers($uri, $method, $user) {
    $db = Database::getInstance();
    
    // Parse user ID from URI
    preg_match('#/users(?:/(.+))?#', $uri, $matches);
    $userId = $matches[1] ?? null;
    
    switch ($method) {
        case 'GET':
            getUsers($db);
            break;
            
        case 'POST':
            createUser($db, $user);
            break;
            
        case 'PUT':
            if (!$userId) errorResponse('User ID required', 400);
            updateUser($db, $userId, $user);
            break;
            
        case 'DELETE':
            if (!$userId) errorResponse('User ID required', 400);
            deleteUser($db, $userId, $user);
            break;
            
        default:
            errorResponse('Method not allowed', 405);
    }
}

function getUsers($db) {
    $users = $db->fetchAll('SELECT id, email, role, name, createdAt FROM users ORDER BY createdAt DESC');
    jsonResponse($users);
}

function createUser($db, $currentUser) {
    $data = getJsonBody();
    
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;
    $role = $data['role'] ?? null;
    $name = $data['name'] ?? null;
    
    // Validation
    if (!$password || !$role) {
        errorResponse('Password and role are required', 400);
    }
    
    if ($email && !validateEmail($email)) {
        errorResponse('Invalid email format', 400);
    }
    
    if (!validatePassword($password)) {
        errorResponse('Password must be at least 8 characters with uppercase, lowercase, and number', 400);
    }
    
    if (!in_array($role, ['admin', 'moderator'])) {
        errorResponse('Role must be admin or moderator', 400);
    }
    
    // Check if email already exists
    if ($email) {
        $existing = $db->fetchOne('SELECT id FROM users WHERE email = ?', [strtolower($email)]);
        if ($existing) {
            errorResponse('Email already exists', 400);
        }
    }
    
    $id = generateUUID();
    $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    $createdAt = date('Y-m-d H:i:s');
    
    $db->insert('users', [
        'id' => $id,
        'email' => $email ? strtolower($email) : null,
        'passwordHash' => $passwordHash,
        'role' => $role,
        'name' => sanitizeString($name ?? ($email ?? 'user'), 100),
        'createdAt' => $createdAt
    ]);
    
    logUserAction($currentUser['userId'], 'create_user', [
        'createdUserName' => $name,
        'createdUserEmail' => $email,
        'createdUserRole' => $role,
        'timestamp' => date('d.m.Y H:i:s')
    ], null, 'admin');
    
    jsonResponse([
        'id' => $id,
        'email' => $email ? strtolower($email) : null,
        'role' => $role,
        'name' => $name ?? ($email ?? 'user'),
        'createdAt' => $createdAt
    ]);
}

function updateUser($db, $userId, $currentUser) {
    $data = getJsonBody();
    
    // Get existing user
    $existing = $db->fetchOne('SELECT * FROM users WHERE id = ?', [$userId]);
    if (!$existing) {
        errorResponse('User not found', 404);
    }
    
    $email = $data['email'] ?? null;
    $role = $data['role'] ?? null;
    $name = $data['name'] ?? null;
    $password = $data['password'] ?? null;
    
    $updateEmail = $existing['email'];
    $updateRole = $existing['role'];
    $updateName = $existing['name'];
    $updatePassword = $existing['passwordHash'];
    
    // Validate and update email
    if ($email) {
        if (!validateEmail($email)) {
            errorResponse('Invalid email format', 400);
        }
        $emailCheck = $db->fetchOne('SELECT id FROM users WHERE email = ? AND id != ?', [strtolower($email), $userId]);
        if ($emailCheck) {
            errorResponse('Email already in use', 400);
        }
        $updateEmail = strtolower($email);
    }
    
    // Validate and update role
    if ($role) {
        if (!in_array($role, ['admin', 'moderator'])) {
            errorResponse('Role must be admin or moderator', 400);
        }
        $updateRole = $role;
    }
    
    // Update name
    if ($name) {
        $updateName = sanitizeString($name, 100);
    }
    
    // Validate and update password
    if ($password) {
        if (!validatePassword($password)) {
            errorResponse('Password must be at least 8 characters with uppercase, lowercase, and number', 400);
        }
        $updatePassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    }
    
    $db->query(
        'UPDATE users SET email = ?, role = ?, name = ?, passwordHash = ? WHERE id = ?',
        [$updateEmail, $updateRole, $updateName, $updatePassword, $userId]
    );
    
    // Log changes
    $changedFields = array_filter([
        $email && $updateEmail !== $existing['email'] ? 'email' : null,
        $password ? 'hasło' : null,
        $name && $updateName !== $existing['name'] ? 'nazwa' : null,
        $role && $updateRole !== $existing['role'] ? 'rola' : null
    ]);
    
    logUserAction($currentUser['userId'], 'update_user', [
        'updatedUserName' => $updateName,
        'updatedUserEmail' => $updateEmail,
        'updatedUserRole' => $updateRole,
        'changedFields' => $changedFields,
        'timestamp' => date('d.m.Y H:i:s')
    ], null, 'admin');
    
    jsonResponse([
        'id' => $userId,
        'email' => $updateEmail,
        'role' => $updateRole,
        'name' => $updateName,
        'createdAt' => $existing['createdAt']
    ]);
}

function deleteUser($db, $userId, $currentUser) {
    // Get user
    $userToDelete = $db->fetchOne('SELECT * FROM users WHERE id = ?', [$userId]);
    if (!$userToDelete) {
        errorResponse('User not found', 404);
    }
    
    // Prevent deleting yourself
    if ($userToDelete['email'] === $currentUser['email']) {
        errorResponse('Cannot delete your own account', 400);
    }
    
    // Ensure at least one admin remains
    if ($userToDelete['role'] === 'admin') {
        $adminCount = $db->fetchOne('SELECT COUNT(*) as count FROM users WHERE role = "admin"');
        if ($adminCount['count'] <= 1) {
            errorResponse('Cannot delete the last admin account', 400);
        }
    }
    
    $db->delete('users', 'id = ?', [$userId]);
    
    logUserAction($currentUser['userId'], 'delete_user', [
        'deletedUserName' => $userToDelete['name'],
        'deletedUserEmail' => $userToDelete['email'],
        'deletedUserRole' => $userToDelete['role'],
        'timestamp' => date('d.m.Y H:i:s')
    ], null, 'admin');
    
    jsonResponse(['success' => true]);
}
