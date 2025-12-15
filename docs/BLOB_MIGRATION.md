# Database Migration - Image BLOB Storage

The backend has been updated to store images in the database as BLOBs instead of filesystem files.

## Migration Steps

### Step 1: Create New Tables (Run on Database)

Connect to your database and execute this SQL to create the new `portfolio_uploads` table:

```sql
CREATE TABLE IF NOT EXISTS portfolio_uploads (
    id VARCHAR(36) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(50),
    image_data LONGBLOB NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_uploaded_at (uploaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE portfolio_images ADD COLUMN image_data LONGBLOB AFTER url;
```

### Step 2: Trigger Migration (After Database Setup)

Once the tables are created, trigger the API migration:

```bash
curl -X POST https://portfolioweb-production-5696.up.railway.app/migrate
```

Or visit this URL in your browser:
https://portfolioweb-production-5696.up.railway.app/migrate.php

### How It Works Now

1. **Upload**: When you upload an image, it's stored in the `portfolio_uploads` table as a LONGBLOB
2. **Serving**: Images are served via `/api/image/{id}` endpoint with correct MIME type headers
3. **Frontend**: Frontend requests images from the API endpoint instead of filesystem URLs
4. **Persistence**: Images are stored in the database, persisting across redeploys

## New API Endpoints

- `POST /api/upload` - Upload image, returns `{id, url: '/image/{id}', filename}`
- `GET /api/image/{id}` - Serve image from database with correct headers

## Benefits

✅ Images persist across Railway redeploys
✅ No filesystem storage needed
✅ Scalable to multiple instances
✅ Automatic cleanup with migrations
