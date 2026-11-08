# React Rsbuild + Kibo UI Boilerplate

A production-ready React starter powered by [Rsbuild](https://rsbuild.rs) and [Kibo UI](https://www.kibo-ui.com) — combining Rust-based build tooling with advanced UI components for dashboards, project management, and data-heavy applications.

## Stack

- **React 19** — UI library
- **Rsbuild** — Rust-powered build tool (SWC compilation, fast refresh)
- **Kibo UI** — Advanced components built on shadcn/ui (kanban, calendar, editor, gantt, etc.)
- **shadcn/ui** — Radix + Tailwind component primitives
- **TypeScript** — Strict mode with path aliases (`@/`)
- **TanStack Router** — File-based, type-safe routing with auto code splitting
- **TanStack Query** — Server state management and caching
- **TanStack Table** — Headless data table with sorting, filtering, pagination
- **Zustand** — Client state management
- **Tailwind CSS** — Utility-first styling with dark mode
- **TanStack Charts** — Typed chart grammar with SVG rendering
- **dnd-kit** — Drag and drop (for kanban boards)
- **date-fns + React Day Picker** — Date utilities and date picker
- **React Hook Form + Zod** — Form handling and validation
- **Axios** — HTTP client with JWT interceptors
- **Hey API** — Generated OpenAPI client, Zod schemas, and TanStack Query helpers
- **Vitest** — Existing component and utility checks (no new unit tests; see [docs/testing.md](./docs/testing.md))
- **Sonner** — Toast notifications

## Quick Start

```bash
# install dependencies
bun install

# start dev server
bun run dev

# production build
bun run build
```

## Adding Kibo UI Components

Kibo UI components are added via CLI — they get copied into your project (same model as shadcn/ui):

```bash
# Add individual components
bunx kibo-ui add kanban
bunx kibo-ui add calendar
bunx kibo-ui add editor
bunx kibo-ui add gantt
bunx kibo-ui add list

# Or via shadcn CLI with registry
bunx shadcn add kanban --registry https://www.kibo-ui.com/registry
```

Available components: kanban, calendar, gantt, editor, table, list, avatar-stack, code-block, color-picker, credit-card, dropzone, image-crop, marquee, qr-code, rating, spinner, stories, tags, ticker, tree, video-player, and [many more](https://www.kibo-ui.com/docs).

## Workflow

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening an issue or a PR. Work
is sized S/M/L and ordered in waves; an L issue is split into S and M specs
before an agent claims it.

- [docs/architecture.md](./docs/architecture.md) — module boundaries, state
  ownership, and the dependency rule.
- [docs/product/journeys.md](./docs/product/journeys.md) — user stories, their
  routes, and their planned Playwright tests.
- [tasks/specs/README.md](./tasks/specs/README.md) — the agent-run spec format.
- [docs/testing.md](./docs/testing.md) — smoke and journey testing policy.

## Scripts

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `bun run dev`           | Start dev server on port 3000            |
| `bun run build`         | Production build                         |
| `bun run preview`       | Preview production build                 |
| `bun run lint`          | Run Oxlint                               |
| `bun run lint:strict`   | Run Oxlint with warnings denied          |
| `bun run lint:fix`      | Apply Oxlint fixes                       |
| `bun run api:generate`  | Regenerate the OpenAPI client            |
| `bun run api:check`     | Fail on generated client drift           |
| `bun run format`        | Format the repository with Oxfmt         |
| `bun run format:check`  | Check formatting with Oxfmt              |
| `bun run doctor`        | Run pinned React Doctor, blocking errors |
| `bun run typecheck`     | TypeScript type checking                 |
| `bun run test`          | Run tests                                |
| `bun run test:watch`    | Run tests in watch mode                  |
| `bun run test:coverage` | Tests with coverage report               |
| `bun run check`         | Run typecheck + lint + test              |

## Project Structure

```
docs/                 # Architecture, journeys, and testing policy
tasks/specs/          # agent-run specs and their template
.github/              # Issue and PR templates
src/
├── api/              # Generated OpenAPI client and app-facing services
├── components/
│   ├── charts/       # TanStack Charts theme and example surface
│   ├── examples/     # Example components (data table, stats cards)
│   ├── layouts/      # Page layouts (MainLayout)
│   ├── shared/       # Shared components (ThemeToggle)
│   └── ui/           # shadcn/ui + Kibo UI primitives
├── config/           # App configuration (env vars)
├── hooks/            # Custom React hooks
├── lib/              # Utilities (cn, store)
├── routes/           # TanStack Router file-based routes
├── test/             # Test setup and utilities
└── types/            # TypeScript type definitions
```

## Authentication

Use the Django Ninja boilerplate API. Set `PUBLIC_API_URL` to its API prefix,
for example `http://localhost:8000/api`. Run Rsbuild with
`bun --bun run dev` or `bun --bun run build` to use your Bun runtime.

The API client is generated from `backend/docs/openapi/openapi.json` into
`src/api/generated` with `bun run api:generate`. Point `OPENAPI_SPEC` at a live
backend contract (for example `../backend/docs/openapi/openapi.json`) in a
mattstack monorepo; standalone, the vendored fixture keeps the app building
before a backend exists. `bun run api:check` fails when the committed output
drifts and runs in the gauntlet. The generated SDK uses the shared axios
instance from `src/api/client-config.ts`, so the JWT interceptors still apply.
Endpoint modules in `src/api/` map backend token names to the store and leave
URLs and payloads to the generated operations.

The login form calls `POST /auth/login` with `email` and `password`.
The API returns `{ token, refresh, user }`; the client maps those tokens to
`accessToken` and `refreshToken`. Registration uses `/auth/signup`, then
login. It uses your email as the required username, so keep it within the
backend's 100-character username limit.

The store and transport share `auth_token:v1` and `refresh_token:v1`.
Initialization calls `GET /auth/me`; it does not trust a cached user.
A protected request with an invalid access token refreshes once through
`POST /token/refresh` with `{ refresh }`, then repeats the request.
Concurrent requests share the refresh. Refresh failure clears the session.

Select **Sign Out** to send the current refresh token to `/auth/logout`.
The backend blacklists it. The client clears local tokens even if server
logout fails and reports that failure instead of claiming server success.
Passwordless requests use `/auth/passwordless/login/request` and
`/auth/passwordless/login/verify`.

The real auth store does not use `src/mock-api`. Example dashboard task data
remain demonstration data; do not treat them as an authenticated task API.

## Dev proxy

The dev server proxies `/api`, `/admin`, `/static/admin`, and `/media` to
`API_PROXY_TARGET` (default `http://localhost:8000`) so backend requests share
the app's origin. Point it at the backend container when running in Docker:

```bash
API_PROXY_TARGET=http://api-dev:8000 bun run dev
```

Each route sets `changeOrigin: true`, so Django receives the target's host as
the `Host` header (`api-dev:8000` in this example). Add that name to the
backend's `ALLOWED_HOSTS`; otherwise Django answers `400 DisallowedHost`. The
proxy belongs to the dev server only, not the static nginx production image.

The table example keeps React Compiler disabled with `use no memo` because
TanStack Table exposes a mutable API. Keep sorting, filtering, visibility, and
pagination inside that uncompiled component.

## Make it your own

The landing page is an editable product workspace composition, not a finished
product. [DESIGN.md](./DESIGN.md) is the authoritative repository-local guide
for applying a new visual design, including the source edit map, brief, ordered
workflow, and verification commands. All Kibo examples and application routes remain
available. Oxlint and Oxfmt use repository-root configurations; generated
route trees, coverage, and build output are excluded.
Install the recommended Oxc VS Code extension to use the checked-in formatter
and explicit fix-on-save integration. Use a supported Node runtime for React
Doctor (see [DEPENDENCIES.md](./DEPENDENCIES.md)); the CLI's IPC worker cannot
run with forced Bun execution.

## Why Rsbuild + Kibo UI?

- **Rsbuild**: Dev/prod parity with Rspack, SWC everywhere, webpack plugin compat
- **Kibo UI**: Production-ready complex components (kanban, calendar, gantt, editor) that shadcn/ui doesn't cover — same copy-paste model, fully customizable

## Docker

```bash
docker compose up -d
```

## License

MIT
