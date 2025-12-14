# Wdrożenie na hosting PHP (jchost) + GitHub Pages

Ten przewodnik opisuje jak wdrożyć portfolio z:
- **Frontend (React)** → GitHub Pages (darmowy hosting statyczny)
- **Backend (PHP API)** → jchost lub inny hosting współdzielony z PHP/MySQL

## Architektura

```
┌─────────────────────┐     API requests     ┌──────────────────────┐
│   GitHub Pages      │ ──────────────────▶  │   jchost PHP         │
│   (Static React)    │                      │   (API + Uploads)    │
│                     │ ◀──────────────────  │                      │
│   your-user.github  │     JSON responses   │   your-domain.com    │
│   .io/portfolio     │                      │   /api               │
└─────────────────────┘                      └──────────────────────┘
```

## Część 1: Konfiguracja PHP API na jchost

### 1.1 Przygotowanie bazy danych

1. Zaloguj się do panelu jchost
2. Utwórz nową bazę danych MySQL:
   - Nazwa: `portfolio` (lub inna)
   - Zapisz: host, użytkownik, hasło
3. Zaimportuj schemat `database/schema.sql` przez phpMyAdmin

### 1.2 Upload plików API

Prześlij przez FTP lub panel do folderu `public_html/api/`:

```
public_html/
└── api/
    ├── index.php
    ├── config.php
    ├── config.local.php  ← Skonfiguruj tutaj!
    ├── Database.php
    ├── JWT.php
    ├── helpers.php
    ├── .htaccess
    └── routes/
        ├── auth.php
        ├── site.php
        ├── users.php
        ├── upload.php
        └── logs.php
```

### 1.3 Konfiguracja API

Edytuj `config.local.php` na serwerze:

```php
<?php
define('DB_HOST', 'localhost');  // lub adres z panelu jchost
define('DB_NAME', 'twoja_baza');
define('DB_USER', 'twoj_user');
define('DB_PASSWORD', 'twoje_haslo');

define('JWT_SECRET', 'zmien-na-losowy-ciag-znakow-min-32-znaki');

// Domeny które mogą łączyć się z API
define('ALLOWED_ORIGINS', [
    'https://your-username.github.io',
    'http://localhost:3000'
]);
```

### 1.4 Folder uploads

Utwórz folder `public_html/uploads/` z prawami zapisu (chmod 755 lub 775).

### 1.5 Test API

Otwórz: `https://your-domain.com/api/site`

Powinieneś zobaczyć JSON z danymi strony.

---

## Część 2: GitHub Pages (Frontend)

### 2.1 Przygotowanie repozytorium

1. Utwórz nowe repo na GitHub (np. `portfolio`)
2. Sklonuj lokalnie

### 2.2 Budowanie React z produkcyjnym API URL

```powershell
cd "e:\portfolio Klaudia\portfolio-php"

# Ustaw produkcyjny URL API
$env:REACT_APP_API_URL = "https://your-domain.com/api"

# Zbuduj
npm run build
```

Lub utwórz plik `.env.production`:
```
REACT_APP_API_URL=https://your-domain.com/api
```

I zbuduj:
```powershell
npm run build
```

### 2.3 Przygotowanie do GitHub Pages

1. Skopiuj zawartość folderu `build/` do repozytorium
2. Utwórz plik `404.html` (kopia `index.html`) dla React Router:
   ```powershell
   Copy-Item build/index.html build/404.html
   ```

### 2.4 GitHub Actions (automatyczne wdrożenie)

Utwórz `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
        run: npm run build
      
      - name: Copy 404.html
        run: cp build/index.html build/404.html
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: build
      
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

### 2.5 Konfiguracja GitHub

1. Idź do Settings → Pages
2. Source: GitHub Actions
3. Dodaj secret `API_URL` w Settings → Secrets → Actions:
   - Name: `API_URL`
   - Value: `https://your-domain.com/api`

### 2.6 Push i deploy

```powershell
git add .
git commit -m "Initial deployment"
git push origin main
```

GitHub Actions automatycznie zbuduje i wdroży.

---

## Część 3: Konfiguracja CORS

Upewnij się że API akceptuje żądania z GitHub Pages.

W `config.local.php` na serwerze:

```php
define('ALLOWED_ORIGINS', [
    'https://your-username.github.io',
    'http://localhost:3000',  // dla lokalnego developmentu
]);
```

---

## Rozwiązywanie problemów

### CORS Error
- Sprawdź `ALLOWED_ORIGINS` w config.local.php
- Sprawdź czy domena jest dokładnie taka sama (z/bez www)

### 404 na podstronach
- Upewnij się że `404.html` istnieje i jest kopią `index.html`
- Sprawdź czy `homepage` w package.json jest ustawione na `.`

### API nie odpowiada
- Sprawdź logi PHP na serwerze
- Sprawdź czy baza danych jest poprawnie skonfigurowana
- Test: `curl https://your-domain.com/api/site`

### Błąd logowania
- Sprawdź czy użytkownik admin istnieje w bazie
- Zresetuj hasło przez phpMyAdmin (bcrypt hash)

---

## Checklist wdrożenia

- [ ] Baza danych utworzona i schema zaimportowana
- [ ] API pliki uploadowane na serwer
- [ ] config.local.php skonfigurowany z danymi bazy
- [ ] JWT_SECRET zmieniony na unikalny
- [ ] ALLOWED_ORIGINS zawiera domenę GitHub Pages
- [ ] Folder uploads utworzony z prawami zapisu
- [ ] API działa: GET /api/site zwraca JSON
- [ ] GitHub repo utworzone
- [ ] .env.production z API_URL
- [ ] GitHub Actions workflow dodany
- [ ] Secret API_URL dodany w GitHub
- [ ] GitHub Pages włączone
- [ ] 404.html skopiowany
- [ ] Strona działa na GitHub Pages
- [ ] Admin panel działa i można się zalogować
