# The Daily Vroom — Calculator Suite

Two calculators for car enthusiasts:

- **Import Calculator** — total landed cost for importing a vehicle into the USA (duties, taxes, compliance, shipping)
- **Shipping Calculator** — instant domestic US transport quotes (open and enclosed carriers)

---

## Project Structure

This is a **pnpm monorepo** with two artifacts:

```
artifacts/
  daily-vroom/     # React + Vite frontend (the two calculators)
  api-server/      # Express API backend
```

The original Vercel serverless functions (`.migration-backup/api/*.js`) have been replaced by a single Express server in `artifacts/api-server`.

---

## Deploying to Vercel

1. Import the repo into Vercel from your GitHub account
2. Vercel will auto-detect the `vercel.json` — no framework settings to change
3. Add the following environment variables in the Vercel project settings:

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | AI-powered import cost analysis |
| `BEEHIIV_API_KEY` | Email newsletter subscription |
| `RUNBUGGY_BEARER_TOKEN` | RunBuggy shipping quotes API |
| `RUNBUGGY_COMPANY_ID` | RunBuggy account identifier |
| `RUNBUGGY_ENV` | `"production"` or `"sandbox"` |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key |

4. Deploy — Vercel builds the frontend and serves the `/api/*` functions automatically.

The API routes live in `/api/` as Vercel serverless functions:
- `/api/calculate` — import cost calculation (calls Anthropic)
- `/api/shipping` — domestic shipping quote (calls RunBuggy)
- `/api/share` — save/retrieve shareable calculation links (uses Supabase)
- `/api/subscribe` — newsletter signup (calls Beehiiv)

---

## Running Locally

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Install dependencies
```bash
pnpm install
```

### Start the frontend
```bash
pnpm --filter @workspace/daily-vroom run dev
```

### Start the API server
```bash
pnpm --filter @workspace/api-server run dev
```

Both can run simultaneously in separate terminals.

---

## Environment Variables

The API server reads the following environment variables. Create a `.env` file inside `artifacts/api-server/` (never commit it):

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | AI-powered import cost analysis |
| `BEEHIIV_API_KEY` | Email newsletter subscription |
| `RUNBUGGY_BEARER_TOKEN` | RunBuggy shipping quotes API |
| `RUNBUGGY_COMPANY_ID` | RunBuggy account identifier |
| `RUNBUGGY_ENV` | `"production"` or `"sandbox"` |
| `SUPABASE_URL` | Supabase project URL (shared calculation storage) |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SESSION_SECRET` | Express session signing secret (any long random string) |

---

## API Routes

All routes are prefixed `/api`:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/calculate` | Run import cost calculation |
| `POST` | `/api/shipping` | Get domestic shipping quote |
| `POST` | `/api/share` | Save a shareable calculation result |
| `POST` | `/api/subscribe` | Newsletter subscription |

---

## Design System

See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for the full visual identity spec — colors, typography, component patterns, and guidelines for applying the Speedform look across other apps.

---

## Original Vercel Setup

The original serverless functions are preserved in `.migration-backup/` for reference. They are **not active** — the Express server in `artifacts/api-server` handles all API requests.
