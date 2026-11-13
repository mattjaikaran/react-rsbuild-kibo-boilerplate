# User stories and journeys

Each journey has an ID, the user stories it proves, the surface the app must
ship first, and the Playwright test that will prove it. Build the surface for a
journey before its Playwright test. The test for each journey lands in the
testing wave (W5) unless the harness is ready earlier.

The API is the Django Ninja boilerplate at `PUBLIC_API_URL`. Journeys marked
"demo" use in-memory or visit-local data and must say so in the interface.

## Personas

| Persona        | Goal                                                   |
| -------------- | ------------------------------------------------------ |
| Visitor        | Understand the boilerplate and read the public pages   |
| New user       | Create an account or request a passwordless link       |
| Returning user | Sign in, reach the dashboard, and manage their session |
| Signed-in user | Manage demo todos, profile settings, and appearance    |
| Maintainer     | Inspect the component examples and adopt the stack     |

## User stories

| ID    | As a           | I want to                                                              | So that                                            |
| ----- | -------------- | ---------------------------------------------------------------------- | -------------------------------------------------- |
| US-01 | visitor        | read the landing, about, contact, FAQ, privacy, and terms pages        | I understand what this starter provides            |
| US-02 | new user       | register and sign in                                                   | I can use the authenticated routes                 |
| US-03 | returning user | sign out                                                               | I can end my session on this device                |
| US-04 | new user       | request and open a magic link                                          | I can sign in without a password                   |
| US-05 | signed-in user | open the dashboard                                                     | I get an overview of activity                      |
| US-06 | signed-in user | create, edit, complete, filter, and delete demo todos                  | I can exercise the state and form patterns         |
| US-07 | maintainer     | browse the component examples                                          | I can see the Kibo UI and shadcn primitives in use |
| US-08 | signed-in user | view and edit profile and settings                                     | I can inspect the account surfaces                 |
| US-09 | any user       | switch between light and dark appearance, including the system default | the app follows my preference                      |

## Journeys

| ID   | Journey                        | Stories      | Surface (build first)                                                                                                        | Playwright test (planned)                                                                                                        |
| ---- | ------------------------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| J-01 | Visitor reads the public pages | US-01        | `/`, `/about`, `/contact`, `/faq`, `/privacy`, `/terms`                                                                      | `e2e/j01-public-pages.spec.ts`: every public page renders its heading and navigation                                             |
| J-02 | Register, sign in, sign out    | US-02, US-03 | `/auth/register`, `/auth/login`, `/dashboard`; API `/auth/signup`, `/auth/login`, `/auth/logout`                             | `e2e/j02-auth.spec.ts`: create an account, reach the dashboard, sign out, return to login                                        |
| J-03 | Request a magic link           | US-04        | `/auth/magic-link` requests a link; verification (`POST /auth/passwordless/login/verify`) has a client hook but no route yet | `e2e/j03-magic-link.spec.ts`: request a link and see the confirmation; verification coverage follows the route                   |
| J-04 | Dashboard overview             | US-05        | `/dashboard` (demo data)                                                                                                     | `e2e/j04-dashboard.spec.ts`: the stats and recent activity render as sample data                                                 |
| J-05 | Manage demo todos              | US-06        | `/todos`, `/todos/create` (in-memory store)                                                                                  | `e2e/j05-todos.spec.ts`: create, complete, filter, edit, and delete a todo; reload resets the list                               |
| J-06 | Explore component examples     | US-07        | `/examples`                                                                                                                  | `e2e/j06-examples.spec.ts`: the stats cards, revenue chart, and data table render; sorting and pagination work                   |
| J-07 | Profile and settings           | US-08        | `/profile`, `/settings` (visit-local preference forms)                                                                       | `e2e/j07-settings.spec.ts`: switch tabs, edit a local preference, and confirm the account fields render                          |
| J-08 | Appearance                     | US-09        | `ThemeToggle` in the header and Appearance settings                                                                          | `e2e/j08-theme.spec.ts`: switch appearance, reload, and confirm the explicit choice persists; clearing the choice follows the OS |

## Backend surface

This repository has no backend. The Django Ninja boilerplate owns the auth
routes listed above, their smoke tests, and the database. Keep the contract in
`src/api/` and update it here when an endpoint is added or removed.

A journey that needs a live API starts the backend separately and points
`PUBLIC_API_URL` at it. A journey marked "demo" must not depend on the API.

## Journey test convention

One Playwright test per journey, tagged with the journey ID, with each step in a
`test.step` whose title starts with the step ID. Do not write a test per step.

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

[playwright.config.ts](../../playwright.config.ts) writes
`test-results/journeys.json`, which the backend JOURNEYS gate reads to map a
failing step. Step tags (`tag: ['@J-001', '@J-001-S1']`) cover a test without
step titles. The full policy is in [docs/testing.md](../testing.md).

## Smoke tests

One Playwright smoke test proves the built app boots and every journey's entry
route renders without a console error:

`e2e/smoke.spec.ts` visits `/`, `/auth/login`, `/auth/register`,
`/auth/magic-link`, `/dashboard`, `/todos`, `/todos/create`, `/examples`,
`/profile`, and `/settings`.

`playwright.config.ts` and `bun run test:e2e` ship; the `e2e/` specs land in
W5. Until then, use the verification commands in
[docs/testing.md](../testing.md) and the browser review in
[DESIGN.md](../../DESIGN.md).
