#!/usr/bin/env python3
"""
Database Setup Script - Create tables for BLOB image storage
"""

import mysql.connector
from mysql.connector import Error

# Database configuration
db_config = {
    'host': 's8.jchost08.pl',
    'port': 3306,
    'user': 'pawelskie_portfolio',
    'password': '2kEpSAtXXs6KKU4c5efT',
    'database': 'pawelskie_portfolio',
    'charset': 'utf8mb4'
}

try:
    print("Connecting to database:", db_config['host'])
    
    # Connect to database
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    
    print("✓ Connected successfully!\n")
    
    # Create portfolio_uploads table
    print("Creating portfolio_uploads table...")
    create_uploads_table = """
    CREATE TABLE IF NOT EXISTS portfolio_uploads (
        id VARCHAR(36) PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        mime_type VARCHAR(50),
        image_data LONGBLOB NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_uploaded_at (uploaded_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    cursor.execute(create_uploads_table)
    connection.commit()
    print("✓ portfolio_uploads table created\n")
    
    # Check if image_data column exists
    print("Checking portfolio_images table...")
    cursor.execute("SHOW COLUMNS FROM portfolio_images LIKE 'image_data'")
    result = cursor.fetchone()
    
    if result is None:
        print("Adding image_data column to portfolio_images...")
        cursor.execute("ALTER TABLE portfolio_images ADD COLUMN image_data LONGBLOB AFTER url")
        connection.commit()
        print("✓ image_data column added to portfolio_images\n")
    else:
        print("✓ image_data column already exists\n")
    
    print("✅ Database setup completed successfully!")
    print("✅ Images can now be stored in the database")
    
    cursor.close()
    connection.close()
    
except Error as e:
    print(f"❌ Error: {e}")
    exit(1)
