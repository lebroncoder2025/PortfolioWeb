<?php
/**
 * Migration script to add image_data LONGBLOB column and create portfolio_uploads table
 * Run: php api/migrate-to-blob.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Database.php';

$db = Database::getInstance();
$pdo = $db->getConnection();

try {
    echo "Starting migration...\n";
    
    // Create portfolio_uploads table for storing images
    echo "Creating portfolio_uploads table...\n";
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS portfolio_uploads (
            id VARCHAR(36) PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            mime_type VARCHAR(50),
            image_data LONGBLOB NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_uploaded_at (uploaded_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ portfolio_uploads table created/verified\n";
    
    // Add image_data column to portfolio_images if it doesn't exist
    echo "Checking portfolio_images table...\n";
    $stmt = $pdo->query("SHOW COLUMNS FROM portfolio_images LIKE 'image_data'");
    if ($stmt->rowCount() === 0) {
        echo "Adding image_data LONGBLOB column to portfolio_images...\n";
        $pdo->exec("ALTER TABLE portfolio_images ADD COLUMN image_data LONGBLOB AFTER url");
        echo "✓ Column 'image_data' added to portfolio_images table\n";
    } else {
        echo "✓ Column 'image_data' already exists in portfolio_images\n";
    }
    
    echo "\n✓ Migration successful!\n";
    exit(0);
    
} catch (PDOException $e) {
    echo "✗ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
