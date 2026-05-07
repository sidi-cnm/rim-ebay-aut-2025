# rim-ebay — Agent Guide

## Quick start

```bash
bun install
bun dev              # next dev --turbopack (uses .env, requires MongoDB)
bun check-types      # tsc --noEmit
bun test:e2e         # playwright test (starts dev server automatically)
bun run mongo:init        # initialize MongoDB collections/indexes
bun run mongo:migrate     # run data migrations
```

## Known gotchas

- **Middleware**: Must be `middleware.ts` at root for Next.js to load it. Currently at `proxy.ts` — rename before expecting i18n routing or auth guard to work.
- **`.env`** is active (committed with secrets). Template is `.env.exemple` (note the misspelling — not `.example`).
- **Turbopack** is the default dev mode (`--turbopack`). Stops `tsc --noEmit` from catching some errors — always run `check-types` as a separate step.
- **bun only**. Do not use npm or yarn. Lockfile is `bun.lock`.

## Architecture

- **Next.js 16 App Router** with `[locale]` dynamic segment (`ar` default, `fr`).
- **MongoDB** (primary DB via native driver, cached singleton in `lib/mongodb.ts`). **Turso/libSQL** and **SQLite** for options/lieux data (categories, locations).
- **i18n**: next-international. Server: `locales/server.ts`, client: `locales/client.ts`. Translations in `locales/translations/{fr,ar}.ts`.

### Code conventions

1. **Handler pattern** per feature: `x.interface.ts` / `x.mocked.ts` / `x.real.ts` / `x.ts` / `data.json`
2. **Page split**: `page.tsx` = server component, `ui.tsx` = client component
3. **Read from data files** (performance), **write via API routes** (`route.ts`, security)
4. **Mock-first**: complete mocked version before production version
5. **Packages** under `packages/` are imported via relative paths (no npm workspace linkage)

### Routes

| Path | Purpose |
|------|---------|
| `app/[locale]/` | Public pages (home, about, annonces, users) |
| `app/[locale]/my/` | User dashboard (add/list/details/favorite) |
| `app/[locale]/p/` | Public auth pages (login, register, password reset) |
| `app/api/` | API routes (annonces, auth, mail, search, etc.) |
| `app/[locale]/p/api/` | Additional API routes (tursor, sqlite, search, telegram) |

### Auth

JWT in cookie (`jwt`), verified by `utiles/getUserFomCookies.ts` using `jose`. Middleware guards `/my` and `/admin` routes. Passwords via bcryptjs. OTP verification, Resend email (MailHog fallback in dev).

### Dev environment

- **Docker**: MongoDB + MailHog (SMTP 1025, UI 8025)
- **Chinguisoft API**: phone number validation (requires valid `.env` keys)
- **VS Code**: debug launch config uses `bun run dev`
- **Playwright**: browsers = Chromium + Firefox + WebKit, base URL `http://localhost:3000`

## Testing

```bash
bun test:e2e              # headless
bun test:e2e:ui           # with Playwright UI mode
```

Tests are in `tests/` and `e2e/`. No unit tests — E2E only.

## Type system

- Shared types: `packages/mytypes/types.ts`
- `tsconfig.json`: strict, ESNext module, bundler resolution, noEmit
- Shared TS configs: `packages/typescript-config/`
