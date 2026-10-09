# Local PostgreSQL Setup (Windows - No Docker)

This guide installs PostgreSQL directly on Windows with pgvector support.

## Step 1: Install PostgreSQL 16 (with pgvector)

### Option A: Download Installer (Easiest)

1. Go to https://www.postgresql.org/download/windows/
2. Download **PostgreSQL 16** installer for Windows
3. Run installer and follow steps:
   - Accept license
   - Choose installation directory (default: `C:\Program Files\PostgreSQL\16`)
   - Setup server:
     - Port: **5432** (default)
     - Password: **postgres** (or your choice)
   - Uncheck "Stack Builder" at end (we'll install pgvector manually)
4. Click Finish

**Verify installation:**
```powershell
psql --version
# Should output: psql (PostgreSQL) 16.x
```

---

### Option B: Use Chocolatey (if installed)

```powershell
choco install postgresql16
```

---

## Step 2: Enable pgvector Extension

pgvector is available for PostgreSQL 16+.

### Option A: Using Windows Binary (Recommended)

1. Download pgvector Windows build from: https://github.com/pgvector/pgvector/releases
   - Get: `pgvector-x.x-postgres16-windows-x64.zip`

2. Extract to PostgreSQL extensions folder:
   ```powershell
   # Extract to:
   C:\Program Files\PostgreSQL\16\lib\
   ```

3. Connect to PostgreSQL and enable extension:
   ```powershell
   psql -U postgres
   ```
   Then run:
   ```sql
   CREATE EXTENSION vector;
   \dx  # Verify it's installed
   ```

---

### Option B: Build from Source (Advanced)

If Windows binaries not available:
```powershell
# Install MSVC Build Tools
# Install LLVM
# Build pgvector following: https://github.com/pgvector/pgvector#building-from-source
```

---

## Step 3: Create Database and User

```powershell
# Connect as postgres superuser
psql -U postgres

# Inside psql:
CREATE DATABASE codenexus;
CREATE EXTENSION vector;
\l  # List databases - should see codenexus
```

---

## Step 4: Configure Backend

Update `backend/.env.local`:
```
DB_URL=jdbc:postgresql://localhost:5432/codenexus
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

---

## Quick Start

### Terminal 1: Start Backend
```powershell
cd backend
.\mvnw spring-boot:run
```

### Terminal 2: Start Frontend
```powershell
cd client
npm install
npm run dev
```

---

## Verify Setup

```powershell
# Check PostgreSQL is running
psql -U postgres -d codenexus -c "SELECT version();"

# Check pgvector extension
psql -U postgres -d codenexus -c "SELECT * FROM pg_extension WHERE extname='vector';"

# Test vector type
psql -U postgres -d codenexus -c "SELECT '[1,2,3]'::vector;"
```

---

## Troubleshooting

### "Connection refused" on port 5432
```powershell
# Check if PostgreSQL service is running
Get-Service postgresql-x64-16

# Start it if stopped
Start-Service postgresql-x64-16
```

### "psql: command not found"
Add PostgreSQL to PATH:
```powershell
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::User)
```

### pgvector extension not found
```powershell
# Connect to postgres
psql -U postgres -d codenexus

# List available extensions
\dx+

# If vector not listed, download binary and extract again
```

### Default password doesn't work
```powershell
# Use Windows authentication (no password)
psql -U postgres

# Or reset password
ALTER USER postgres WITH PASSWORD 'newpassword';
```

---

## Stopping PostgreSQL

```powershell
# Stop service
Stop-Service postgresql-x64-16

# Start service
Start-Service postgresql-x64-16

# Check status
Get-Service postgresql-x64-16
```

---

## Backup Database

```powershell
# Backup
pg_dump -U postgres codenexus > backup.sql

# Restore
psql -U postgres codenexus < backup.sql
```

---

## Reset Database

```powershell
psql -U postgres

# Drop and recreate
DROP DATABASE IF EXISTS codenexus;
CREATE DATABASE codenexus;
CREATE EXTENSION vector;
```

---

**Next Steps:**
1. Install PostgreSQL 16
2. Enable pgvector extension
3. Create `codenexus` database
4. Run: `cd backend && .\mvnw spring-boot:run`
5. Backend should connect successfully
