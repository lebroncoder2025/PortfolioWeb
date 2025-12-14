# Portfolio React + PHP

Portfolio website z React frontend i PHP API backend.

## Architektura

- **Frontend**: React 18 + TailwindCSS (budowany jako static site)
- **Backend**: PHP 7.4+ z MySQL (REST API)
- **Baza danych**: MySQL/MariaDB

## Struktura projektu

```
portfolio-php/
├── src/                    # React source files
├── public/                 # Static assets
├── api/                    # PHP API backend
│   ├── index.php          # Main router
│   ├── config.php         # Configuration
│   ├── config.local.php   # Local config override
│   ├── Database.php       # Database class
│   ├── JWT.php            # JWT authentication
│   ├── helpers.php        # Utility functions
│   └── routes/            # API endpoints
├── database/
│   └── schema.sql         # Database schema
├── docs/                   # Documentation
├── package.json           # Node.js dependencies
└── setup-xampp.ps1        # Local setup script
```

## Szybki start (XAMPP)

1. Uruchom Apache i MySQL w XAMPP
2. Utwórz bazę `portfolio` i zaimportuj `database/schema.sql`
3. Zainstaluj zależności: `npm install`
4. Uruchom setup: `.\setup-xampp.ps1`
5. Otwórz: http://localhost/portfolio-php

## Wdrożenie produkcyjne

Zobacz dokumentację:
- [Lokalna konfiguracja XAMPP](docs/LOCAL_SETUP_XAMPP.md)
- [Wdrożenie jchost + GitHub Pages](docs/DEPLOYMENT_JCHOST_GITHUB.md)

## API Endpoints

### Publiczne
- `GET /api/site` - Pobierz wszystkie dane strony

### Wymagające autoryzacji
- `POST /api/login` - Logowanie
- `POST /api/site/hero` - Aktualizuj sekcję Hero
- `POST /api/site/about` - Aktualizuj sekcję O mnie
- `POST /api/site/contact` - Aktualizuj dane kontaktowe
- `POST /api/site/social` - Aktualizuj linki social media
- `POST/PUT/DELETE /api/site/services/:id` - CRUD usług
- `POST/PUT/DELETE /api/site/portfolio/:id` - CRUD portfolio
- `POST /api/upload` - Upload plików
- `GET/POST/PUT/DELETE /api/users` - Zarządzanie użytkownikami (admin)
- `GET /api/logs` - Logi aktywności (admin)

## Domyślne dane logowania

- Email: `admin@example.com`
- Hasło: `[ZMIENIONE - sprawdź w config.php lub bazie danych]`

**⚠️ Zmień hasło po pierwszym logowaniu!**

## Licencja

Prywatne portfolio - wszelkie prawa zastrzeżone.
