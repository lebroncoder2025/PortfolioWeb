# Deploying the PHP API to Railway

This document explains how to deploy the `api/` PHP backend to Railway (or any Docker-enabled host). Railway can build from the `api/Dockerfile` included in this repo.

Steps

1. Connect your GitHub repository to Railway
   - On Railway, create a new Project → "Deploy from GitHub"
   - Select this repository and choose the `api/` folder (Railway supports selecting a subdirectory for Docker builds). If Railway asks for the Dockerfile path, use `api/Dockerfile`.

2. Environment variables (set these in Railway Project > Settings > Variables):
   - `DB_HOST` - host of MySQL
   - `DB_PORT` - usually `3306`
   - `DB_NAME` - database name
   - `DB_USER` - DB username
   - `DB_PASSWORD` - DB password
   - `JWT_SECRET` - secret used for auth (keep secret)
   - `CORS_ORIGINS` (optional) - allow origin(s) for the frontend, e.g. `https://your-frontend.example` or `*` for testing

3. Build & Deploy
   - Railway will build the Docker image using `api/Dockerfile`. The container listens on port 80 by default.
   - After deploy, Railway will provide a public URL like `https://your-app.up.railway.app` — copy this as your `BACKEND_URL`.

Local testing with Docker

Build image locally from repo root:

```bash
docker build -t portfolio-php:latest ./api
```

Run with env vars (example):

```bash
docker run --rm -p 8080:80 \
  -e DB_HOST=s8.jchost08.pl \
  -e DB_PORT=3306 \
  -e DB_NAME=pawelskie_portfolio \
  -e DB_USER=pawelskie_portfolio \
  -e DB_PASSWORD=YOUR_DB_PASSWORD \
  -e JWT_SECRET=some-secret \
  portfolio-php:latest
```

Notes and caveats

- Uploads and filesystem: Railway containers have ephemeral storage. Files written to disk (for example `uploads/`) may not persist across restarts. For persistent uploads use an external object storage (S3, Backblaze, or FTP to your jchost)
- CORS: ensure your PHP API allows requests from your frontend origin (GitHub Pages or other). Update `helpers.php` or the router to read `CORS_ORIGINS`.
- If you prefer persistent uploads and simple FTP deploys, consider deploying `api/` to your shared hosting (jchost) instead.

If you want, I can:
- Add a small `railway` GitHub Actions workflow to build and push a Docker image, or
- Add a CI step to update frontend `REACT_APP_API_URL` before building the frontend for GitHub Pages.
