@echo off
REM Local development startup script for Windows
REM Usage: start-local.bat

setlocal enabledelayedexpansion

echo 🚀 Starting CodeNexus Local Development...
echo.

REM Check prerequisites
echo ✓ Checking prerequisites...
where docker >nul 2>&1 || (echo ❌ Docker not found. Install Docker Desktop. && exit /b 1)
where node >nul 2>&1 || (echo ❌ Node.js not found. Install Node 18+. && exit /b 1)
where java >nul 2>&1 || (echo ❌ Java not found. Install Java 17+. && exit /b 1)

REM Start database
echo.
echo 📦 Starting PostgreSQL + pgvector...
call docker compose up -d postgres
timeout /t 5 /nobreak

REM Check database health
echo ⏳ Waiting for database to be ready...
for /l %%i in (1,1,30) do (
  docker compose exec -T postgres pg_isready -U postgres -d codenexus >nul 2>&1
  if !errorlevel! equ 0 (
    echo ✓ Database ready
    goto db_ready
  )
  timeout /t 1 /nobreak
)

:db_ready
REM Build backend
echo.
echo 🔨 Building backend (first time takes ~30 seconds)...
cd backend
if not exist "target\backend-0.0.1-SNAPSHOT.jar" (
  call mvnw clean package -DskipTests -q
)
cd ..

echo.
echo ✅ All set! Starting services...
echo.
echo 📝 In separate PowerShell/CMD terminals, run:
echo.
echo   Terminal 1 (Backend):
echo     cd backend
echo     .\mvnw spring-boot:run
echo.
echo   Terminal 2 (Frontend):
echo     cd client
echo     npm install
echo     npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo 📚 For more info, see LOCAL_DEV_SETUP.md
echo.
pause
