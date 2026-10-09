# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml from backend
COPY backend/pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy backend source code
COPY backend/src ./src

# Build JAR
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy JAR from builder
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/api/auth/session || exit 1

# Run application
CMD ["java", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]