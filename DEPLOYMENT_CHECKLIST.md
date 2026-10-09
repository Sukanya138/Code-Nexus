# Quick Deployment Checklist

## Frontend (Vercel)
- [ ] Push code to GitHub
- [ ] Connect repo to Vercel
- [ ] Set Root Directory: `client`
- [ ] Set NEXT_PUBLIC_API_BASE_URL env var
- [ ] Deploy

## Backend (Render)
- [ ] Create Neon database and get connection string
- [ ] Push code to GitHub (includes Dockerfile)
- [ ] Create Web Service on Render with Docker runtime
- [ ] Set all environment variables from .env.example
- [ ] Deploy

## Database (Neon)
- [ ] Create project
- [ ] Get connection string
- [ ] Enable pgvector extension via SQL
- [ ] Note: Neon auto-creates tables via Hibernate DDL

## GitHub OAuth
- [ ] Create OAuth app at github.com/settings/developers
- [ ] Set callback to: `https://your-render-backend/login/oauth2/code/github`
- [ ] Update GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Render env

## Final Verification
- [ ] Frontend loads at Vercel URL
- [ ] Backend responds: `curl https://your-backend/api/auth/session`
- [ ] GitHub login works
- [ ] Can create chat sessions and send messages

---

## Env Variables Reference

Copy values to Render dashboard:
```
DB_URL=                           # From Neon connection string
DB_USERNAME=                      # From Neon connection string
DB_PASSWORD=                      # From Neon connection string
OPENAI_API_KEY=                   # From platform.openai.com
GITHUB_CLIENT_ID=                 # From github.com/settings/developers
GITHUB_CLIENT_SECRET=             # From github.com/settings/developers
FRONTEND_URL=                      # Your Vercel URL (https://...)
CORS_ALLOWED_ORIGINS=             # Same as FRONTEND_URL
TOKEN_ENCRYPTOR_PASSWORD=         # Generate: openssl rand -hex 32
TOKEN_ENCRYPTOR_SALT=             # Generate: openssl rand -hex 16
PORT=8080                         # Fixed for Render
```

---

## URLs After Deployment

- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com`
- Database: Connection only (Neon, not public)
