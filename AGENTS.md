# AGENTS.md

Telegram Mini App for gym training management (masters manage gymmers' workouts). React Router v7 SPA, Bun, FSD v2.1, antd v5.

## Commands

Run everything with **bun** (`bun run <script>`), even though the README shows `npm` — `bun.lock` is the lockfile and `package.json` scripts call `bun`/`bunx` internally.

| Command | Notes |
| --- | --- |
| `bun run dev` | port 3000, `host: true` |
| `bun test` | **there is no `test` script.** Tests import from `bun:test` and live next to the code as `*.test.ts` |
| `bun run lint` | **fails on a clean checkout** — see below |
| `bun run type-check` | `react-router typegen && tsc` |
| `bun run api:extract` | regenerates the API client; see below |
| `bun run build` / `bun run start` | output `build/client`; `start` static-serves it |

### Lint is red at HEAD

`lint` uses `--max-warnings 0` and a clean tree produces **31 warnings / 0 errors** → exit code 1. Do not assume you caused it. Gate on the error count and on whether your files added new warnings; don't try to "fix" unrelated pre-existing ones unless asked.

### Typecheck

`bun run type-check`, never bare `tsc` — `.react-router/types` is generated and gitignored, so bare `tsc` reports bogus route-type errors. Never hand-edit `.react-router/`.

### API client is generated

`src/shared/api/model/endpoints.ts` is codegen output from `${APP_API_BASE_URL}/openapi.json` via `swagger-typescript-api`. Never edit it by hand; run `bun run api:extract` after backend changes. The script reads `process.env.APP_API_BASE_URL`, so it only works under `bun run` (bun auto-loads `.env`); `npm run api:extract` yields `undefined/openapi.json`.

Build output is an SPA — whatever serves `build/client` needs a catch-all `/*` → `/index.html` 200 rewrite. (`netlify.toml` with that rewrite existed at HEAD but is deleted in the current working tree.)

## Environment

- `vite.config.ts` sets `envPrefix: 'APP_'`. Only `APP_*` vars reach the client, accessed as `import.meta.env.APP_*`. Prefix any new client-side var accordingly.
- `.env` **is tracked in git** (not gitignored) and currently holds `APP_API_BASE_URL`, `APP_LOCAL_STORAGE_KEY`. Add new vars there as well.
- `import.meta.env.APP_LOCAL_STORAGE_KEY` namespaces the app's localStorage keys (`src/shared/lib/hooks/use-local-storage.ts`).

## Architecture

FSD layers: `app/ pages/ widgets/ features/ entities/ shared/`, plus a repo-specific `processes/` layer (e.g. `NavigationListener`).

An official FSD v2.1 skill is vendored at `.agents/skills/feature-sliced-design/`. Load it for placement/import-boundary decisions instead of guessing from filenames.

- `@/` → `src/` (configured in both `vite.config.ts` and `tsconfig.json`); use it rather than long relative paths.
- **Routing is code-based, not file-based.** `src/app/routes.ts` maps paths to files in `src/pages/*.tsx` (flat, no per-page folders). A new page is not routed until added there.
- `ssr: false` — no server rendering. Don't reach for SSR-only APIs or write loaders that assume a server.
- `src/app/entry.client.tsx` awaits `initTgMiniApp()` **before** hydrating; if it rejects, the app renders only an "unsupported environment" message.
- `src/app/root.tsx` exports `unstable_clientMiddleware` (auth gate). `withProviders` in `src/app/providers/index.ts` passes `compose(withI18n, withTheme, withViewer, withAuth)`, which resolves to `withI18n(withTheme(withViewer(withAuth(Component))))` — `withI18n` is the outermost wrapper, `withAuth` the innermost, so auth gating sits closest to the tree it guards.

### Conventions

- Slice public API: `index.ts` does `export * from './lib'` plus `export * as <name>Model from './model'`. Consumers import from `@/entities/<slice>` or `@/shared/api`, never from a slice's inner path.
- **Telegram back button:** every screen that should read as "root" must `export const handle: RouteHandle = { root: true };`. `NavigationListener` reads the deepest match's `handle.root`; a new root-level page without it shows a back button that goes nowhere. `RouteHandle` is globally augmented in `src/shared/lib/router/router.types.d.ts`.
- **i18n is runtime-fetched.** Keys live in `public/locales/ru.json` and `en.json` — update both; supported languages are listed in `public/locales/languages.json`, default `ru`. No hardcoded user-facing strings.
- Use the `Api` singleton from `@/shared/api` (`setSecurityData` injects the bearer token). Never construct a second client.
- Auth state is a module-level store in `src/shared/lib/auth/auth-service.ts` read via `useSyncExternalStore`. `404` → `consent_required`, `403` → `forbidden`; `completeSignup()` then `revalidate()`.
- Outside real Telegram, dev mocks the Telegram env (`mock-env.client.ts`) and auth hits `/auth/dev/*`. Dev-mode auth is therefore fake — don't use it to verify real API behavior.
- Permission-gated UI goes through `useWorkoutPermissions` / `useExercisePermissions`. New interactive controls on a workout must respect these.
- UI: antd v5 (`ConfigProvider` + `BASE_THEME_CONFIG`, spacing via `useSpacing`) alongside `@phosphor-icons/react`. `@ant-design/icons` survives in exactly one file — prefer Phosphor.
- `LocalUpperCase` and `DeepPartial` are ambient globals from `src/types/global.d.ts` — use without importing.
- ESLint uses the legacy `.eslintrc.cjs` (ESLint 8). Don't add a flat `eslint.config.js`.