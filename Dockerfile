FROM node:22-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM eclipse-temurin:21-jdk-alpine AS backend
WORKDIR /app/backend
COPY backend/.mvn .mvn
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline
COPY backend/src src
COPY --from=frontend /app/frontend/dist/demo/browser/ src/main/resources/static/
RUN ./mvnw -B verify

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S demo && adduser -S demo -G demo
COPY --from=backend --chown=demo:demo /app/backend/target/app.jar app.jar
USER demo
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=65 -XX:+UseSerialGC -XX:ActiveProcessorCount=2"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
