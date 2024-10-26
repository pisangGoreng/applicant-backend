# applicant-backend

This repository contains the backend services for the Applicant-UI. The backend provides APIs to manage applicants, including functionality for filtering by role and status, pagination, searching, and adding new applicants.

## Features

- CRUD Operations for managing applicants.
- Filtering by role and status.
- Pagination and search functionality.
- MySQL database for storing applicant data.
- Prisma ORM for database interactions.

## Tech Stack

**Backend:** Nestjs

**ORM:** Prisma

**Database:** Mysql

**Containerization:** Docker

## Prerequisites

- Node.js (v18.x or higher) and npm
- Docker (for containerization)
- MySQL database
- Prisma CLI installed globally

## Installation

1. Clone the Repository:

   ```bash
   git clone ...
   cd applicant-backend
   ```

2. Install Dependencies:

```bash
npm install
```

3. Run docker for Mysql Database

```bash
docker compose up --build
```

4. Seed the database

```bash
pnpm prisma migrate dev --name init
pnpm prisma generate
npm run seed-dummy-data
```

3. Set Environment Variables:
   Create a .env.local file in the root directory and add your configuration

```bash
DATABASE_URL="mysql://root:password@127.0.0.1:3306/nestjs_applicant?schema=public?connect_timeout=300"
MYSQL_DATABASE=nestjs_applicant
MYSQL_ROOT_PASSWORD=password
PORT=3001
NODE_ENV=development
```

4. Run the Application:

```bash
npm run start:dev
```

The application will be running on http://localhost:3001.

## API Document

Please check the postman collection in root directory
