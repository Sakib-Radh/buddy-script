# Buddy Script

A small social feed application built for the Appifylab Full Stack Developer task. It converts
the provided Login, Register, and Feed designs into a working Next.js app with authentication,
posts, comments, replies, and likes, backed by PostgreSQL.

## Features

- Email/password authentication with hashed passwords and JWT sessions
- Protected feed — only logged-in users can access it
- Create posts with text and an optional image
- Public and private posts (private posts are visible only to their author)
- Feed shows newest posts first, with pagination for large amounts of data
- Like / unlike posts, comments, and replies, and see who liked each one
- Comments and nested replies

## Tech stack

- **Next.js (App Router)** — React frontend and API routes in one project
- **PostgreSQL** (hosted on Neon) — relational database
- **Prisma** — schema, migrations, and database queries
- **bcryptjs** — password hashing
- **jose** — signing and verifying JWTs (works in both the Node and Edge runtimes)

## Requirements

- Node.js 20 (see `.nvmrc`)
- A PostgreSQL database (a free Neon project works well)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   JWT_SECRET="a-long-random-string"
   ```

   You can generate a secret with `openssl rand -base64 32`.

3. Apply the database schema:

   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The app runs at http://localhost:3000.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production
- `npm run start` — run the production build
- `npm run lint` — run ESLint
- `npx prisma studio` — open a browser UI to inspect the database

## Project structure

```
prisma/          Prisma schema and migration history
public/assets/   Provided design assets (CSS, images, fonts)
src/app/         Pages and API routes (App Router)
src/app/api/     Backend endpoints (auth, posts, comments, likes)
src/lib/         Shared helpers (Prisma client, auth utilities)
```

## Notes

- Prisma is pinned to version 6, which keeps the database URL in `schema.prisma` for a simpler setup.
- Uploaded images are stored on a cloud image host so they persist across deployments.
