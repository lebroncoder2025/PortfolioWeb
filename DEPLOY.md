Deployment guide

Overview
- Frontend (React) -> GitHub Pages (gh-pages branch)
- Backend (PHP) -> upload to jchost (FTP/SFTP) or any PHP host

Steps
1) Repo
- Ensure `.gitignore` excludes `api/config.local.php` and `api/uploads`.

2) Secrets (add these to GitHub repository Settings → Secrets):
- `BACKEND_URL` — full URL to your PHP API root, e.g. https://yourdomain/portfolio-php/api (used at build time)
- `FTP_HOST` — (optional) jchost FTP hostname if you want to automate backend deploy
- `FTP_USER` — (optional) FTP username
- `FTP_PASSWORD` — (optional) FTP password
- `FTP_PATH` — (optional) target path on FTP server (e.g. `/public_html/portfolio-php`)

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