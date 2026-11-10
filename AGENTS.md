# AGENTS.md

Single source of agent instructions for this repository. Read this file before
changing anything; `CLAUDE.md` only imports it. A nested `AGENTS.md` wins for
the files around it, and this repository has none.

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
- `src/api/` — generated OpenAPI client plus app services; `src/api/client.ts` is the only Axios import.
- `src/hooks/queries/`, `src/hooks/mutations/` — TanStack Query hooks.
- `src/lib/store/` — Zustand slices; `src/forms/` — react-hook-form plus zod.
- `src/components/ui/` — copied shadcn and Kibo primitives; `src/components/` — app composition.
- `docs/`, `tasks/specs/`, `scripts/` — documentation, agent-run specs, and gates.

## Commands

Requires Node `^20.19.0 || >=22.13.0` and Bun 1.3 or newer. Run from the
repository root. The [Makefile](Makefile) exposes the same targets as
`make <target>`.

```bash
bun install              # install exact versions from bun.lock
bun run dev              # dev server on port 3000; proxies /api to API_PROXY_TARGET
bun run build            # production build
bun run preview          # serve the production build
bun run lint:fix         # Oxlint auto-fix
bun run format           # Oxfmt
bun run api:generate     # regenerate src/api/generated from the OpenAPI contract
bunx kibo-ui add <name>  # copy in a Kibo UI component (needs network)
```

`bun run api:generate` rewrites `src/api/generated/` from the vendored
`backend/docs/openapi/openapi.json`; set `OPENAPI_SPEC` to use another
contract. Full script list: [README.md](README.md#scripts).

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
worker fails under Bun. `bun run test` runs the existing Vitest suite; read the
testing policy before touching tests.

## Code standards

- Reuse the existing pattern: open the nearest route, hook, service, form, or
  slice before adding one. A second convention is a defect.
- Respect the dependency rule and state ownership in
  [docs/architecture.md](docs/architecture.md). Routes and components call
  hooks and services, never Axios directly. Do not mirror query data into
  Zustand.
- Use the `@/` alias for `src/`. Read the environment only through
  `src/config/env.ts`; client-visible variables use the `PUBLIC_` prefix.
- Generated files are never hand-edited: `src/routeTree.gen.ts` and
  `src/api/generated/`. Regenerate them and commit the result.
- Keep copied primitives in `src/components/ui/` upstream-shaped; add a variant
  or a composition instead of editing the primitive.
- Visual changes start in [DESIGN.md](DESIGN.md). Preserve the system-default
  appearance and the shared two-way theme toggle.
- Forms use react-hook-form plus a zod schema in `src/forms/`; a route does not
  own field rules.
- The conventions gate rejects `as any`, `@ts-ignore`, `console.log`,
  `window.location.href`, raw `fetch` or Axios outside `src/api/`, `useState`
  for forms, and components over 300 lines. Fix the cause, not the rule.

## Testing policy

Authority: [docs/testing.md](docs/testing.md). Two kinds of tests only: a
Playwright smoke test and one Playwright journey test per journey. Never add or
extend unit tests, and do not touch the existing Vitest suite. The Playwright
harness does not exist yet; never claim a browser or e2e result you did not
observe.

## Git and commits

- Branch lanes and PR flow: [CONTRIBUTING.md](CONTRIBUTING.md).
- Conventional Commits: `<type>(<scope>): <Capitalized imperative summary>`.
  Keep the subject at 50 characters or fewer and wrap the body at 72. The body
  explains why.
- Name the issue in the body: `Closes #N` when the commit finishes it, `Refs #N`
  otherwise. Make small commits, one per component or step.
- Stage explicit paths. Leave `git status` clean; never commit `dist/`,
  `.rsbuild/`, `node_modules/`, or generated output you did not regenerate.

## Spec workflow (agent-run)

- Format: [tasks/specs/README.md](tasks/specs/README.md) and
  [tasks/specs/TEMPLATE.md](tasks/specs/TEMPLATE.md). A READY spec is the
  contract; do not redesign it in the executor session.
- `Files owned` is the allowlist. Change no path outside it; the agent-run gate
  rejects one.
- Claim a spec only when its Status is `READY`, its dependencies are merged,
  and no claimed spec owns the same files. Record `IN PROGRESS (local)` or
  `BLOCKED-*` before you change its files; the specs README defines each value.
- Verify with the spec's commands plus the gates above, and report only results
  you ran.
- Limits: a component spec changes at most 8 files and 300 lines; a batch spec
  at most 20 files and 2,000 lines in one area (routes/UI, data/auth, or
  tooling/docs).
- The gate runs the static checks and build, then the smoke and Playwright
  journeys that cover the changed files. agent-run writes `Closes #N` into the
  PR.

## Security

- Never commit secrets, tokens, credentials, or `.env` files. `.env.example`
  documents the variables; `.env.local` stays local.
- Dependencies are exact and documented in
  [DEPENDENCIES.md](DEPENDENCIES.md). Add with `bun add pkg@x.y.z`, never
  `bun add pkg`, and never reintroduce `^` or `~`. Keep `bun.lock` committed.
- Do not weaken a gate to make a change pass: no new `@ts-ignore`, no new
  React Doctor ignore entry, no skipped check.
- Report a vulnerability to the owner privately, not in a public issue.
