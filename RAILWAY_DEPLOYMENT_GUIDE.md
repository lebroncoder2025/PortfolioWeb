# Railway Deployment Guide

To deploy your portfolio with a fully dynamic API on Railway, follow these steps:

## Architecture Overview

- **Frontend**: Deployed to GitHub Pages (built React from `main` branch)
- **Backend**: Deployed to Railway (PHP API from `api/` folder)
- **Database**: Remote MySQL (your existing jchost database)

The frontend will call the Railway API for all dynamic content (login, portfolio items, uploads, etc.).

---

## Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub (or email)
3. Create a new **Project**
4. Select **Deploy from GitHub**
5. Connect your **PortfolioWeb** repository

---

## Step 2: Configure Railway Build Settings

1. In your Railway project, go to **Settings**
2. Under **Build Settings**, select:
   - **Dockerfile**: Set path to `api/Dockerfile`
   - **Build Context**: Set to `api/` (if Railway allows; otherwise leave as root and the path will be `api/Dockerfile`)
3. Leave other settings as default

---

## Step 3: Set Environment Variables in Railway

In Railway project **Variables** tab, add:

```
DB_HOST=s8.jchost08.pl
DB_PORT=3306
DB_NAME=pawelskie_portfolio
DB_USER=pawelskie_portfolio
DB_PASSWORD=2kEpSAtXXs6KKU4c5efT
JWT_SECRET=your-super-secret-key-here-at-least-32-chars
CORS_ORIGINS=https://lebroncoder2025.github.io/PortfolioWeb
```

> ⚠️ Replace `your-super-secret-key-here-at-least-32-chars` with a strong random string.
> 
> To generate a safe JWT_SECRET:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## Step 4: Deploy to Railway

1. Once you set the env vars, Railway will automatically detect the Dockerfile and start building
2. Watch the build logs in **Deployments** tab
3. After successful build, Railway will show you a public URL like:
   ```
   https://your-app.up.railway.app
   ```
4. Copy this URL — you'll need it for the frontend configuration

---

## Step 5: Update GitHub Secrets for Frontend Build

1. Go to your GitHub repo **Settings → Secrets and variables → Actions**
2. Add a new **Repository Secret**:
   - Name: `RAILWAY_API_URL`
   - Value: `https://your-app.up.railway.app` (from Step 4)

3. Optionally, update `BACKEND_URL` secret to the same value if you prefer

---

## Step 6: Rebuild Frontend to Use Railway API

1. In your repository, the GitHub Actions workflow `deploy-to-docs.yml` will now use:
   - `REACT_APP_API_URL=${{ secrets.RAILWAY_API_URL }}` (or `BACKEND_URL`)
   - This tells React to fetch from your Railway API instead of a local `/api` endpoint

2. **Trigger a rebuild** by:
   - Pushing a commit to `main`, or
   - Going to **Actions** tab → click `Build and Deploy to docs/` → **Run workflow** → **Run workflow**

3. The build will now create a frontend that talks to your Railway backend

---

## Step 7: Verify Everything Works

Once the GitHub Actions workflow completes:

1. Visit `https://lebroncoder2025.github.io/PortfolioWeb/` in your browser
2. You should see your portfolio with all content loaded from Railway
3. Try logging in to the admin panel (email: `admin@example.com`, password set via your config or via a reset endpoint)
4. Test uploading an image or creating a portfolio item — files should upload to Railway (ephemeral) or to an external storage if configured

---

## Troubleshooting

### Frontend loads but no content appears

- Open **Browser DevTools** (F12) → **Console** tab
- Check for CORS errors or failed API calls
- Verify `REACT_APP_API_URL` in the build output (GitHub Actions logs)
- Ensure Railway env vars are set correctly and the API is running (check Railway Deployments)

### Railway build fails

- Check Railway build logs in **Deployments** → click the failed build
- Ensure `api/Dockerfile` is correct and references correct paths
- Verify `api/config.php` loads environment variables (it does by default)

### API returns 404

- The router in `api/index.php` should handle all routes
- Check that Railway's Apache rewrite rules are enabled (they are in the Dockerfile with `a2enmod rewrite`)

### Uploads don't persist

- Railway has ephemeral storage; files written to disk are lost on restart
- For persistent uploads, either:
  - Mount external storage (S3, Backblaze, etc.), or
  - Deploy `api/` to your jchost shared hosting via FTP (see `DEPLOY.md`)

---

## Optional: Add FTP Deploy for Persistent Uploads

If you want uploads to persist and Railway is just for testing, you can deploy `api/` to jchost while keeping the frontend on GitHub Pages:

1. See `DEPLOY.md` for jchost FTP deployment instructions
2. Point the frontend API URL to your jchost API instead of Railway
3. Set `BACKEND_URL` secret to `https://your-domain.com/api`

---

## Next Steps

- Once Railway is live, you can remove the GitHub Actions step that generates `site.json` (no longer needed with a live API)
- Consider adding database backups and monitoring
- If using uploads, plan for persistent storage strategy (S3, jchost FTP, or other)

Happy deploying! 🚀
