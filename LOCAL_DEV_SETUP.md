# Local Development Setup Guide

This guide walks you through running CodeNexus locally on your machine.

## Prerequisites

- Java 17+ (`java -version`)
- Node.js 18+ (`node -v`)
- Docker & Docker Compose (`docker -v`, `docker-compose -v`)
- Maven (included with backend via `mvnw`)
- Git

## Quick Start (5 minutes)

### 1. Start Database (Postgres with pgvector)

```bash
cd /path/to/CodeNexus
docker compose up -d postgres
```

Verify it's running:
```bash
docker compose ps
# Should show: codenexus-postgres  HEALTHY
```

### 2. Run Backend (Spring Boot)

```bash
cd backend

# Option A: Using Maven directly (slow first time)
./mvnw spring-boot:run

# Option B: Build and run JAR (faster)
./mvnw clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Wait for output like:
```
Started BackendApplication in X seconds
```

Backend runs on: **http://localhost:8080**

### 3. Run Frontend (Next.js)

In a **new terminal**:

```bash
cd client

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

Frontend runs on: **http://localhost:3000**

### 4. Test Everything

Open in browser:
- Frontend: http://localhost:3000
- Backend health: http://localhost:8080/api/auth/session

## File Structure for Local Dev

```
CodeNexus/
├── docker-compose.yml          # ← Run this for Postgres
├── backend/
│   ├── .env.local              # ← Local env vars (not in git)
│   ├── mvnw / mvnw.cmd         # ← Maven wrapper
│   ├── pom.xml
│   └── src/
├── client/
│   ├── package.json
│   ├── next.config.ts
│   └── src/
└── docker/
    └── postgres/
        └── init-extensions.sql  # ← Initializes pgvector
```

## Local Environment Variables

Backend uses `backend/.env.local` which is **NOT** committed to git.

**Current values (in .env.local):**
```bash
DB_URL=jdbc:postgresql://localhost:5433/codenexus
DB_USERNAME=postgres
DB_PASSWORD=postgres
OPENAI_API_KEY=sk-proj-test-key-replace-with-real
FRONTEND_URL=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**To use real OpenAI:**
1. Get key from https://platform.openai.com/api-keys
2. Update `backend/.env.local`:
   ```bash
   OPENAI_API_KEY=sk-proj-your-real-key
   ```
3. Restart backend

**To test GitHub OAuth locally:**
1. Create GitHub OAuth app at https://github.com/settings/developers
2. Set callback URL: `http://localhost:8080/login/oauth2/code/github`
3. Update `backend/.env.local`:
   ```bash
   GITHUB_CLIENT_ID=your-id
   GITHUB_CLIENT_SECRET=your-secret
   ```
4. Restart backend
5. Click login in frontend → should redirect to GitHub

## Stopping Services

```bash
# Stop all
docker compose down

# Or just the database (keeps data)
docker compose stop postgres

# Remove database (clean state)
docker compose down -v
```

## Troubleshooting

### "Cannot connect to Postgres"
```bash
# Check if container is running
docker compose ps

# Start it
docker compose up -d postgres

# Check logs
docker compose logs postgres
```

### "Port 5433 already in use"
```bash
# Find what's using it
lsof -i :5433

# Or change docker-compose.yml port (left side only):
# Change: - "5433:5432" to - "5434:5432"
# Then update DB_URL in .env.local
```

### "Cannot find module '@streamdown/code'"
```bash
cd client
npm install @streamdown/code streamdown
```

### Backend won't start
```bash
# Check logs
tail -f backend/spring.log

# Or run with debug output
./mvnw spring-boot:run -X
```

### Frontend won't load
```bash
# Check frontend build
cd client
npm run build

# If it fails, clear cache
rm -rf .next node_modules
npm install
npm run dev
```

### "CORS error" in browser console
- Verify `CORS_ALLOWED_ORIGINS=http://localhost:3000` in `backend/.env.local`
- Restart backend: `Ctrl+C` then re-run

### Database has stale data
```bash
# Wipe database and start fresh
docker compose down -v
docker compose up -d postgres
# Backend will auto-create tables on startup
```

## Database Access

### Via pgAdmin (optional)
```bash
# Add to docker-compose.yml:
  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"

# Then access: http://localhost:5050
# Login: admin@example.com / admin
# Add server: hostname=postgres, port=5432, user=postgres, pwd=postgres
```

### Via psql CLI
```bash
# Connect to database
docker compose exec postgres psql -U postgres -d codenexus

# Useful commands:
\dt                    # List all tables
\d users               # Show table schema
SELECT * FROM users;   # Query data
\q                     # Exit
```

## Development Workflow

### Making Backend Changes
1. Edit Java files in `backend/src/main/java/`
2. Restart backend:
   - If running via `mvn spring-boot:run`: `Ctrl+C` + re-run
   - Changes auto-compile in ~2-5 seconds

### Making Frontend Changes
1. Edit files in `client/app/` or `client/components/`
2. Next.js auto-reloads browser (Fast Refresh)
3. Changes appear in ~1 second

### Database Schema Changes
1. Backend uses Hibernate DDL (`spring.jpa.hibernate.ddl-auto=update`)
2. Create/update entity classes in `backend/src/main/java/`
3. Restart backend — tables auto-migrate
4. Verify with: `docker compose exec postgres psql -U postgres -d codenexus -c "\dt"`

## Performance Tips

### Faster Maven builds
```bash
# Skip tests for faster dev builds
./mvnw package -DskipTests

# Use daemon (keeps JVM running)
./mvnw -T 1C spring-boot:run
```

### Faster Node rebuilds
```bash
# Frontend uses SWC (built-in Next.js, very fast)
# Already optimized — just `npm run dev`
```

### Reduce Docker resource usage
```bash
# If running slow, increase Docker memory:
# Docker Desktop → Preferences → Resources → Memory: 4GB+
```

## IDE Setup

### VS Code (Recommended)

**Backend (Java)**
- Install Extension Pack for Java
- Open `backend/` folder
- Maven should auto-detect `pom.xml`

**Frontend (TypeScript)**
- Install ES7+ React/Redux/React-Native snippets
- Open `client/` folder
- ESLint auto-detects `eslint.config.mjs`

### IntelliJ IDEA

**Backend**
- File → Open → select `backend/pom.xml`
- IDEA auto-loads Maven
- Right-click `pom.xml` → Run → Spring Boot

**Frontend**
- File → Open → select `client/`
- IDEA detects Next.js
- Terminal → Run `npm run dev`

## Next: Deploy to Production

Once local development is solid, follow [DEPLOYMENT.md](../DEPLOYMENT.md) for Vercel + Render + Neon setup.

---

**Quick Command Reference:**
```bash
# Start everything
docker compose up -d postgres
cd backend && ./mvnw spring-boot:run &
cd client && npm run dev

# Stop everything
docker compose down
pkill -f mvnw
pkill -f "next dev"

# Fresh start
docker compose down -v
rm -rf client/.next client/node_modules backend/target
docker compose up -d postgres
cd backend && ./mvnw clean package -DskipTests
java -jar backend/target/backend-0.0.1-SNAPSHOT.jar &
cd client && npm install && npm run dev
```
