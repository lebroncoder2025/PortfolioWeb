# Portfolio React + PHP - Konfiguracja lokalna (XAMPP)

## Wymagania
- XAMPP z Apache i MySQL (zainstalowany w E:\xampp)
- Node.js >= 20.0.0 (do budowania React)
- PHP >= 7.4 (włączone w XAMPP)

## Krok 1: Przygotowanie bazy danych

1. Uruchom XAMPP Control Panel
2. Włącz Apache i MySQL
3. Otwórz phpMyAdmin: http://localhost/phpmyadmin
4. Utwórz nową bazę danych: `portfolio`
5. Zaimportuj schemat:
   - Kliknij na bazę `portfolio`
   - Wybierz zakładkę "Import"
   - Wybierz plik: `database/schema.sql`
   - Kliknij "Wykonaj"

## Krok 2: Konfiguracja API PHP

1. Skopiuj folder `api` do katalogu htdocs XAMPP:
   ```powershell
   Copy-Item -Path "e:\portfolio Klaudia\portfolio-php\api" -Destination "E:\xampp\htdocs\portfolio-php\api" -Recurse -Force
   ```

2. Skopiuj folder `uploads` (jeśli istnieje):
   ```powershell
   Copy-Item -Path "e:\portfolio Klaudia\portfolio-php\uploads" -Destination "E:\xampp\htdocs\portfolio-php\uploads" -Recurse -Force
   ```

3. Zweryfikuj konfigurację w `api/config.local.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'portfolio');
   define('DB_USER', 'root');
   define('DB_PASSWORD', ''); // domyślnie puste w XAMPP
   ```

## Krok 3: Budowanie React

1. Zainstaluj zależności:
   ```powershell
   cd "e:\portfolio Klaudia\portfolio-php"
   npm install
   ```

2. Zbuduj aplikację z lokalnym API URL:
   ```powershell
   npm run build:local
   ```

3. Skopiuj zbudowaną aplikację do htdocs:
   ```powershell
   Copy-Item -Path "e:\portfolio Klaudia\portfolio-php\build\*" -Destination "E:\xampp\htdocs\portfolio-php\" -Recurse -Force
   ```

## Krok 4: Konfiguracja Apache (.htaccess)

Utwórz plik `E:\xampp\htdocs\portfolio-php\.htaccess`:

```apache
RewriteEngine On

# Handle API requests
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# Handle React Router (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(?!api/)(.*)$ index.html [QSA,L]
```

## Krok 5: Testowanie

1. Otwórz przeglądarkę: http://localhost/portfolio-php
2. Strona główna powinna się załadować
3. Panel admina: http://localhost/portfolio-php/admin_panel
4. Domyślne dane logowania:
   - Email: `admin@example.com`
   - Hasło: `Admin123!`

## Rozwiązywanie problemów

### API nie działa
- Sprawdź czy mod_rewrite jest włączony w Apache
- Sprawdź logi Apache: `E:\xampp\apache\logs\error.log`
- Sprawdź czy PHP jest włączone

### Brak połączenia z bazą
- Sprawdź czy MySQL działa w XAMPP
- Zweryfikuj dane w `config.local.php`
- Sprawdź czy baza `portfolio` istnieje

### CORS błędy
- Sprawdź czy `ALLOWED_ORIGINS` zawiera `http://localhost`
- Wyczyść cache przeglądarki

## Struktura plików w htdocs

Po wykonaniu kroków powinna być struktura:
```
E:\xampp\htdocs\portfolio-php\
├── index.html          # React app
├── static/             # CSS/JS assets
├── .htaccess           # URL routing
├── api/
│   ├── index.php       # API router
│   ├── config.php
│   ├── config.local.php
│   ├── Database.php
│   ├── JWT.php
│   ├── helpers.php
│   ├── .htaccess
│   └── routes/
│       ├── auth.php
│       ├── site.php
│       ├── users.php
│       ├── upload.php
│       └── logs.php
└── uploads/            # Uploaded files
```
