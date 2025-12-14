<# 
    Setup script for local XAMPP development
    Run in PowerShell as Administrator (optional) from portfolio-php folder
#>

param(
    [string]$XamppPath = "E:\xampp",
    [string]$ProjectPath = $PSScriptRoot,
    [string]$TargetFolder = "portfolio-php"
)

$htdocsPath = Join-Path $XamppPath "htdocs"
$targetPath = Join-Path $htdocsPath $TargetFolder

Write-Host "=== Portfolio PHP - XAMPP Setup ===" -ForegroundColor Cyan
Write-Host "XAMPP Path: $XamppPath"
Write-Host "Project Path: $ProjectPath"
Write-Host "Target: $targetPath"
Write-Host ""

# Check if XAMPP exists
if (-not (Test-Path $XamppPath)) {
    Write-Host "ERROR: XAMPP not found at $XamppPath" -ForegroundColor Red
    exit 1
}

# Create target directory
Write-Host "Creating target directory..." -ForegroundColor Yellow
if (-not (Test-Path $targetPath)) {
    New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
}

# Copy API files
Write-Host "Copying API files..." -ForegroundColor Yellow
$apiSource = Join-Path $ProjectPath "api"
$apiTarget = Join-Path $targetPath "api"
if (Test-Path $apiSource) {
    Copy-Item -Path $apiSource -Destination $targetPath -Recurse -Force
    Write-Host "  API files copied to $apiTarget" -ForegroundColor Green
} else {
    Write-Host "  ERROR: API folder not found at $apiSource" -ForegroundColor Red
}

# Create uploads directory
$uploadsTarget = Join-Path $targetPath "uploads"
if (-not (Test-Path $uploadsTarget)) {
    New-Item -ItemType Directory -Path $uploadsTarget -Force | Out-Null
    Write-Host "  Created uploads directory" -ForegroundColor Green
}

# Create cache directory for API
$cacheTarget = Join-Path $targetPath "api\cache"
if (-not (Test-Path $cacheTarget)) {
    New-Item -ItemType Directory -Path $cacheTarget -Force | Out-Null
}

# Create logs directory
$logsTarget = Join-Path $targetPath "logs"
if (-not (Test-Path $logsTarget)) {
    New-Item -ItemType Directory -Path $logsTarget -Force | Out-Null
}

# Check if build exists
$buildSource = Join-Path $ProjectPath "build"
if (Test-Path $buildSource) {
    Write-Host "Copying React build..." -ForegroundColor Yellow
    Get-ChildItem -Path $buildSource | Copy-Item -Destination $targetPath -Recurse -Force
    Write-Host "  React build copied" -ForegroundColor Green
} else {
    Write-Host "WARNING: Build folder not found. Run 'npm run build:local' first." -ForegroundColor Yellow
}

# Create main .htaccess for routing
Write-Host "Creating .htaccess for routing..." -ForegroundColor Yellow
$htaccessContent = @"
RewriteEngine On

# Handle API requests
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# Serve static files directly
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Handle React Router (SPA) - all other requests go to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(?!api/)(.*)$ index.html [QSA,L]
"@
$htaccessPath = Join-Path $targetPath ".htaccess"
Set-Content -Path $htaccessPath -Value $htaccessContent -Encoding UTF8
Write-Host "  .htaccess created" -ForegroundColor Green

# Copy database schema
Write-Host "Copying database schema..." -ForegroundColor Yellow
$schemaSource = Join-Path $ProjectPath "database\schema.sql"
$schemaTarget = Join-Path $targetPath "database"
if (Test-Path $schemaSource) {
    if (-not (Test-Path $schemaTarget)) {
        New-Item -ItemType Directory -Path $schemaTarget -Force | Out-Null
    }
    Copy-Item -Path $schemaSource -Destination $schemaTarget -Force
    Write-Host "  Schema copied to $schemaTarget" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start Apache and MySQL in XAMPP Control Panel"
Write-Host "2. Open phpMyAdmin: http://localhost/phpmyadmin"
Write-Host "3. Create database 'portfolio' and import schema.sql"
Write-Host "4. If build doesn't exist, run:"
Write-Host "   cd `"$ProjectPath`""
Write-Host "   npm install"
Write-Host "   npm run build:local"
Write-Host "   Then run this script again."
Write-Host ""
Write-Host "5. Open: http://localhost/$TargetFolder"
Write-Host "6. Admin panel: http://localhost/$TargetFolder/admin_panel"
Write-Host "   Default login: admin@example.com / Admin123!"
Write-Host ""
