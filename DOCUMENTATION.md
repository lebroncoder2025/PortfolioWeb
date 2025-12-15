# Portfolio Klaudia - Dokumentacja Techniczna

## Przegląd Systemu

Portfolio Klaudia to aplikacja webowa składająca się z:
- **Frontend**: React (SPA) hostowany na GitHub Pages
- **Backend**: PHP API hostowane na Railway
- **Baza danych**: MySQL (Railway)

### Adresy:
- **Frontend (GitHub Pages)**: https://lebroncoder2025.github.io/PortfolioWeb/
- **API (Railway)**: https://portfolioweb-production-5696.up.railway.app

---

## Architektura

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Pages (Frontend)                       │
│  React SPA + HashRouter                                          │
│  Folder: /docs (build output)                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Railway (Backend API)                         │
│  PHP 8.x + Apache                                                │
│  Folder: /api                                                    │
│  CORS enabled dla GitHub Pages                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ MySQL Connection
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Railway MySQL                                 │
│  Wszystkie dane + media jako BLOB                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Struktura Plików

### Frontend (React)
```
src/
├── App.jsx                    # Główny komponent, routing, pobieranie danych
├── AdminPanelComponents.jsx   # Panel administracyjny (CRUD dla wszystkiego)
├── index.js                   # Entry point
├── index.css                  # Tailwind CSS
├── components/
│   ├── Header.jsx             # Nawigacja górna
│   ├── Footer.jsx             # Stopka z social media
│   ├── MediaLightbox.jsx      # Powiększanie zdjęć/video w modal
│   ├── TikTokEmbed.jsx        # Embed TikTok + miniaturki
│   ├── CookieConsent.jsx      # Banner cookies
│   └── ErrorBoundary.jsx      # Obsługa błędów React
├── pages/
│   ├── HomePage.jsx           # Strona główna (hero)
│   ├── AboutPage.jsx          # O mnie
│   ├── ServicesPage.jsx       # Usługi
│   ├── PortfolioPage.jsx      # Lista kategorii portfolio
│   ├── PortfolioCategoryPage.jsx  # Projekty w kategorii
│   ├── PortfolioItemPage.jsx  # Szczegóły projektu (galeria, video)
│   ├── ContactPage.jsx        # Kontakt
│   ├── PrivacyPolicyPage.jsx  # Polityka prywatności
│   ├── CookiesPolicyPage.jsx  # Polityka cookies
│   └── TermsPage.jsx          # Regulamin
```

### Backend (PHP API)
```
api/
├── index.php          # Entry point, routing główny
├── Database.php       # Klasa połączenia z MySQL
├── JWT.php           # Obsługa tokenów JWT
├── helpers.php       # Funkcje pomocnicze (sanitize, UUID, itp.)
├── config.php        # Konfiguracja produkcyjna (Railway env vars)
├── routes/
│   ├── site.php      # CRUD dla całej strony (hero, about, portfolio, itp.)
│   ├── auth.php      # Logowanie, weryfikacja tokenu
│   ├── users.php     # Zarządzanie użytkownikami (tylko admin)
│   ├── upload.php    # Upload plików (zdjęcia jako BLOB)
│   ├── image.php     # Serwowanie zdjęć z BLOB
│   ├── video.php     # Serwowanie video z BLOB
│   └── logs.php      # Logi aktywności użytkowników
```

---

## Baza Danych MySQL

### Tabele:
| Tabela | Opis |
|--------|------|
| `site_hero` | Sekcja hero (tytuł, podtytuł, zdjęcie) |
| `site_about` | Sekcja O mnie (bio, statystyki, zdjęcie) |
| `site_contact` | Dane kontaktowe |
| `site_social` | Linki social media |
| `services` | Lista usług |
| `categories` | Kategorie portfolio |
| `portfolio` | Projekty portfolio |
| `portfolio_images` | Zdjęcia w projektach (URL lub BLOB) |
| `portfolio_featured` | Główne media projektu (zdjęcie/video) |
| `portfolio_uploads` | Pliki uploadowane jako BLOB |
| `portfolio_videos` | Video uploadowane jako BLOB |
| `layout` | Widoczność sekcji na stronie |
| `users` | Konta administratorów |
| `logs` | Logi aktywności |

---

## API Endpoints

### Publiczne (bez autoryzacji):
| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/site` | Pobiera wszystkie dane strony |
| GET | `/image/{id}` | Serwuje zdjęcie z BLOB |
| GET | `/video/{id}` | Serwuje video z BLOB |
| POST | `/login` | Logowanie administratora |

### Chronione (wymagają JWT):
| Metoda | Endpoint | Opis |
|--------|----------|------|
| PUT | `/site/hero` | Aktualizuj sekcję hero |
| PUT | `/site/about` | Aktualizuj sekcję o mnie |
| PUT | `/site/contact` | Aktualizuj dane kontaktowe |
| PUT | `/site/social` | Aktualizuj social media |
| POST | `/site/services` | Dodaj usługę |
| PUT | `/site/services/{id}` | Edytuj usługę |
| DELETE | `/site/services/{id}` | Usuń usługę |
| POST | `/site/portfolio` | Dodaj projekt |
| PUT | `/site/portfolio/{id}` | Edytuj projekt |
| DELETE | `/site/portfolio/{id}` | Usuń projekt |
| PUT | `/site/categories` | Aktualizuj kategorie |
| PUT | `/site/layout` | Zmień widoczność sekcji |
| POST | `/upload` | Upload pliku (zdjęcie/video) |
| GET | `/users` | Lista użytkowników (tylko admin) |
| POST | `/users` | Dodaj użytkownika (tylko admin) |
| DELETE | `/users/{id}` | Usuń użytkownika (tylko admin) |
| GET | `/logs` | Logi aktywności (tylko admin) |

---

## Jak Działa Video

### Problem duplikacji video (ROZWIĄZANY):
Wcześniej video było renderowane na stronie jako `<video>` element i dodatkowo w lightbox. To powodowało, że odtwarzały się dwa video naraz.

### Rozwiązanie:
1. **Na stronie**: Video pokazywane jest TYLKO jako placeholder (ciemny prostokąt z ikoną ▶️)
2. **W lightbox**: Video odtwarzane jest normalnie z kontrolkami

### Kod w PortfolioItemPage.jsx:
```jsx
// Dla video - pokazuj tylko placeholder, NIGDY nie renderuj <video>
if (kind === 'video') {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
      <div className="text-white text-6xl">▶️</div>
      <div className="text-white text-sm opacity-70">Kliknij aby odtworzyć</div>
    </div>
  );
}
```

### MediaLightbox.jsx:
```jsx
// W lightbox video jest odtwarzane normalnie
if (kind === 'video') {
  return (
    <video src={url} controls playsInline preload="metadata" ... />
  );
}
```

---

## Typy Mediów

Funkcja `inferKind(url)` określa typ media:
- **youtube**: URL zawiera `youtube.com` lub `youtu.be`
- **tiktok**: URL zawiera `tiktok.com`
- **video**: URL zawiera `/api/video/`, `/video/` lub kończy się na `.mp4`, `.webm`, etc.
- **image**: Wszystko inne (domyślnie)

---

## Upload Plików

1. **Frontend** wysyła plik przez `FormData` na `/upload`
2. **Backend** zapisuje plik jako BLOB w `portfolio_uploads` (zdjęcia) lub `portfolio_videos` (video)
3. **Backend** zwraca URL: `/image/{id}` lub `/video/{id}`
4. **Serwowanie**: Endpoint `/image/{id}` pobiera BLOB z bazy i zwraca z odpowiednim `Content-Type`

---

## Autoryzacja JWT

1. **Logowanie**: POST `/login` z email + password
2. **Backend**: Sprawdza hasło (bcrypt), generuje JWT (ważny 24h)
3. **Frontend**: Zapisuje token w `localStorage`
4. **Każdy request**: Header `Authorization: Bearer {token}`
5. **Backend**: Weryfikuje JWT przed wykonaniem akcji

### Role użytkowników:
- `admin`: Pełny dostęp (może zarządzać innymi użytkownikami)
- `editor`: Może edytować treści, ale nie zarządzać użytkownikami

---

## Deployment

### Frontend (GitHub Pages):
1. `npm run build` - buduje aplikację do `/build`
2. Kopiuj zawartość `/build` do `/docs`
3. Push na GitHub - automatycznie deployuje na Pages

### Backend (Railway):
1. Push na GitHub (branch `main`)
2. Railway automatycznie deployuje z folderu `/api`
3. Zmienne środowiskowe ustawione w Railway Dashboard

### Zmienne środowiskowe Railway:
- `MYSQL_HOST`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
- `JWT_SECRET` - sekret do podpisywania tokenów
- `API_URL` - URL do API (używane do generowania linków do zdjęć)
- `CORS_ORIGIN` - dozwolone originy (GitHub Pages URL)

---

## Rozwiązywanie Problemów

### Video nie odtwarza się:
1. Sprawdź czy URL jest poprawny (`/api/video/{id}`)
2. Sprawdź czy video jest zapisane w `portfolio_videos` (nie `portfolio_uploads`)
3. Sprawdź console w przeglądarce

### API zwraca 401:
1. Token wygasł - zaloguj się ponownie
2. Token nieprawidłowy - wyczyść `localStorage` i zaloguj ponownie

### CORS error:
1. Sprawdź czy `CORS_ORIGIN` w Railway zawiera URL frontendu
2. Sprawdź czy frontend używa poprawnego `API_URL`

### Zmiany nie widoczne:
1. Wyczyść cache przeglądarki (Ctrl+F5)
2. Sprawdź czy build został zaktualizowany (`npm run build`)
3. Sprawdź czy Railway przebudował API

---

## Komendy

### Development:
```bash
cd portfolio-php
npm install        # Instalacja zależności
npm start          # Uruchom dev server (localhost:3000)
npm run build      # Zbuduj produkcyjną wersję
```

### Deployment:
```bash
# Po zmianach w kodzie:
npm run build                  # Zbuduj frontend
# Skopiuj build/* do docs/
git add .
git commit -m "Update"
git push origin main           # Deploy na Railway + GitHub Pages
```

---

## Kontakt

Projekt stworzony dla portfolio Klaudii.
Wszelkie pytania techniczne kierować do developera.
