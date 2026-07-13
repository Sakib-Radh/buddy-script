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

2. Set up your environment variables. Copy the example file and fill in the values:

   ```bash
   cp .env.example .env
   ```

   What each one is for:

   - `DATABASE_URL` — your Postgres connection string
   - `JWT_SECRET` — any long random string used to sign sessions (`openssl rand -base64 32` gives you one)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your Cloudinary
     dashboard; these are what image uploads use

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

## A few decisions worth explaining

- The register design only had email and password fields, but the task asked for first and last
  name too, so I added those inputs using the same design classes to keep it consistent.
- The "sign in with Google", "remember me", and "forgot password" controls are kept in the markup
  to match the design, but OAuth and password reset were out of scope so they aren't wired up.
- Likes for posts and comments live in one table. Each like is its own row, which means "who liked
  this" is just the rows that point at that post or comment — no extra bookkeeping.
- The feed uses cursor-based pagination instead of page numbers, so it stays fast and doesn't skip
  or repeat posts as new ones come in while you scroll.
- Replies go one level deep. Replying to a reply attaches it to the top-level comment, which keeps
  the thread readable and matches how the design lays out comments.
- Images go to Cloudinary rather than local disk, because the filesystem on the deployment host is
  temporary and uploads would disappear on the next deploy.

## Notes

- Prisma is pinned to version 6, which keeps the database URL in `schema.prisma` for a simpler setup.
