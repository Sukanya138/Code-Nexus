#!/bin/bash
# Local development startup script
# Usage: bash start-local.sh

set -e

echo "🚀 Starting CodeNexus Local Development..."
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."
command -v docker >/dev/null 2>&1 || { echo "❌ Docker not found. Install Docker Desktop."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Install Node 18+."; exit 1; }
command -v java >/dev/null 2>&1 || { echo "❌ Java not found. Install Java 17+."; exit 1; }

# Start database
echo ""
echo "📦 Starting PostgreSQL + pgvector..."
docker compose up -d postgres
sleep 5

# Check database health
echo "⏳ Waiting for database to be ready..."
for i in {1..30}; do
  if docker compose exec -T postgres pg_isready -U postgres -d codenexus >/dev/null 2>&1; then
    echo "✓ Database ready"
    break
  fi
  sleep 1
done

# Build backend
echo ""
echo "🔨 Building backend (first time takes ~30 seconds)..."
cd backend
if [ ! -f "target/backend-0.0.1-SNAPSHOT.jar" ]; then
  ./mvnw clean package -DskipTests -q
fi
cd ..

echo ""
echo "✅ All set! Starting services..."
echo ""
echo "📝 In separate terminals, run:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && ./mvnw spring-boot:run"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd client && npm install && npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "📚 For more info, see LOCAL_DEV_SETUP.md"
