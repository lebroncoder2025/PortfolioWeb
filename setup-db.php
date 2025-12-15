<?php
/**
 * Database Setup Script - Create tables for BLOB image storage
 * Run: php setup-db.php
 */

$db_host = 's8.jchost08.pl';
$db_port = 3306;
$db_user = 'pawelskie_portfolio';
$db_password = '2kEpSAtXXs6KKU4c5efT';
$db_name = 'pawelskie_portfolio';

try {
    echo "Connecting to database: {$db_host}...\n";
    
    $pdo = new PDO(
        "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4",
        $db_user,
        $db_password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ]
    );
    
    echo "✓ Connected successfully!\n\n";
    
    // Create portfolio_uploads table
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
    echo "✓ portfolio_uploads table created\n";
    
    // Check if image_data column exists in portfolio_images
    echo "Checking portfolio_images table...\n";
    $stmt = $pdo->query("SHOW COLUMNS FROM portfolio_images LIKE 'image_data'");
    
    if ($stmt->rowCount() === 0) {
        echo "Adding image_data column to portfolio_images...\n";
        $pdo->exec("ALTER TABLE portfolio_images ADD COLUMN image_data LONGBLOB AFTER url");
        echo "✓ image_data column added to portfolio_images\n";
    } else {
        echo "✓ image_data column already exists\n";
    }
    
    echo "\n✅ Database setup completed successfully!\n";
    echo "✅ Images can now be stored in the database\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
