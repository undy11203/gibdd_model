# Use official OpenJDK 21 image as base
FROM openjdk:21-jdk-slim

# Set working directory inside container
WORKDIR /app

# Copy Gradle wrapper and build files
COPY backend/gradlew backend/gradle ./gradle/
COPY backend/gradlew .
COPY backend/build.gradle .
COPY backend/settings.gradle .

# Copy source code
COPY backend/src ./src

# Give execute permission to gradlew
RUN chmod +x ./gradlew

# Build the application
RUN ./gradlew build -x test

# Expose port 8080
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "build/libs/gibdd-model-0.0.1-SNAPSHOT.jar"]
