# Specification for Project Services

## Scripts

### User Management
- **Serve Application:**
  ```bash
  npx nx run user-management:serve
  ```

- **Docker Up:**
  ```bash
  docker compose --file ./apps/user-management/docker-compose.dev.yml --env-file ./apps/user-management/user-app.env --project-name "readme-user-management" up -d
  ```

- **Docker Down:** 
  ```bash 
  docker compose --file ./apps/user-management/docker-compose.dev.yml --env-file ./apps/user-management/user-app.env --project-name "readme-user-management" down
  ```

### Content Management
- **Serve Application:** 
  ```bash 
    npx nx run content-management:serve
  ```

- **Docker Up:** 
  ```bash 
  docker compose --file ./apps/content-management/docker-compose.dev.yml --env-file ./apps/content-management/content-app.env --project-name "readme-content-management" up -d
  ```

- **Docker Down:** 
  ```bash 
  docker compose --file ./apps/content-management/docker-compose.dev.yml --env-file ./apps/content-management/content-app.env --project-name "readme-content-management" down
  ```

### File Management
- **Serve Application:** 
  ```bash 
  npx nx run file-management:serve
  ```

- **Docker Up:** 
  ```bash 
  docker compose --file ./apps/file-management/docker-compose.dev.yml --env-file ./apps/file-management/file-app.env --project-name "readme-file-management" up -d
  ```

- **Docker Down:** 
  ```bash 
  docker compose --file ./apps/file-management/docker-compose.dev.yml --env-file ./apps/file-management/file-app.env --project-name "readme-file-management" down
  ```

### Notification Management
- **Serve Application:** 
  ```bash 
  npx nx run notification-management:serve
  ```
- **Docker Up:** 
  ```bash 
  docker compose --file ./apps/notification-management/docker-compose.dev.yml --env-file ./apps/notification-management/notification-app.env --project-name "readme-notification-management" up -d
  ```

- **Docker Down:** 
  ```bash 
  docker compose --file ./apps/notification-management/docker-compose.dev.yml --env-file ./apps/notification-management/notification-app.env --project-name "readme-notification-management" down
  ```

### API Service
- **Serve API:** 
  ```bash 
  npx nx run api:serve
  ```

### General Commands
- **Reset:** 
  ```bash 
  npx nx reset
  ```

## Database Management

### Prisma Commands (Content Management)
- **Lint Database Schema:** 
  ```bash 
  npx prisma validate --schema ./schema.prisma
  ```

- **Migrate Database:** 
  ```bash 
  npx prisma migrate dev --schema ./schema.prisma --skip-generate --skip-seed
  ```

- **Reset Database:** 
  ```bash 
  npx prisma migrate reset --schema ./schema.prisma --force --skip-generate --skip-seed
  ```

- **Generate Prisma Client:** 
  ```bash 
  npx prisma generate --schema ./schema.prisma
  ```

- **Seed Database:** 
  ```bash 
  npx ts-node seed.ts
  ```
-
