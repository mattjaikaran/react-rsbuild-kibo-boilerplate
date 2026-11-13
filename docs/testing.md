# Testing

Testing stays minimal on purpose. Two kinds of tests prove that the app works,
and nothing else is added:

| Kind                      | What it proves                                                                             | Where                    | When it is written                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------ | ------------------------ | ------------------------------------------------------------------------------- |
| Smoke test (Playwright)   | The production build boots and every journey's entry route renders without a console error | `e2e/smoke.spec.ts`      | Testing wave (W5), with the journey specs                                       |
| Journey test (Playwright) | One user journey works in a real browser                                                   | `e2e/jNN-<name>.spec.ts` | The testing wave, or the wave that ships the journey now that the config exists |

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

## Journey tags and the JSON report

The backend JOURNEYS gate reads `test-results/journeys.json`, so every journey
test follows one convention: one test per journey, tagged with the journey ID,
and a `test.step` whose title starts with the step ID.

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

Do not write a test per step. The JSON report keeps each step's result, so the
gate knows where a test stopped: when `J-001-S2` fails, S1 is verified and
later steps have no result. A test without step titles may carry step tags
instead (`tag: ['@J-001', '@J-001-S1']`); the test's result then covers them.

[playwright.config.ts](../playwright.config.ts) writes that report:

```ts
reporter: [
  ['list'],
  ['json', { outputFile: 'test-results/journeys.json' }],
],
```

## Until W5 adds the specs

`playwright.config.ts` and `bun run test:e2e` ship now. The repository has no
`e2e/` directory or spec yet; `test:e2e` passes `--pass-with-no-tests`, so the
empty suite does not fail the gate. The config starts `bun run preview`, so
build first:

```bash
bun run build
bun run test:e2e
```

`.github/workflows/ci.yml` runs the sharded Playwright job now that the config
exists; each shard uses `--pass-with-no-tests`, so the empty suite does not fail.
W5 adds the `e2e/` directory and the smoke and journey specs, and the job then
runs them against the built app.

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

## When W5 lands

The testing wave adds the `e2e/` directory with `smoke.spec.ts` and one spec per
journey. The harness and its command already exist; the specs run against the
built app on `bun run preview`. Until those specs are merged, no document or
spec may claim an e2e result.
