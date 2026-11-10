# Testing

Testing stays minimal on purpose. Two kinds of tests prove that the app works,
and nothing else is added:

| Kind                      | What it proves                                                                             | Where                    | When it is written                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------ | ------------------------ | ---------------------------------------------------------------------------------- |
| Smoke test (Playwright)   | The production build boots and every journey's entry route renders without a console error | `e2e/smoke.spec.ts`      | Testing wave (W5), with the Playwright harness                                     |
| Journey test (Playwright) | One user journey works in a real browser                                                   | `e2e/jNN-<name>.spec.ts` | The testing wave, or the wave that ships the journey if the harness already exists |

[docs/product/journeys.md](product/journeys.md) names every journey (J-01 to
J-08) and its planned Playwright test. The Django Ninja boilerplate owns its
backend smoke tests; this repository owns the browser smoke test and the
journeys.

## Rules

- Do not add unit tests for features, wiring, schemas, helpers, or components.
  A feature proves itself through its journey test and the verification
  commands in its spec.
- Do not add tests in an agent-run spec, except in the W5 testing batch.
  Outside W5, a spec never lists a test file in `Files owned`, so the gate
  rejects a test an executor adds.
- The existing Vitest tests stay as they are. Do not extend them. They cover
  the button primitive and the dev proxy.
- A bug fix may add one smoke test that reproduces the bug, if no journey test
  covers it.
- A journey marked "demo" in `docs/product/journeys.md` is tested against the
  demo data, not a server. A journey that needs the API starts the Django Ninja
  backend and points `PUBLIC_API_URL` at it.

## Until the Playwright harness lands

The repository has no Playwright dependency or `e2e/` directory yet. The paths
above are the contract for W5; do not create a test file without the harness.

A change is verified today with the commands that exist:

```bash
bun run format:check
bun run lint:strict
bun run typecheck
bun run build
bun run check-conventions
bun run check-dependencies
bun run check-agent-docs
bun run doctor
```

Then exercise the changed route in a browser with `bun run dev` or
`bun run preview`, as described in [DESIGN.md](../DESIGN.md). Source inspection
and passing static gates are not visual evidence.

## When the harness lands

The testing wave adds `@playwright/test` at an exact version, a
`playwright.config.ts`, the `e2e/` directory, and a `test:e2e` script. The
harness runs against the built app on `bun run preview`. Until that change is
merged, no document or spec may claim an e2e result.
