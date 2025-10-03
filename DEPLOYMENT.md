# Deployment Guide

This guide covers deploying the Business Portal Scaffold to production on the internet.

## Table of Contents

- [Deployment Options](#deployment-options)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Full-Stack Deployment](#full-stack-deployment)
- [Environment Configuration](#environment-configuration)
- [Domain and SSL](#domain-and-ssl)
- [Cost Estimates](#cost-estimates)

---

## Deployment Options

### Option 1: Frontend-Only (Fastest)

**Best for:** Testing, demos, prototypes, static portfolios

**Platforms:** Vercel, Netlify, GitHub Pages, Cloudflare Pages

**Features:**
- Free tier available
- Automatic builds from Git
- Built-in SSL/CDN
- Uses mock data (FallbackEntityService)

**Time to deploy:** 5-10 minutes

---

### Option 2: Full-Stack (Production)

**Best for:** Production applications with database

**Platforms:** Azure, AWS, Railway, Render

**Features:**
- Frontend + Backend + Database
- Custom domain support
- Scaling capabilities
- Environment variables

**Time to deploy:** 30-60 minutes

---

## Frontend Deployment

### Option A: Vercel (Recommended for Frontend-Only)

**Why Vercel:**
- Free tier: 100GB bandwidth/month
- Automatic deployments from GitHub
- Built-in SSL/CDN
- Preview deployments for PRs

**Steps:**

1. **Prepare the build:**

```bash
# Test production build locally
npm run build
npm run preview  # Test the build at localhost:4173
```

2. **Create Vercel account:**
- Sign up at https://vercel.com
- Connect GitHub account

3. **Import project:**
- Click "New Project"
- Import your GitHub repository
- Vercel auto-detects Vite configuration

4. **Configure build settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

5. **Deploy:**
- Click "Deploy"
- Vercel builds and deploys automatically
- Get URL: `https://your-app-name.vercel.app`

6. **Environment variables (if needed):**
- Settings → Environment Variables
- Add `VITE_API_BASE_URL` if connecting to backend

**Custom domain:**
- Settings → Domains
- Add custom domain
- Update DNS records as instructed
- SSL automatically provisioned

**Cost:** Free tier sufficient for most use cases

---

### Option B: Netlify

**Steps:**

1. **Build locally:**

```bash
npm run build
```

2. **Create Netlify account:**
- Sign up at https://netlify.com
- Connect GitHub

3. **New site from Git:**
- Choose repository
- Build command: `npm run build`
- Publish directory: `dist`

4. **Deploy:**
- Netlify builds and deploys
- Get URL: `https://your-app-name.netlify.app`

**Custom domain:**
- Site settings → Domain management
- Add custom domain
- Update DNS

**Cost:** Free tier available

---

### Option C: GitHub Pages

**Best for:** Public projects only

**Steps:**

1. **Install gh-pages:**

```bash
npm install --save-dev gh-pages
```

2. **Update package.json:**

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update vite.config.ts:**

```typescript
export default defineConfig({
  base: '/YOUR_REPO_NAME/',
  plugins: [react()],
})
```

4. **Deploy:**

```bash
npm run deploy
```

5. **Enable GitHub Pages:**
- Repository → Settings → Pages
- Source: Deploy from branch `gh-pages`

**URL:** `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

**Cost:** Free

---

## Backend Deployment

### Option A: Azure App Service (Recommended)

**Why Azure:**
- Native .NET support
- Easy integration with frontend
- SQL Database options
- Free tier available

**Steps:**

1. **Prerequisites:**

```bash
# Install Azure CLI
# Windows: Download from https://aka.ms/installazurecliwindows
# Verify installation
az --version

# Login to Azure
az login
```

2. **Create Azure resources:**

```bash
# Create resource group
az group create --name portal-rg --location eastus

# Create App Service plan (Free tier)
az appservice plan create --name portal-plan --resource-group portal-rg --sku F1 --is-linux

# Create Web App
az webapp create --name your-portal-api --resource-group portal-rg --plan portal-plan --runtime "DOTNETCORE|8.0"
```

3. **Configure database:**

**Option 1: Keep SQLite (simplest):**
```bash
# SQLite file persists in /home directory
# No additional setup needed
```

**Option 2: Azure SQL Database:**
```bash
# Create SQL server
az sql server create --name your-portal-sql --resource-group portal-rg --location eastus --admin-user sqladmin --admin-password YourPassword123!

# Create database
az sql db create --resource-group portal-rg --server your-portal-sql --name portaldb --service-objective S0

# Update connection string in appsettings.json
```

4. **Deploy backend:**

```bash
cd PortalAPI

# Publish
dotnet publish -c Release

# Deploy to Azure
az webapp deployment source config-zip --resource-group portal-rg --name your-portal-api --src bin/Release/net8.0/publish.zip
```

5. **Configure environment variables:**

```bash
# Set connection strings
az webapp config connection-string set --resource-group portal-rg --name your-portal-api --connection-string-type SQLAzure --settings DefaultConnection="Server=tcp:your-portal-sql.database.windows.net,1433;Database=portaldb;User ID=sqladmin;Password=YourPassword123!;Encrypt=True;"

# Set app settings
az webapp config appsettings set --resource-group portal-rg --name your-portal-api --settings ASPNETCORE_ENVIRONMENT=Production
```

**URL:** `https://your-portal-api.azurewebsites.net`

**Cost:**
- Free tier (F1): $0/month (limited resources)
- Basic (B1): ~$13/month (recommended)
- SQL Database (S0): ~$15/month

---

### Option B: Railway

**Why Railway:**
- Simple deployment
- Free tier available
- Automatic HTTPS
- Database included

**Steps:**

1. **Create Railway account:**
- Sign up at https://railway.app
- Connect GitHub

2. **Create new project:**
- New Project → Deploy from GitHub repo
- Select your repository

3. **Configure service:**
- Add service → .NET
- Root Directory: `PortalAPI`
- Build Command: `dotnet build`
- Start Command: `dotnet run`

4. **Add database:**
- Add service → PostgreSQL
- Copy connection string

5. **Update PortalAPI/appsettings.json:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "${DATABASE_URL}"
  }
}
```

6. **Environment variables:**
- Add `ASPNETCORE_ENVIRONMENT=Production`

**URL:** Auto-generated Railway URL

**Cost:**
- Free tier: $5 credit/month
- Paid: $5/month minimum

---

### Option C: Render

**Steps:**

1. **Create Render account:**
- Sign up at https://render.com

2. **New Web Service:**
- Connect repository
- Environment: .NET
- Build Command: `dotnet publish -c Release -o out`
- Start Command: `dotnet out/PortalAPI.dll`

3. **Add database:**
- Create PostgreSQL database
- Copy connection string

**URL:** `https://your-app-name.onrender.com`

**Cost:**
- Free tier available (slow cold starts)
- Paid: $7/month

---

## Full-Stack Deployment

### Recommended Architecture

```
Frontend (Vercel)          Backend (Azure/Railway)      Database
   ↓                              ↓                        ↓
https://portal.com  →  https://api.portal.com  →  SQLite/PostgreSQL/Azure SQL
```

### Steps:

1. **Deploy backend first** (choose one option above)
2. **Get backend URL** (e.g., `https://your-portal-api.azurewebsites.net`)
3. **Update frontend environment variables**
4. **Deploy frontend**

---

## Environment Configuration

### Frontend Environment Variables

Create `.env.production`:

```env
# Backend API URL
VITE_API_BASE_URL=https://your-portal-api.azurewebsites.net

# API timeout (milliseconds)
VITE_API_TIMEOUT=30000
```

### Backend Environment Variables

**Azure App Service:**

```bash
az webapp config appsettings set --resource-group portal-rg --name your-portal-api --settings \
  ASPNETCORE_ENVIRONMENT=Production \
  ConnectionStrings__DefaultConnection="Your connection string"
```

**Railway/Render:**

Add via web UI:
- `ASPNETCORE_ENVIRONMENT=Production`
- `ConnectionStrings__DefaultConnection=${DATABASE_URL}`

### CORS Configuration

**Update PortalAPI/Program.cs:**

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("https://your-app-name.vercel.app", "https://portal.com")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

app.UseCors("AllowFrontend");
```

---

## Domain and SSL

### Custom Domain Setup

**Frontend (Vercel):**

1. **Add domain in Vercel:**
   - Project settings → Domains
   - Add `portal.com`

2. **Update DNS records:**
   - Type: A
   - Name: @
   - Value: 76.76.21.21 (Vercel IP)

   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

3. **SSL:** Automatic via Let's Encrypt

**Backend (Azure):**

1. **Add custom domain:**
```bash
az webapp config hostname add --resource-group portal-rg --webapp-name your-portal-api --hostname api.portal.com
```

2. **Add SSL certificate:**
```bash
az webapp config ssl bind --resource-group portal-rg --name your-portal-api --certificate-thumbprint YOUR_THUMBPRINT --ssl-type SNI
```

3. **Or use managed certificate:**
   - Portal → App Service → Custom domains → Add binding
   - Select "App Service Managed Certificate"

---

## Cost Estimates

### Minimal Setup (Frontend-Only)

- **Vercel Free Tier:** $0/month
- **Domain:** $12/year
- **Total:** ~$1/month

### Production Full-Stack

**Option 1: Budget (Railway + Vercel)**
- Frontend (Vercel): $0
- Backend (Railway): $5/month
- Database (Railway PostgreSQL): Included
- Domain: $12/year
- **Total:** ~$6/month

**Option 2: Recommended (Azure + Vercel)**
- Frontend (Vercel): $0
- Backend (Azure App Service B1): $13/month
- Database (Azure SQL S0): $15/month
- Domain: $12/year
- **Total:** ~$29/month

**Option 3: Enterprise (Azure)**
- Frontend (Azure Static Web Apps): $9/month
- Backend (Azure App Service P1v2): $73/month
- Database (Azure SQL S1): $30/month
- **Total:** ~$112/month

---

## Deployment Checklist

### Pre-Deployment

- [ ] Run `npm run build` successfully
- [ ] Run `npm test` - all 56 tests passing
- [ ] Run `dotnet build` successfully (if deploying backend)
- [ ] Run `dotnet test` - all 6 tests passing (if deploying backend)
- [ ] Update `VITE_API_BASE_URL` for production
- [ ] Configure CORS for production domains
- [ ] Set `ASPNETCORE_ENVIRONMENT=Production`
- [ ] Review security settings (HTTPS only)

### Frontend Deployment

- [ ] Choose platform (Vercel/Netlify/GitHub Pages)
- [ ] Create account and connect GitHub
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy and verify URL
- [ ] Add custom domain (optional)
- [ ] Verify SSL certificate

### Backend Deployment (Optional)

- [ ] Choose platform (Azure/Railway/Render)
- [ ] Create database
- [ ] Update connection strings
- [ ] Deploy backend code
- [ ] Run migrations
- [ ] Test API endpoints
- [ ] Configure CORS
- [ ] Add custom domain (optional)

### Post-Deployment

- [ ] Verify frontend loads correctly
- [ ] Test API connectivity (if backend deployed)
- [ ] Verify FallbackEntityService behavior
- [ ] Test all CRUD operations
- [ ] Check browser console for errors
- [ ] Verify SSL/HTTPS
- [ ] Test on mobile devices
- [ ] Set up monitoring/analytics (optional)

---

## Troubleshooting

### Frontend Issues

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

**Environment variables not working:**
- Ensure variables start with `VITE_`
- Rebuild after changing .env files
- Check deployment platform's environment variable settings

**Routing issues (404 on refresh):**
- Add `vercel.json` for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend Issues

**Database connection fails:**
- Verify connection string format
- Check firewall rules (Azure SQL)
- Ensure database exists

**CORS errors:**
- Verify CORS policy includes frontend URL
- Check `AllowAnyOrigin()` for testing
- Ensure `UseCors()` is before `UseAuthorization()`

**Cold start delays (free tiers):**
- Expected on Railway/Render free tiers
- Upgrade to paid tier for instant response
- Frontend FallbackEntityService handles timeouts gracefully

---

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files
   - Use platform-specific secret management
   - Rotate secrets regularly

2. **CORS:**
   - Specify exact origins (no wildcards in production)
   - Only allow necessary methods

3. **HTTPS:**
   - Always use HTTPS in production
   - Enable HSTS headers
   - Redirect HTTP to HTTPS

4. **Database:**
   - Use strong passwords
   - Enable firewall rules
   - Regular backups
   - Encrypt connections

5. **API:**
   - Implement rate limiting
   - Add authentication when ready
   - Validate all inputs
   - Log security events

---

## Next Steps After Deployment

1. **Monitoring:**
   - Set up error tracking (Sentry, LogRocket)
   - Configure uptime monitoring (UptimeRobot)
   - Enable analytics (Google Analytics, Plausible)

2. **Performance:**
   - Configure CDN
   - Enable compression
   - Optimize images
   - Review Core Web Vitals

3. **SEO:**
   - Add meta tags
   - Create sitemap.xml
   - Configure robots.txt
   - Submit to search engines

4. **Maintenance:**
   - Schedule regular backups
   - Monitor costs
   - Review logs
   - Update dependencies

---

**Ready to deploy!** Start with frontend-only deployment to Vercel for quickest results, then add backend when needed.
