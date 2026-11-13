# AGENTS.md

Rules for this frontend package only: the package manager, the dev, build, and
test commands, the generated API client, and the Playwright journey tests. In a
mattstack checkout this file is `frontend/AGENTS.md` and the repository root
`AGENTS.md` owns global policy; the nearest file wins. This is the only agent
instruction file: do not add a `CLAUDE.md` or another harness adapter.

## Project overview

React 19 single-page application. Rsbuild compiles it, TanStack Router owns the
URL, TanStack Query owns server state, Zustand owns cross-route client state,
and Tailwind with shadcn/ui and Kibo UI render the interface. The app is a
client of the Django Ninja boilerplate API: it owns presentation, routing,
browser state, and transport, not server code or business rules.

- Stack, setup, and scripts: [README.md](README.md)
- Module boundaries, state ownership, dependency rule: [docs/architecture.md](docs/architecture.md)
- Visual design authority: [DESIGN.md](DESIGN.md)
- User stories and journeys: [docs/product/journeys.md](docs/product/journeys.md)
- Testing policy: [docs/testing.md](docs/testing.md)
- Dependency ledger: [DEPENDENCIES.md](DEPENDENCIES.md)
- Contributor workflow, waves, review, and merge: [CONTRIBUTING.md](CONTRIBUTING.md)

### Layout

- `src/routes/` — file-based TanStack routes; `src/routeTree.gen.ts` is generated.
- `src/api/` — generated OpenAPI client plus app services; `src/api/client-config.ts` is the only Axios import.
- `src/hooks/queries/`, `src/hooks/mutations/` — TanStack Query hooks.
- `src/lib/store/` — Zustand slices; `src/forms/` — react-hook-form plus zod.
- `src/components/ui/` — copied shadcn and Kibo primitives; `src/components/` — app composition.
- `docs/`, `tasks/specs/`, `scripts/` — documentation, agent-run specs, and gates.

## Commands

Requires Node `^20.19.0 || >=22.13.0` and Bun 1.3 or newer. Run from the
repository root with Bun; do not use npm, yarn, or pnpm. The [Makefile](Makefile)
wraps the same scripts; `make help` lists the targets.

```bash
bun install              # install exact versions from bun.lock
bun run dev              # dev server on port 3000; proxies /api to API_PROXY_TARGET
bun run build            # production build
bun run preview          # serve the production build
bun run test             # existing Vitest suite
bun run test:e2e         # Playwright journeys against the built app
bun run lint:fix         # Oxlint auto-fix
bun run format           # Oxfmt
bun run api:generate     # regenerate src/api/generated from the OpenAPI contract
bunx kibo-ui add <name>  # copy in a Kibo UI component (needs network)
```

`bun run test:e2e` starts `bun run preview` on port 3000, so run `bun run build`
first. Full script list: [README.md](README.md#scripts).

### Verify

Run every gate that covers the change before you stop:

```bash
bun run format:check
bun run lint:strict
bun run typecheck
bun run build
bun run check-conventions
bun run check-dependencies
bun run check-agent-docs
bun run api:check
bun run doctor
```

`bun run doctor` must run under Node, not `bun --bun run doctor`; its IPC
worker fails under Bun.

## Generated API client

- The client is generated from the vendored `backend/docs/openapi/openapi.json`
  into `src/api/generated`; set `OPENAPI_SPEC` to use another contract.
- `bun run api:generate` rewrites the generated tree and `bun run api:check`
  fails on drift. Regenerate and commit the output; never hand-edit
  `src/api/generated/` or `src/routeTree.gen.ts`.
- The generated SDK uses the shared Axios instance from
  `src/api/client-config.ts`, so the JWT interceptors still apply. Routes and
  components call hooks and service modules, never Axios.
- Endpoint modules in `src/api/` map backend token names to the store and leave
  URLs and payloads to the generated operations.

## Code standards

- Reuse the existing pattern: open the nearest route, hook, service, form, or
  slice before adding one. A second convention is a defect.
- Respect the dependency rule and state ownership in
  [docs/architecture.md](docs/architecture.md).
- Use the `@/` alias for `src/`. Read the environment only through
  `src/config/env.ts`; client-visible variables use the `PUBLIC_` prefix.
- Keep copied primitives in `src/components/ui/` upstream-shaped; add a variant
  or a composition instead of editing the primitive.
- Visual changes start in [DESIGN.md](DESIGN.md). Preserve the system-default
  appearance and the shared two-way theme toggle.
- Forms use react-hook-form plus a zod schema in `src/forms/`; a route does not
  own field rules.
- The conventions gate rejects `as any`, `@ts-ignore`, `console.log`,
  `window.location.href`, raw `fetch` or Axios outside `src/api/`, `useState`
  for forms, and components over 300 lines. Fix the cause, not the rule.

## Testing and journeys

Authority: [docs/testing.md](docs/testing.md). Two kinds of tests only: a
Playwright smoke test and one Playwright journey test per journey. Never add or
extend unit tests, and do not touch the existing Vitest suite.

The Playwright harness ships [playwright.config.ts](playwright.config.ts):
`testDir: 'e2e'`, Chromium, and `list` plus `json` reporters writing
`test-results/journeys.json`. The suite is empty until W5 adds the specs;
`bun run test:e2e` passes `--pass-with-no-tests`, so an empty suite does not
fail. Never claim a browser or e2e result you did not observe.

Journey tests follow one convention so the backend JOURNEYS gate can map step
results:

- One test per journey, tagged with its journey ID: `test('...', { tag: '@J-001' }, ...)`.
- Each step is a `test.step` whose title starts with the step ID:
  `test.step('J-001-S1: create an account', ...)`. Do not write a test per step.
- A step is verified only by a passing step in the JSON report. A test without
  step titles may carry step tags instead; the test's result then covers them.

```ts
test('visitor signs up and signs in', { tag: '@J-001' }, async ({ page }) => {
  await test.step('J-001-S1: create an account', async () => {
    // ...
  })
  await test.step('J-001-S2: sign in', async () => {
    // ...
  })
})
```

[docs/product/journeys.md](docs/product/journeys.md) names every journey and
its planned spec file.
