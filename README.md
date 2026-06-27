# Verc Note

Verc Note is a minimal private notepad web app built for Vercel with Next.js App Router, TypeScript, Auth.js / NextAuth, Prisma, Postgres, and Tailwind CSS.

## Features

- Google OAuth sign-in with Auth.js.
- Database-backed sessions through Prisma.
- Private notes CRUD for signed-in users.
- Server-side authorization next to every database operation.
- User-scoped Prisma reads, updates, and deletes.
- Vercel-friendly scripts and environment-variable configuration.

## Install dependencies

```bash
npm install
```

## Environment variables

Copy `.env.example` to `.env` for local development:

```bash
cp .env.example .env
```

Required variables:

```bash
AUTH_SECRET="replace-with-a-random-secret"
AUTH_GOOGLE_ID="replace-with-google-client-id"
AUTH_GOOGLE_SECRET="replace-with-google-client-secret"
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Generate a strong `AUTH_SECRET` with:

```bash
npx auth secret
```

or another cryptographically secure secret generator.

## Configure Google OAuth

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or choose a project.
3. Configure the OAuth consent screen.
4. Create OAuth 2.0 Client credentials for a web application.
5. Add local redirect URI:
   - `http://localhost:3000/api/auth/callback/google`
6. Add Vercel redirect URIs for preview and production deployments, for example:
   - `https://your-production-domain.com/api/auth/callback/google`
   - `https://your-preview-domain.vercel.app/api/auth/callback/google`
7. Put the client ID in `AUTH_GOOGLE_ID` and the client secret in `AUTH_GOOGLE_SECRET`.

The sign-in callback rejects Google profiles without an email and rejects explicitly unverified Google emails when Google returns the `email_verified` claim as `false`.

## Database and Prisma

Run Prisma migrations locally:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

Deploy existing migrations in hosted environments:

```bash
npm run db:migrate:deploy
```

The initial migration creates `User`, `Account`, `Session`, `VerificationToken`, and `Note` tables. Each note belongs to exactly one user.

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the project in Vercel.
3. Add `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and `DATABASE_URL` in Vercel Project Settings.
4. Ensure your Postgres provider accepts connections from Vercel.
5. Run migrations against the target database with `npm run db:migrate:deploy` as part of your release process.
6. Deploy.

The `build` script runs `prisma generate && next build`, which is compatible with Vercel Git deployments.

## Preview and production deployments

Use separate Google OAuth redirect URIs for each Vercel preview URL pattern or stable preview domain you rely on. For production, use your production domain redirect URI. Use separate production and preview databases when possible so preview testing cannot affect production notes.

Set environment variables in Vercel for the correct environment scope:

- Development: local `.env` only.
- Preview: preview OAuth client/redirects and preview database.
- Production: production OAuth client/redirects and production database.

## Security model

Authentication is handled by Google OAuth through Auth.js. Sessions are stored in the database by the Prisma adapter.

Authorization is enforced server-side close to data access:

- The notes area is protected by a server-rendered layout that redirects unauthenticated users before rendering notes.
- Every note action calls the server-side `auth()` helper before touching Prisma.
- Reads are filtered by the authenticated `userId`.
- Updates and deletes use a compound `id + userId` unique selector, so knowing another note ID is not enough to mutate it.
- Client UI state is never trusted as an authorization boundary.

## Future Python/internal AI service

Python is intentionally not implemented yet. Future AI or business logic can be added as a separate internal service for tasks such as summarizing notes, extracting tasks, generating embeddings, semantic search, and clustering notes. This Next.js app should continue to own web UI, authentication, authorization, and database CRUD boundaries.
