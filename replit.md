# The Daily Vroom

Car import cost calculator and US domestic shipping quote tool, ported from a Vercel static app.

## Run & Operate

- `pnpm --filter @workspace/daily-vroom run dev` — run the web frontend (Vite)
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Optional env (routes degrade gracefully / return clear errors when missing): `ANTHROPIC_API_KEY`, `RUNBUGGY_BEARER_TOKEN`, `RUNBUGGY_COMPANY_ID`, `RUNBUGGY_ENV` (`staging`|`production`), `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `BEEHIIV_API_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + wouter, original CSS kept in component-scoped `<style>` tags (not Tailwind)
- API: Express 5 (plain routes, no OpenAPI codegen for these endpoints)
- External stores/services: Supabase (REST), Anthropic, RunBuggy, Beehiiv — no Replit database used

## Where things live

- `artifacts/daily-vroom/src/pages/ImportCalculator.tsx` — Import Calculator page (routes `/`, `/import-calculator`)
- `artifacts/daily-vroom/src/pages/ShippingCalculator.tsx` — US Domestic Shipping page (routes `/shipping`, `/shipping-calculator`)
- `artifacts/api-server/src/routes/` — `calculate.ts`, `shipping.ts`, `share.ts`, `subscribe.ts` (mounted under `/api`)
- `.migration-backup/` — original Vercel source (reference only, do not serve)

## Architecture decisions

- Faithful 1:1 port: original CSS embedded per-page under namespaced scopes (`.tdv-ic`, `.sc-scope`); logic converted to React but behavior preserved
- API routes intentionally do NOT import `@workspace/db` (it throws without `DATABASE_URL`); Supabase remains the data store
- Vercel origin/referer checks dropped; global `cors()` middleware suffices
- Frontend API calls use `import.meta.env.BASE_URL + 'api/...'`; share URLs use `window.location.origin`

## Product

- Import Calculator: AI-generated landed-cost breakdown (duties, freight, taxes) with live FX + tariff data, state tax panel, share links (`?c=TOKEN`), share-card image, newsletter signup
- Domestic Shipping: live RunBuggy quotes (open/enclosed), booking flow, FAQ

## User preferences

- Do NOT request the `ANTHROPIC_API_KEY` (or other service secrets) from the user — leave them unset; routes return clear errors when missing (stated July 27, 2026)
- User dislikes generic "Vercel app" styling; a distinctive cosmetic redesign is planned (Task #2)

## Gotchas

- Both calculator pages attach DOM event listeners in a `useEffect` mirroring the original imperative code — keep listener registration/cleanup symmetric when editing
- The pages postMessage a resize ping every 300ms for iframe embedding on the owner's site; keep it

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
