# MIV Architecture Report

This report reflects the repository state inspected on 2026-07-26. It is based on the current source tree, not the older architecture report. Dependency folders, build caches, and generated outputs were excluded from the source tree review unless they were relevant to repository hygiene.

`ISSUES.md` was requested as an input, but no `ISSUES.md` file exists in this checkout. `rg --files -g 'ISSUES.md' -g '*ISSUES*'` returned no results from the repository root, so issue reconciliation below uses the previous architecture report plus current source evidence and marks the missing tracker as unable to verify.

## 1. Executive Summary

The `miv` frontend is a Next.js App Router application with React 19, TypeScript, Tailwind CSS 4, Radix/shadcn-style primitives, Prisma, and NextAuth. It contains public marketing/auth routes, an admin dashboard, a founder/user dashboard, local Next API routes, and integration points to a separate `/backend` service through Next rewrites.

The recent cleanup changed the frontend architecture in four important ways:

- Dashboard pages are now grouped with route groups under `miv/app/dashboard`, which improves source organization without changing URLs.
- Manual test pages were removed from public route positions and archived under `miv/archive/manual-test-pages`.
- The standalone `/venture-intake` route is gone; the canonical Venture Intake URL is `/dashboard/venture-intake`.
- Frontend Docker onboarding now exists in `miv/compose.yaml`, `miv/Dockerfile`, and `miv/docker-entrypoint.sh`, with Postgres started automatically for frontend development.

Onboarding is now Docker-first for the frontend folder: from `miv`, the intended command is `docker compose up -d`. That starts the frontend and a Postgres 16 container, runs Prisma generation and deployed migrations inside the frontend container, and serves the app on port `3000` by default. This was config-validated with `docker compose config`; the container startup itself was not run during this documentation task.

Mobile readiness is partial. The codebase has a mobile shell foundation, mobile state components, API-side mobile payload trimming, and dashboard mobile navigation. However, global viewport configuration still disables zoom, scrollbars are globally hidden, there is no shared client device-view hook, and most feature pages remain desktop-first responsive pages rather than separate mobile flows.

Major remaining risks:

- Authentication remains mixed between NextAuth, `payload-token` middleware, development bypasses, and `/backend` cookie APIs.
- Many API routes are still public or have disabled/commented auth checks, including seed/test-like routes.
- Frontend package tooling is inconsistent: Docker and `package-lock.json` use npm, but `scripts/check-setup.mjs` still expects pnpm and `pnpm-lock.yaml`.
- There is no root Compose file that orchestrates `miv` and `miv-backend` together.
- Backend repository hygiene remains risky: `miv-backend/.env`, both backend lockfiles, and uploaded files are tracked.
- Production Docker readiness is not proven for either service.

## 2. Current Frontend Architecture

`miv/app` is the App Router root. Route folders contain `page.tsx`, layouts live in `layout.tsx`, and API endpoints live under `app/api/**/route.ts`.

Current page structure:

- Public routes: `/`, `/auth/login`, `/auth/register`.
- Admin dashboard shell: `/dashboard` and grouped dashboard feature routes.
- Founder dashboard shell: `/user-dashboard`, `/user-dashboard/diagnostics`, `/user-dashboard/documents`, `/user-dashboard/profile`, `/user-dashboard/support`.
- Archived manual test pages: `archive/manual-test-pages/test-comprehensive`, `test-data`, and `test-environment`. These are not active App Router routes because they are outside `app`.
- API routes: local Next API handlers under `app/api`, including ventures, documents, GEDSI metrics, IRIS metrics, analytics, workflows, team, fund management, emails, users, AI, seed, and test endpoints.

Dashboard route groups:

- `(venture-management)`: deal flow, diagnostics, due diligence, venture intake, ventures list, venture detail.
- `(documents)`: documents and impact documents.
- `(fund-investment)`: capital facilitation, exit strategy, fund management, investment rounds, portfolio.
- `(impact-reporting)`: advanced reports, AI analysis, GEDSI tracker, impact reports, IRIS metrics, performance analytics, social impact, sustainability.
- `(operations)`: calendar, team management, workflows, workflow wizard, workflow builder, workflow monitor.
- `(platform)`: custom dashboards, help/support, notifications, system settings.

Route group folder names in parentheses do not appear in browser URLs. For example, `app/dashboard/(venture-management)/ventures/page.tsx` still serves `/dashboard/ventures`.

Shared frontend layers:

- `components/ui`: reusable shadcn/Radix-style primitives.
- `components/enterprise`: admin dashboard modules such as advanced tables, filters, analytics, notifications, and workflow tabs.
- `components/user`: founder/user sidebar and documents component.
- `components/mobile`: reusable mobile page, header, navigation, loading, empty, error, and section components.
- `components/sidebar.tsx` and `components/mobile-nav.tsx`: admin navigation.
- `components/venture-intake-form.tsx`: shared form used by the canonical dashboard Venture Intake route.
- `hooks/useAuth.ts`: client auth helper that calls `/backend/api/users` and `/backend/api/auth/login`.

Data and backend integration:

- Prisma is configured in `prisma/schema.prisma` with `provider = "postgresql"` and `DATABASE_URL`.
- `lib/prisma.ts` provides the Prisma client entry point.
- App API routes use Prisma directly for local database access.
- `next.config.ts` rewrites `/backend/:path*` to `NEXT_PUBLIC_BACKEND_URL` or `PUBLIC_BACKEND_URL`, defaulting to `http://localhost:3001`.
- Founder/user pages and auth helpers still use `/backend/api/**` endpoints for several operations.
- AI routes and `lib/ai-services.ts` integrate with provider environment variables by name: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and `GOOGLE_AI_API_KEY`.

Authentication approaches currently coexist:

- NextAuth route: `app/api/auth/[...nextauth]/route.ts`.
- Middleware cookie gate: `middleware.ts` checks for `payload-token` and excludes `/api` and `/backend`.
- Development bypasses: dashboard and user-dashboard layouts set authenticated state to true in the browser.
- Backend cookie flow: `hooks/useAuth.ts`, `app/api/session/login/route.ts`, and user dashboard code call `/backend/api/**`.
- Route-local auth is inconsistent: some handlers call `getServerSession`, some have it commented out, and some do not enforce auth.

## 3. Current Folder Tree

Relevant source tree, excluding dependency/build/generated folders:

```text
miv/
  .dockerignore
  .env.example
  .gitignore
  Dockerfile
  README.md
  compose.yaml
  components.json
  docker-entrypoint.sh
  eslint.config.mjs
  middleware.ts
  next.config.ts
  package-lock.json
  package.json
  postcss.config.mjs
  tailwind.config.ts
  tsconfig.json
  app/
    globals.css
    layout.tsx
    page.tsx
    api/
      add-venture-details/route.ts
      ai/analyze-venture/route.ts
      ai/gedsi-insights/route.ts
      analytics/route.ts
      auth/[...nextauth]/route.ts
      auth/set-password/route.ts
      calculations/route.ts
      calculations-simple/route.ts
      calendar/analytics/route.ts
      calendar/events/route.ts
      calendar/events/[id]/route.ts
      custom-dashboards/route.ts
      documents/route.ts
      documents/[id]/route.ts
      documents/analytics/route.ts
      emails/logs/route.ts
      emails/stg-reminder/route.ts
      emails/weekly-update/route.ts
      fund-management/route.ts
      gedsi-metrics/route.ts
      gedsi-metrics/[id]/route.ts
      improve-gedsi-scores/route.ts
      iris/metrics/route.ts
      iris/metrics/[code]/route.ts
      notifications/route.ts
      search/route.ts
      seed-*/route.ts
      session/login/route.ts
      team/**/route.ts
      test-db/route.ts
      test-sprint2/route.ts
      users/route.ts
      users/me/route.ts
      users/ventures/route.ts
      ventures/route.ts
      ventures/[id]/route.ts
      ventures/[id]/gedsi/route.ts
      workflows/**/route.ts
    auth/
      login/page.tsx
      register/page.tsx
    dashboard/
      layout.tsx
      page.tsx
      (documents)/
        documents/page.tsx
        impact-documents/page.tsx
      (fund-investment)/
        capital-facilitation/page.tsx
        exit-strategy/page.tsx
        fund-management/page.tsx
        investment-rounds/page.tsx
        portfolio/page.tsx
      (impact-reporting)/
        advanced-reports/page.tsx
        ai-analysis/page.tsx
        gedsi-tracker/page.tsx
        impact-reports/page.tsx
        iris-metrics/page.tsx
        performance-analytics/page.tsx
        social-impact/page.tsx
        sustainability/page.tsx
      (operations)/
        calendar/page.tsx
        team-management/page.tsx
        workflows/page.tsx
        workflows/wizard/page.tsx
        workflows/[id]/builder/page.tsx
        workflows/[id]/monitor/page.tsx
      (platform)/
        custom-dashboards/page.tsx
        help-support/page.tsx
        notifications/page.tsx
        system-settings/page.tsx
      (venture-management)/
        deal-flow/page.tsx
        diagnostics/page.tsx
        due-diligence/page.tsx
        venture-intake/page.tsx
        ventures/page.tsx
        ventures/[id]/page.tsx
    user-dashboard/
      layout.tsx
      page.tsx
      diagnostics/page.tsx
      documents/page.tsx
      documents/page1.tsx
      profile/page.tsx
      support/page.tsx
  archive/
    manual-test-pages/
      test-comprehensive/page.tsx
      test-data/page.tsx
      test-environment/page.tsx
  components/
    auth-session-provider.tsx
    breadcrumb.tsx
    global-search.tsx
    logo.tsx
    mobile-nav.tsx
    sidebar.tsx
    venture-intake-form.tsx
    enterprise/*.tsx
    mobile/*.tsx
    ui/*.tsx
    user/*.tsx
  hooks/
    useAuth.ts
  images/
    bg1.jpeg
    download.png
    logo.svg
    London Underground.jpeg
    michi-foriio.png
    placeholder.svg
  lib/
    ai-services.ts
    cache-headers.ts
    calculation-service.ts
    constants.ts
    gedsi-utils.ts
    iris-catalog.json
    iris-metrics.ts
    mobile-detect.ts
    prisma.ts
    utils.ts
  prisma/
    schema.prisma
    seed.ts
    seed-test.ts
    migrations/
      20260726040000_postgresql_baseline/migration.sql
      migration_lock.toml
  scripts/
    check-setup.mjs
    delete-ventures.ts
    delete-ventures-interactive.ts
    restore-old-ventures.ts
  types/
    next-auth.d.ts
```

Repository-level Docker/backend files relevant to architecture:

```text
README.md
miv-backend/
  .env
  .env.example
  Dockerfile
  docker-compose.yml
  package-lock.json
  pnpm-lock.yaml
  package.json
  src/
  tests/
  uploads/
```

## 4. Route Organization Changes

Before cleanup, the dashboard route structure was flat under `app/dashboard`, and manual test pages were active under `app/test-comprehensive`, `app/test-data`, and `app/dashboard/test-environment`. The previous architecture report also listed backup/alternate dashboard pages in active route folders.

After cleanup:

| Group | Routes now inside group | Public URL examples |
|---|---|---|
| `(venture-management)` | deal-flow, diagnostics, due-diligence, venture-intake, ventures, ventures/[id] | `/dashboard/ventures`, `/dashboard/venture-intake` |
| `(documents)` | documents, impact-documents | `/dashboard/documents` |
| `(fund-investment)` | capital-facilitation, exit-strategy, fund-management, investment-rounds, portfolio | `/dashboard/fund-management` |
| `(impact-reporting)` | advanced-reports, ai-analysis, gedsi-tracker, impact-reports, iris-metrics, performance-analytics, social-impact, sustainability | `/dashboard/gedsi-tracker` |
| `(operations)` | calendar, team-management, workflows routes | `/dashboard/workflows` |
| `(platform)` | custom-dashboards, help-support, notifications, system-settings | `/dashboard/system-settings` |

The standalone `/venture-intake` route is not present in `miv/app`. The canonical Venture Intake route is `miv/app/dashboard/(venture-management)/venture-intake/page.tsx`, served at `/dashboard/venture-intake`.

Archived manual pages:

- `miv/archive/manual-test-pages/test-comprehensive/page.tsx`
- `miv/archive/manual-test-pages/test-data/page.tsx`
- `miv/archive/manual-test-pages/test-environment/page.tsx`

These are preserved for reference but are outside the App Router.

## 5. Development and Onboarding Architecture

The current official frontend Docker workflow is:

```bash
cd miv
docker compose up -d
```

Evidence:

- `miv/compose.yaml` defines `postgres` and `frontend`.
- `miv/Dockerfile` uses `node:20-bookworm-slim`, copies `package.json` and `package-lock.json`, and runs `npm ci`.
- `miv/docker-entrypoint.sh` runs `npx prisma generate`, then `npx prisma migrate deploy`, then executes the container command.
- `frontend` depends on `postgres` with `condition: service_healthy`.
- `frontend` publishes `${FRONTEND_PORT:-3000}:3000`.
- `postgres` uses `postgres:16-bookworm` and a named `vpms_postgres_data` volume.
- `frontend` bind-mounts the source into `/app` and uses named volumes for `/app/node_modules` and `/app/.next`.

Current service startup:

| Item | Current state |
|---|---|
| Intended command | `docker compose up -d` from `miv` |
| Frontend starts | Yes, by Compose definition |
| PostgreSQL starts automatically | Yes, `postgres` service |
| npm runs inside Docker | Yes, `npm ci` at image build and `npm run dev` at runtime |
| Prisma generate runs automatically | Yes, Dockerfile and entrypoint run generation |
| Prisma migrations run automatically | Yes, entrypoint runs `npx prisma migrate deploy` |
| Host Node/npm required for Docker path | Not for normal container startup; Docker is required |
| Host `.env` required | Not strictly for Docker defaults, but `.env.example` documents required production/developer values |
| Frontend port | Host `3000` by default, configurable with `FRONTEND_PORT` |
| Internal DB host | `postgres` inside the Compose network |
| Backend service starts | No, not from `miv/compose.yaml` |

Validation boundary: `docker compose config` passed for `miv`, but `docker compose up -d`, image build, container health checks, and route verification were not run during this documentation task.

## 6. Package and Configuration State

Current frontend package/config state:

| Area | Current evidence | Status |
|---|---|---|
| Package manager in active Docker path | `Dockerfile` uses `package-lock.json` and `npm ci`; runtime uses `npm run dev` | npm selected by current Docker files |
| Active frontend lockfile | `miv/package-lock.json` exists and is tracked | npm lockfile active |
| Removed lockfiles | `miv/pnpm-lock.yaml` and `miv/yarn.lock` are absent | duplicate frontend lockfiles resolved |
| Active Next config | `miv/next.config.ts` only | duplicate frontend Next config resolved |
| Removed duplicate Next config | `miv/next.config.mjs` absent | resolved |
| Node expectation | `package.json` engines: `node >=20.9.0`; Docker uses Node 20 | aligned enough for frontend |
| Cross-platform install | Removed platform-specific `postinstall`; Docker/npm path is simpler | improved |
| Remaining config inconsistency | `scripts/check-setup.mjs` still requires pnpm and `pnpm-lock.yaml` and fails against current npm state | unresolved |
| Next/eslint version mismatch | `next` is `^16.2.1`; `eslint-config-next` is `15.2.4` | unresolved risk |

The frontend README still contains broad/stale enterprise claims and references Next.js 15 badges while `package.json` specifies Next `^16.2.1`. The Docker section is more current than the rest of the README.

## 7. Environment and Repository Hygiene

Frontend hygiene:

- `miv/.gitignore` ignores `.env`, `.env.local`, `.env.*.local`, build outputs, logs, `node_modules`, `.next`, TypeScript build info, generated Prisma output, local SQLite DB files, and upload folders.
- `miv/.env.example` exists and lists environment variable names only for app, database, auth, backend, and AI provider configuration.
- `git ls-files` shows `miv/.env` is not tracked.
- `git ls-files` shows `miv/prisma/dev.db`, `miv/tsconfig.tsbuildinfo`, `miv/.next`, `miv/node_modules`, and frontend upload folders are not tracked.

Environment variable names documented by `miv/.env.example`:

- `NODE_ENV`
- `NEXTAUTH_URL`
- `NEXT_ALLOWED_DEV_ORIGINS`
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_BACKEND_URL`
- `PUBLIC_BACKEND_URL`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_AI_API_KEY`

Backend hygiene remains a risk:

- `miv-backend/.env` is tracked.
- `miv-backend/.env.example` contains concrete-looking provider values rather than placeholders.
- `miv-backend/uploads/**` contains tracked uploaded documents.
- `miv-backend/package-lock.json` and `miv-backend/pnpm-lock.yaml` are both tracked.

Credential rotation is still recommended for any credential-like value that was ever committed in `miv-backend/.env`, `miv-backend/.env.example`, or earlier repository history. Values are intentionally not printed in this report.

## 8. Mobile Development Readiness

| Item | Classification | Evidence |
|---|---|---|
| Accessible viewport | Not started | `app/layout.tsx` sets `maximumScale: 1` and `userScalable: false`, which blocks user zoom. |
| Zoom | Not started | Same viewport configuration disables zoom. |
| Scrollbar behavior | Partial | Global CSS hides scrollbars on `html`, `body`, and overflow containers, then later defines custom scrollbars. Behavior is inconsistent and can harm discoverability. |
| Shared breakpoint | Partial | Tailwind breakpoints are used throughout; no single app-level mobile breakpoint constant was found. |
| Device-view hook | Not started | No client hook such as `useDeviceView` was found. |
| Server mobile detection | Partial | `lib/mobile-detect.ts` detects mobile user agents and can reduce payloads. |
| Mobile shell | Partial | `components/mobile/*` provides page/header/navigation/loading/error/empty/section primitives. |
| Founder mobile layout | Partial | `user-dashboard/layout.tsx` imports `MobilePage` for loading state but still renders a desktop-style header/sidebar shell for main content. |
| Admin mobile layout | Partial | `dashboard/layout.tsx` uses `MobileNav` on small screens, but feature pages remain mostly desktop-first. |
| Feature-level desktop/mobile separation | Not started | No feature-level mobile page split was found. |
| Mobile-specific components | Partial | Reusable mobile primitives exist, but broad feature adoption is limited. |
| Mobile API payload support | Partial | `api/search`, `api/analytics`, and `api/ventures` use mobile detection to reduce response size. |
| Mobile test coverage | Not started | No mobile viewport test suite was found in `miv`. |
| Remaining blockers | Blocked | Zoom/accessibility, shell completion, first mobile feature implementation, and mobile regression tests remain unresolved. |

## 9. Resolved Issues

| Issue ID or description | Previous state | Current evidence | Status |
|---|---|---|---|
| Flat dashboard route structure | Dashboard feature pages were listed flat under `app/dashboard`. | Dashboard pages now live under route groups such as `(venture-management)`, `(operations)`, and `(impact-reporting)`. | Resolved |
| Standalone Venture Intake route | Previous cleanup target referenced a standalone `/venture-intake` route. | No `miv/app/venture-intake` route exists; canonical page is `app/dashboard/(venture-management)/venture-intake/page.tsx`. | Resolved |
| Exposed manual test pages | Manual test pages were active under `app`. | Test pages are archived under `miv/archive/manual-test-pages`. | Resolved |
| Duplicate frontend lockfiles | Previous report found `package-lock.json` and `pnpm-lock.yaml`. | Frontend has `package-lock.json`; no `miv/pnpm-lock.yaml` or `yarn.lock`. | Resolved |
| Duplicate frontend Next config | Previous report found `next.config.ts` and `next.config.mjs`. | Frontend has only `next.config.ts`. | Resolved |
| Platform-specific frontend install script | Previous report found `scripts/install-lightningcss.js` and `postinstall`. | No frontend `postinstall` exists; script is absent. | Resolved |
| Unsafe tracked frontend `.env` | Previous report found tracked `miv/.env`. | `git ls-files -- miv/.env` returns no tracked frontend `.env`; `.gitignore` ignores it. | Resolved |
| Frontend Docker setup missing | Previous architecture did not have current frontend Compose/Docker entrypoint evidence. | `miv/compose.yaml`, `Dockerfile`, and `docker-entrypoint.sh` exist. | Resolved |
| Frontend setup documentation missing | README now documents frontend Docker development commands. | `miv/README.md` contains a Docker Development section with `docker compose up -d`. | Resolved |

## 10. Partially Resolved Issues

| Issue | Progress made | What still remains | Risk |
|---|---|---|---|
| Docker onboarding | `miv/compose.yaml` starts frontend and Postgres; entrypoint automates Prisma generate/migrate. | No root Compose file orchestrates frontend and backend together; `docker compose up -d` was not runtime-validated. | Medium |
| Mobile foundation | Mobile primitives and mobile-aware APIs exist. | Viewport disables zoom; layouts/features are not mobile-complete; no mobile tests. | High |
| Test pages exposure | Manual test pages moved out of `app`. | Seed/test API routes remain under `app/api`. | High |
| Environment safety | Frontend env files are ignored and `.env.example` exists. | Backend env and uploaded files are tracked; credential rotation remains recommended. | Critical |
| Package manager consistency | Frontend active lockfile/Docker path is npm-only. | `scripts/check-setup.mjs` still expects pnpm and fails; backend still has npm and pnpm lockfiles. | Medium |
| Backend integration | Frontend rewrite centralizes `/backend/:path*` target. | Auth/API source of truth remains split between local Next API, NextAuth, and backend Payload/CMS APIs. | High |
| Production readiness | Frontend Docker dev path exists. | Production image behavior, backend production Docker, health checks, and full-stack deployment are unverified. | High |

## 11. Unresolved Issues

| Priority | Issue | Evidence | Impact | Recommended next action |
|---|---|---|---|---|
| P0 | Backend secrets and artifacts are tracked | `git ls-files` includes `miv-backend/.env` and uploaded files. | Credential exposure and repository data leakage risk. | Remove tracked env/uploads, rotate credentials, and scrub history if required. |
| P0 | API authorization is inconsistent | Middleware excludes `/api`; many route handlers have commented auth checks or no auth checks. | Seed, mutation, and data APIs may be reachable without authorization. | Define a single auth/role guard and apply it to API routes. |
| P1 | No root full-stack Compose | Only `miv/compose.yaml` and `miv-backend/docker-compose.yml` exist. | New developers must coordinate services manually. | Add a root Compose file or documented orchestration wrapper. |
| P1 | Package-manager checks contradict current npm frontend | `package-lock.json` is active, but `scripts/check-setup.mjs` requires pnpm and fails. | Onboarding check gives false failures. | Update setup check for npm or explicitly restore pnpm and lockfile. |
| P1 | Mobile accessibility blockers | Viewport disables zoom; scrollbars are hidden globally. | Mobile and accessibility compliance problems. | Allow zoom and revise scrollbar policy. |
| P1 | Auth source of truth is split | NextAuth, `payload-token`, `/backend` cookies, and dev bypasses coexist. | Auth bugs, confusing onboarding, and security gaps. | Choose canonical auth/session flow and remove bypasses from production path. |
| P1 | Seed/test APIs remain active | `app/api/seed-*`, `test-db`, `test-sprint2`, and `auth/set-password` remain under `app/api`. | Dangerous mutation/debug endpoints can survive deployment. | Gate behind development-only checks or remove from production builds. |
| P2 | Frontend README is partly stale | README badges and architecture claims conflict with package/config evidence. | Onboarding confusion and inaccurate architecture expectations. | Rewrite README around current Docker/npm/App Router state. |
| P2 | Production Docker is not proven | Frontend Dockerfile is development-oriented; backend Dockerfile requires standalone output. | Deployment assumptions may fail. | Add production build validation and health checks. |
| P2 | Backend lockfiles are duplicated | `miv-backend/package-lock.json` and `miv-backend/pnpm-lock.yaml` are tracked. | Backend install path ambiguity. | Pick one backend package manager. |
| P2 | Next/eslint version mismatch | Frontend `next` is `^16.2.1`; `eslint-config-next` is `15.2.4`. | Lint/build compatibility risk. | Align Next and eslint-config-next versions. |
| P3 | Archived pages may rot | Manual test pages are archived but not documented as runnable/non-runnable. | Future confusion. | Add archive README or delete once no longer useful. |

## 12. ISSUES.md Reconciliation

`ISSUES.md` could not be reconciled because it is absent from this repository checkout.

| Relevant issue | Reconciliation status | Evidence |
|---|---|---|
| Dashboard route organization | Resolved | Route groups now exist under `miv/app/dashboard`. |
| Standalone Venture Intake route | Resolved | No `miv/app/venture-intake`; canonical route is `/dashboard/venture-intake`. |
| Manual test pages exposed as app routes | Resolved | Pages are under `miv/archive/manual-test-pages`. |
| Duplicate frontend lockfiles | Resolved | Only `miv/package-lock.json` exists. |
| Duplicate frontend Next config | Resolved | Only `miv/next.config.ts` exists. |
| Platform-specific frontend install script | Resolved | No `postinstall`; no `scripts/install-lightningcss.js`. |
| Frontend tracked `.env` | Resolved | No tracked `miv/.env`; `.gitignore` ignores env files. |
| Docker frontend onboarding | Partially resolved | Compose config exists and passed config validation; runtime startup not run. |
| Root Docker orchestration | Still open | No root `compose.yaml` or `docker-compose.yml`. |
| Backend hygiene | Still open | Backend `.env` and uploads are tracked. |
| Mobile readiness | Partially resolved | Mobile primitives exist; zoom, mobile layout completion, and tests remain open. |
| API/auth safety | Still open | API routes are outside middleware and many auth checks are disabled. |
| Package/config consistency | Partially resolved | Frontend lockfile/config duplicates resolved; setup script still expects pnpm. |

## 13. Docker and Deployment Status

| Area | Current status |
|---|---|
| Frontend development Docker | Present in `miv`; config validation passed. Starts frontend and Postgres by definition. |
| Backend Docker | Present in `miv-backend`, with its own `docker-compose.yml` and Dockerfile. Not integrated with frontend Compose. |
| Root Compose status | Missing. No root full-stack Compose file was found. |
| Production frontend Docker readiness | Not proven. Current frontend Dockerfile is development-oriented and runs `npm run dev`. |
| Production backend Docker readiness | Not proven. Backend Dockerfile comments require `output: 'standalone'`; backend `next.config.mjs` was not validated here. |
| Vercel compatibility | Likely for the Next frontend in principle, but not validated. Local Docker defaults and Prisma migrations assume container/Postgres workflow. |
| Database persistence | Frontend Compose uses named Postgres volume `vpms_postgres_data`; backend Compose uses Mongo and Postgres volumes. |
| Health checks | Frontend Compose has a Postgres health check only; no frontend HTTP health check. Backend Compose does not define service health checks. |
| Hot reload | Frontend Compose bind-mounts source and runs `next dev`, so hot reload is intended. Not runtime-validated. |
| Production build status | Not run during this task. |

Do not confuse frontend development Docker readiness with production readiness. The current frontend Docker path is useful for local onboarding, not a proven production deployment artifact.

## 14. Recommended Next Steps

1. Fix remaining onboarding blockers: update `scripts/check-setup.mjs` to match npm/package-lock or deliberately restore pnpm across frontend docs, Docker, lockfile, and scripts.
2. Add root Docker Compose orchestration for `miv`, `miv-backend`, Postgres, Mongo, and any required admin tools, or explicitly document that services are started separately.
3. Decide the authentication/API source of truth: NextAuth/local API, Payload backend, or a clearly bounded hybrid. Remove development bypasses from production paths and apply route-level API authorization.
4. Complete the mobile shell: allow zoom, remove harmful global scrollbar hiding, add a shared device-view hook or breakpoint utility, and apply the mobile shell to both admin and founder layouts.
5. Implement the first true mobile feature flow, preferably a small high-value founder workflow or venture list/intake flow, using the mobile component foundation.
6. Add mobile regression tests with explicit viewport coverage for shell, navigation, and the first mobile feature.
7. Lock down or remove dangerous test/seed APIs, including seed endpoints, test endpoints, and password setup endpoints.
8. Clean backend repository hygiene: untrack env/uploads, rotate exposed credentials, align backend package manager, and update backend `.env.example` to placeholders.
9. Validate production builds and decide whether frontend production deploys through Vercel, Docker, or both.

## 15. Validation Evidence

| Command or check | Result | Evidence |
|---|---|---|
| `Get-Content MIV_ARCHITECTURE.md` | Passed | Existing report read before rewrite. |
| `Get-Content ISSUES.md` | Failed | File not found at root. |
| `rg --files -g 'ISSUES.md' -g '*ISSUES*'` | Failed / not found | No issue tracker file found. |
| `rg --files miv` | Passed | Current frontend source tree inspected. |
| `git ls-files -- miv/.env ...` | Passed | Frontend env/local artifacts not tracked; backend tracked artifacts separately checked. |
| `docker compose config` from `miv` | Passed with warning | Compose graph rendered; Docker warned it could not read user Docker config due access denied. |
| `docker compose up -d` from `miv` | Not run | Runtime startup not validated. |
| `docker compose build` from `miv` | Not run | Image build not validated. |
| Container health checks | Not run | No containers started in this task. |
| Route verification in browser | Not run | No dev server started. |
| `npm run check:setup` | Failed | PowerShell execution policy blocked `npm.ps1`. |
| `npm.cmd run check:setup` | Failed | Script still expects pnpm, `pnpm-lock.yaml`, absent `package-lock.json`, local `.env`, and local binaries. |
| `npm run typecheck` | Failed | PowerShell execution policy blocked `npm.ps1`. |
| `npm.cmd run typecheck` | Failed | `tsc` was not found on PATH through local dependencies. |
| `npm install` / `npm ci` | Not run | Dependency installation was not requested and would change local dependency state. |
| `npm run build` | Not run | Dependencies/typecheck unavailable. |

## 16. Final Status Summary

- Resolved issues: 9
- Partially resolved issues: 7
- Unresolved P0 issues: 2
- Unresolved P1 issues: 5
- Mobile readiness status: Partial, with accessibility and feature-level blockers.
- Docker onboarding status: Frontend development Docker is partially validated by config; full runtime and root full-stack onboarding are not validated.

Sections rewritten: all sections were rebuilt from current source evidence.

Outdated claims removed: flat dashboard route map, active public manual test pages, duplicate frontend lockfiles/configs, tracked frontend `.env`, platform-specific frontend install script, and claims that did not match current Docker/npm state.

Areas that could not be verified: missing `ISSUES.md`, runtime Docker startup, production builds, browser route behavior, container health, and live backend/frontend integration.
