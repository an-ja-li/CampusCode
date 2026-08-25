# CampusCode — Production Deployment Guide

**"Build. Manage. Sell. Earn."**

This guide provides end-to-end instructions for deploying CampusCode to production with a managed cloud PostgreSQL database (Neon, Supabase, or Railway) and hosting on Vercel or Containerized Platforms (Railway, Render, AWS, Fly.io).

---

## 1. Production Architecture

```
                      ┌──────────────────────────────────────┐
                      │          Internet / Users            │
                      └──────────────────┬───────────────────┘
                                         │ HTTPS
                                         ▼
                      ┌──────────────────────────────────────┐
                      │    Production Next.js 16 Backend     │
                      │    (Vercel / Railway / Docker)       │
                      │   - React 19 Server Components       │
                      │   - REST API Route Handlers          │
                      │   - Auth.js Session & JWT Security   │
                      │   - Health Check: /api/health        │
                      └──────────────────┬───────────────────┘
                                         │ Secure TLS / Pooler
                                         ▼
                      ┌──────────────────────────────────────┐
                      │    Managed Cloud PostgreSQL          │
                      │    (Neon / Supabase / Railway)       │
                      │   - 26+ Relational Tables            │
                      │   - Empty schema on first deploy     │
                      │   - Persistent cloud storage         │
                      └──────────────────────────────────────┘
```

---

## 2. Cloud PostgreSQL Setup (Choose One)

### Option A: Neon (Recommended — Serverless Postgres)
1. Sign up at [neon.tech](https://neon.tech) and create a project named `campuscode`.
2. Copy your connection string from the dashboard:
   ```env
   DATABASE_URL="postgresql://neondb_owner:[PASSWORD]@[HOST].neon.tech/neondb?sslmode=require"
   ```

### Option B: Supabase (Managed Postgres with PgBouncer)
1. Sign up at [supabase.com](https://supabase.com) and create a project.
2. Go to **Project Settings → Database → Connection string → Transaction Pooler** (Port 6543):
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

### Option C: Railway PostgreSQL
1. Sign up at [railway.app](https://railway.app) and click **New Project → Provision PostgreSQL**.
2. Copy the `DATABASE_URL` variable from the Postgres service panel.

---

## 3. Initializing Database Schema (Zero Seed Data)

To initialize a fresh, empty cloud PostgreSQL database with all tables, constraints, and indexes:

```bash
# Set your cloud database URL in your local environment or .env.local:
export DATABASE_URL="postgresql://user:password@cloud-host/dbname?sslmode=require"

# Push the schema to your cloud database:
npx prisma db push
```

> **Important**: `prisma db push` sets up the schema with **ZERO sample/mock data**, ensuring your production database is clean for real users.

### Optional: Seeding Demo Data (Development Only)
If you wish to test with sample data in staging/development:
```bash
# Only run when explicitly needed:
npm run db:seed
```

---

## 4. Deploying to Vercel (Recommended for Serverless)

1. Push your repository to **GitHub / GitLab / Bitbucket**.
2. Go to [vercel.com/new](https://vercel.com/new) and import the `CampusCode` repository.
3. In the **Environment Variables** section, add the following:

| Variable Name | Example Value | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://...@neon.tech/neondb?sslmode=require` | Cloud Postgres connection string |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` generated string | Secret key for JWT session encryption |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Production root URL |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Public app URL |
| `NODE_ENV` | `production` | Production environment flag |

4. Click **Deploy**. Vercel will automatically build the Next.js application and run `prisma generate`.

---

## 5. Deploying with Docker / Railway (Containerized)

### Using Railway:
1. Connect your GitHub repository to [Railway.app](https://railway.app).
2. Railway will automatically detect the [Dockerfile](file:///c:/Users/Harsh/Desktop/My_project/CampusCode/Dockerfile).
3. Set the environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`).
4. Railway will build the container and provide a live HTTPS URL.

### Local Docker Compose Testing:
```bash
# Build and run containerized app with PostgreSQL:
docker-compose up --build

# Open http://localhost:3000
```

---

## 6. Verifying Production Deployment

1. **Uptime & Health Check**:
   Visit `https://your-domain.com/api/health`. You should receive:
   ```json
   {
     "status": "healthy",
     "app": "CampusCode",
     "version": "1.0.0",
     "database": {
       "connected": true,
       "latencyMs": 42
     }
   }
   ```

2. **Data Persistence Flow**:
   - Register a new account at `https://your-domain.com/register`.
   - Publish a software listing at `https://your-domain.com/sell` or post a solution requirement at `https://your-domain.com/solutions/post`.
   - Refresh the page and verify that the newly created record is saved directly to your cloud PostgreSQL database.

---

## 7. Security Best Practices Included
- **HTTP Security Headers**: Strict HSTS, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy configured in `next.config.ts`.
- **Database Safety**: SQL injection prevention via Prisma parameterized queries.
- **Secrets Management**: No passwords or API keys are committed; all secrets are configured strictly through environment variables.
