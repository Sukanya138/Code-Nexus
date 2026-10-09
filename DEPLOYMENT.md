# CodeNexus Deployment Guide: Vercel + Render + Neon

This guide walks you through deploying CodeNexus across three cloud platforms:
- **Frontend**: Vercel (Next.js native)
- **Backend**: Render (Docker-based)
- **Database**: Neon (Managed PostgreSQL with pgvector)

---

## Prerequisites

- GitHub account (for OAuth and git deployment)
- Vercel account (https://vercel.com)
- Render account (https://render.com)
- Neon account (https://neon.tech)
- OpenAI API key (https://platform.openai.com/api-keys)

---

## Step 1: Set Up Neon PostgreSQL Database

1. **Create Neon Project**
   - Go to https://console.neon.tech and sign up
   - Click "Create Project" → name it "codenexus"
   - Select "PostgreSQL" with latest version
   - Choose your region (closest to backend is best)
   - Click "Create Project"

2. **Get Connection String**
   - In Neon console, click your project
   - Go to "Connection string" tab
   - Copy the "Connection string" (looks like: `postgresql://user:password@host/codenexus`)
   - Keep this private — you'll need it in Step 3

3. **Enable pgvector Extension**
   - In Neon console, click "SQL Editor"
   - Run this command:
     ```sql
     CREATE EXTENSION IF NOT EXISTS vector;
     ```
   - Close SQL editor

---

## Step 2: Deploy Backend to Render

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Web Service**
   - Go to https://render.com and sign up
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select "codenexus" repository
   - Configure:
     - **Name**: `codenexus-backend`
     - **Runtime**: Docker
     - **Branch**: main
     - **Build Command**: (leave blank - Dockerfile handles it)
     - **Start Command**: (leave blank - Dockerfile handles it)
     - **Plan**: Starter (or Standard for production)
     - **Region**: Pick the same region as your Neon database

3. **Add Environment Variables**
   In Render dashboard, go to your service → Environment:
   
   ```
   DB_URL=postgresql://user:password@host/codenexus
   DB_USERNAME=user
   DB_PASSWORD=password
   OPENAI_API_KEY=sk-proj-your-key-here
   GITHUB_CLIENT_ID=your-github-app-id
   GITHUB_CLIENT_SECRET=your-github-app-secret
   FRONTEND_URL=https://your-app.vercel.app
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
   TOKEN_ENCRYPTOR_PASSWORD=<generate-random: openssl rand -hex 32>
   TOKEN_ENCRYPTOR_SALT=<generate-random: openssl rand -hex 16>
   PORT=8080
   ```

   **To get actual values:**
   - `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`: From Neon connection string (Step 1)
   - `OPENAI_API_KEY`: From https://platform.openai.com/api-keys
   - `GITHUB_CLIENT_ID/SECRET`: See "Step 4" below
   - `FRONTEND_URL`: You'll get this from Vercel (Step 3)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (5-10 minutes)
   - Once live, note your Render URL: `https://codenexus-backend.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

1. **Connect GitHub to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your CodeNexus repo
   - Select "Next.js" as framework

2. **Configure**
   - **Root Directory**: `client` (since frontend is in client/)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Set Environment Variable**
   - Click "Environment Variables"
   - Add:
     ```
     Name: NEXT_PUBLIC_API_BASE_URL
     Value: https://codenexus-backend.onrender.com
     ```
   - Click "Add"

4. **Deploy**
   - Click "Deploy"
   - Wait for build (2-3 minutes)
   - Once live, note your Vercel URL: `https://your-app.vercel.app`

---

## Step 4: Configure GitHub OAuth

1. **Create GitHub OAuth Application**
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Fill in:
     - **Application name**: CodeNexus
     - **Homepage URL**: `https://your-app.vercel.app`
     - **Authorization callback URL**: `https://codenexus-backend.onrender.com/login/oauth2/code/github`
   - Click "Register application"
   - You'll see `Client ID` and can generate `Client Secret`

2. **Update Render Environment**
   - Go back to Render dashboard
   - Update service environment variables:
     ```
     GITHUB_CLIENT_ID=<from step 1>
     GITHUB_CLIENT_SECRET=<from step 1>
     FRONTEND_URL=<your Vercel URL>
     CORS_ALLOWED_ORIGINS=<your Vercel URL>
     ```
   - Click "Save"
   - Service will redeploy automatically

3. **Update Frontend Environment in Vercel**
   - Go to Vercel project settings
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_BASE_URL=https://codenexus-backend.onrender.com
     ```
   - Redeploy: `git push origin main` or click "Redeploy"

---

## Step 5: Verify Deployment

Test each component:

```bash
# Test frontend (should return HTML)
curl -I https://your-app.vercel.app

# Test backend (should return 200 or 401)
curl -I https://codenexus-backend.onrender.com/api/auth/session

# Test database connectivity via backend
curl https://codenexus-backend.onrender.com/api/repos
```

---

## Step 6: Enable Custom Domain (Optional)

### Frontend (Vercel)
1. In Vercel dashboard → Domains
2. Add your domain (e.g., app.yourdomain.com)
3. Follow DNS instructions

### Backend (Render)
1. In Render dashboard → Settings → Custom Domain
2. Add your domain (e.g., api.yourdomain.com)
3. Follow DNS instructions

---

## Monitoring & Troubleshooting

### Check Render Backend Logs
```bash
# In Render dashboard → Logs tab
# Look for Spring Boot startup messages
```

### Check Vercel Frontend Logs
```bash
# In Vercel dashboard → Deployments → click deployment → Logs
```

### Common Issues

**"Cannot find module" errors in frontend**
- Clear Vercel cache: Settings → Function → Purge Build Cache
- Redeploy

**Backend returns 500 errors**
- Check Render logs for database connection error
- Verify DB_URL env var matches Neon connection string
- Verify database extensions created (Step 1.3)

**Frontend cannot reach backend**
- Verify NEXT_PUBLIC_API_BASE_URL matches Render backend URL
- Check CORS_ALLOWED_ORIGINS in Render env vars matches Vercel URL
- Check browser console for CORS errors

**GitHub login fails**
- Verify GitHub OAuth callback URL matches Render backend URL
- Verify GITHUB_CLIENT_ID/SECRET are correct
- Check backend logs for auth errors

---

## Cost Estimates (USD/month)

- **Neon**: $0-20 (free tier has 3GB; $0.10/GB overage)
- **Render**: $7/month (Starter) → $12/month (Standard)
- **Vercel**: $0-20 (free tier; $20/month Pro for more features)
- **OpenAI**: Pay-as-you-go (~$0.01-0.10 per request depending on model)

**Total**: ~$7-50/month depending on usage

---

## Next Steps

1. **Enable monitoring**: Set up error tracking (Sentry, Datadog)
2. **Set up CI/CD**: Configure automatic redeploys on git push
3. **Backup database**: Enable Neon automated backups
4. **Scale**: Upgrade Render plan to "Standard" when approaching rate limits
5. **Custom domain**: Configure DNS for branded URLs

---

## Local Development

To test locally before deploying:

```bash
# 1. Start Postgres with pgvector
docker compose up -d postgres

# 2. Update application.properties to use localhost
# (should already use DB_URL from docker-compose defaults)

# 3. Build and run backend
cd backend
./mvnw spring-boot:run

# 4. In another terminal, run frontend
cd client
npm install
npm run dev

# 5. Open http://localhost:3000
```

---

**Questions?** Check the logs in Render and Vercel dashboards — they'll show exact error messages.
