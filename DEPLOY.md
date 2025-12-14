Deployment guide

Overview
- Frontend (React) -> GitHub Pages (gh-pages branch)
- Backend (PHP) -> upload to jchost (FTP/SFTP) or any PHP host

Steps
1) Repo
- Ensure `.gitignore` excludes `api/config.local.php` and `api/uploads`.

2) Secrets (add these to GitHub repository Settings → Secrets → Actions):
- `DB_HOST` — hostname of your MySQL server (required for static API generation)
- `DB_NAME` — database name (required)
- `DB_USER` — database user (required)
- `DB_PASSWORD` — database password (required)
- `DB_PORT` — optional, default 3306
- `BACKEND_URL` — (optional) full API root URL for runtime if you host API elsewhere (e.g. https://yourdomain/portfolio-php/api)
- `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_PATH` — optional, only if you want automated FTP deploy of PHP backend

3) Frontend (GitHub Actions)
- Push to `main` branch to trigger the workflow which builds the React app and deploys `build/` to `gh-pages` branch.
- The Action uses `BACKEND_URL` secret for `REACT_APP_API_URL`. If not supplied, frontend will fall back to defaults.

4) Backend (jchost)
- Upload folder `api/` and `uploads/` to the server (e.g. to `public_html/portfolio-php/`)
- On server, create `api/config.local.php` (not committed) with DB credentials. Example below:

```php
<?php
if (!defined('API_ALLOWED')) exit('Direct access not allowed');

define('DB_HOST', 's8.jchost08.pl');
define('DB_NAME', 'pawelskie_portfolio');
define('DB_USER', 'pawelskie_portfolio');
define('DB_PASSWORD', '2kEpSAtXXs6KKU4c5efT');
define('DB_CHARSET', 'utf8mb4');
```

5) Optional: FTP deploy via GitHub Action
- If you add `FTP_*` secrets you can create a workflow to upload `api/` and `uploads/` to jchost automatically (not included by default).

6) Testing
- Frontend (GH Pages): https://<your-gh-username>.github.io/PortfolioWeb/
- Backend: https://yourdomain/portfolio-php/api/site
- Test login on `/admin_panel` with admin credentials set locally

Notes
- Do NOT commit `api/config.local.php` — keep credentials out of git.
- If you want frontend and backend on same host (jchost), upload `build/` contents to `public_html/portfolio-php/` and `api/` next to it.