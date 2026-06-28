# Secure Notepad

A private, personal notepad web app. Sign in with Google, write notes, and keep
them scoped to your account only. Built to deploy on Vercel with zero changes.

## Stack

- **Next.js (App Router)** + **TypeScript**
- **Auth.js / NextAuth v5** with **Google OAuth** (stateless JWT sessions)
- **Prisma ORM** + **PostgreSQL**
- **Tailwind CSS**

## Security model

- Every `/notes/*` page is guarded server-side in `src/app/notes/layout.tsx`;
  unauthenticated requests are redirected to `/login`.
- All reads and writes are scoped by `userId`. A note belonging to another user
  returns 404 and cannot be read, edited, or deleted (see
  `src/app/notes/actions.ts` and `src/app/notes/[id]/page.tsx`).
- Sessions are stateless JWTs (signed + encrypted), a natural fit for
  serverless — no DB read per request. The Prisma adapter still persists the
  user/account records that notes are scoped to.
- Mutations use Server Actions (POST-only, CSRF-protected by Next.js).
- Input lengths are capped; security headers are set in `next.config.mjs`.
- The app sends `noindex` so notes never end up in search engines.

## Logging & audit

Two layers, written from a single call site (`src/lib/audit.ts`):

- **Observability logs** (`src/lib/logger.ts`) — structured JSON to stdout,
  captured by Vercel's function logs. Ephemeral; add a Log Drain if you need
  retention.
- **Audit trail** (`AuditLog` table) — durable "who did what" records for sign
  in/up/out and note create/update/delete. Decoupled from `User` (no foreign
  key) so it survives user deletion. Writes are best-effort and never break the
  user action. Prune old rows when needed:
  `delete from "AuditLog" where "createdAt" < now() - interval '90 days';`

## Local setup

Requires Node 18+ (or Bun) and a PostgreSQL database.

1. **Install dependencies**

   ```bash
   npm install      # or: bun install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Fill in `.env`:

   - `DATABASE_URL` — your Postgres connection string.
   - `AUTH_SECRET` — generate with `openssl rand -base64 32`.
   - `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — from the
     [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

3. **Set up Google OAuth**

   Create an OAuth 2.0 Client ID (type: Web application) and add the redirect URI:

   ```
   http://localhost:3000/api/auth/callback/google
   ```

   (Add your production URL too once deployed.)

4. **Create the database schema**

   ```bash
   npm run db:push       # quick start, no migration history
   # or, with migration files:
   npm run db:migrate
   ```

5. **Run it**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Deploying to Vercel

1. Push this repo to GitHub and import it into Vercel.
2. Add a Postgres database (Vercel Postgres, Neon, or Supabase) and set
   `DATABASE_URL` to its **pooled** connection string. If your host requires a
   separate non-pooled URL for migrations, set `DIRECT_URL` and uncomment
   `directUrl` in `prisma/schema.prisma`.
3. Set environment variables in the Vercel project settings: `DATABASE_URL`,
   `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`.
4. In Google Cloud Console, add the production redirect URI:
   `https://<your-app>.vercel.app/api/auth/callback/google`.
5. Run the schema against the production DB once (e.g. `npm run db:push` with
   the production `DATABASE_URL`, or wire up `prisma migrate deploy`).

The `build` script runs `prisma generate` automatically, so Vercel builds work
out of the box.

## Project layout

```
prisma/schema.prisma           Prisma models (Auth.js tables + Note)
src/auth.ts                    NextAuth config (Google, Prisma adapter)
src/lib/prisma.ts              PrismaClient singleton
src/lib/logger.ts              Structured stdout logger
src/lib/audit.ts               Audit-trail writer (log line + AuditLog row)
src/app/api/auth/[...nextauth] Auth.js route handlers
src/app/login/                 Google sign-in page
src/app/notes/                 Notes list, editor, and server actions
src/components/                UI components (header, editor)
```
