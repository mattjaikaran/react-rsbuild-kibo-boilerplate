# Contributing

## Set up

```bash
bun install
bun run dev
```

The dev server runs on port 3000 and proxies `/api` to
`API_PROXY_TARGET` (default `http://localhost:8000`). Copy `.env.example` to
`.env.local` to change the client API URL and timeout. Set `API_PROXY_TARGET`
in the shell when the proxy target changes, for example
`API_PROXY_TARGET=http://api-dev:8000 bun run dev`. Use Node
`^20.19.0 || >=22.13.0` and Bun 1.3 or newer.

Read [docs/architecture.md](docs/architecture.md) before adding a route or
moving a boundary. Read [DESIGN.md](DESIGN.md) before changing the UI.

## Work flow

Two tracks run at the same time:

- **Owner sessions:** larger or supervised work (L issues, planning, verbatim
  ports) goes straight to `main`. No PR.
- **Overnight agents:** agent-run claims READY specs and opens one PR per spec
  on `agent/<Spec ID>`. You review and merge them in the morning.

1. Pick an issue. Each issue has a size label and a wave milestone.
2. Read the spec in `tasks/specs/` when one exists. A READY spec is the
   contract; do not redesign it in the executor session.
3. Commit with `<type>(<scope>): <Capitalized imperative summary>`. Keep the
   subject at 50 characters or fewer and wrap the body at 72. Every commit
   names a GitHub issue in its body: `Closes #N` when it finishes the issue,
   `Refs #N` otherwise. Make small commits, one per component or step.
4. Humans branch from `main` as `feature/`, `fix/`, `refactor/`, or `chore/`
   and open a PR with the template. Agent-run branches as `agent/<Spec ID>`.

### Working next to the overnight lane

- Start by checking the specs in `tasks/specs/` with Status `READY`, the open
  `agent/<Spec ID>` branches, and the open agent PRs. If an issue's spec is
  claimed, leave its files alone until the PR merges.
- To do a READY spec yourself, first set its Status to
  `IN PROGRESS (local)` and push, so the lane does not claim it.
- To keep agents off a spec you are about to change, set its Status to
  `BLOCKED-PLANNER: <reason>` first and push.
- Specs cite files and names from the specs they depend on. If you change a
  name a READY spec uses, update that spec in the same commit.

### Morning merge

1. List the night's agent PRs.
2. For each PR with green CI and a `matt-reviewer` approval, read it and
   approve it yourself (`gh pr review <N> --approve`). `agent-run merge`
   merges only PRs that both `mattjaikaran` and `matt-reviewer` approved on the
   current head, oldest first. Each merge unblocks the specs that depend on it.
3. A PR with the `gate-failed` or `needs-human` label needs you: fix it on its
   branch and push, or close it with `agent-run abandon`.

## Sizes

| Size | Work                                                  | Who does it                                                                     |
| ---- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| S    | Exact edits, no design choice                         | Overnight agent (small model)                                                   |
| M    | Fixed design, several files                           | Overnight agent (small model)                                                   |
| L    | Open design, new subsystem, or a cross-cutting change | Supervised session with a frontier model; it splits the work into S and M specs |

A frontier model plans: it reads the issue, the source code, and
[docs/architecture.md](docs/architecture.md), makes every design choice, and
writes S and M specs that a small model (Haiku, DeepSeek Flash) can execute
without a design decision. L issues stay supervised until they are split.

Size is not file count. The spec limits do that: a component spec stays within
8 files and 300 changed lines; a batch spec stays within 20 files and 2,000
changed lines.

## Waves

Waves order work by dependency. Each issue carries a milestone named `W<N>`,
and an issue is ready when the wave before it is merged.

| Wave | Scope                                         |
| ---- | --------------------------------------------- |
| W1   | Workflow, architecture docs, and templates    |
| W2   | Feature and component work                    |
| W3   | API integration and state hardening           |
| W4   | Accessibility, performance, and design polish |
| W5   | Playwright smoke and journey tests            |

The milestone is the source of truth when a repository has its own roadmap.
Do not start a wave that depends on an unmerged earlier wave.

## Batch PRs

Do not open a PR for each small issue. Group similar issues in the same area
and wave into one batch PR:

- One area per PR: routes/UI, data/auth, or tooling/docs.
- 2,000 changed lines or fewer. The agent-run gate counts every file,
  insertions plus deletions, lockfiles included.
- One commit per issue, so a reviewer can read the batch issue by issue.
- The PR closes every issue in the batch with `Closes #N`.
- A single issue that exceeds 2,000 lines is L work. Split it before opening
  the PR.

## Specs

Agent-run claims specs in `tasks/specs/S-*.md` whose Status is `READY` and
whose dependencies are merged. See [tasks/specs/README.md](tasks/specs/README.md)
for the format and [tasks/specs/TEMPLATE.md](tasks/specs/TEMPLATE.md) for the
template.

Each spec links to its GitHub issue and lists every path it may change. The
executor may not touch a path outside `Files owned`. agent-run writes
`Closes #N` into the PR.

## Review process

1. CI must pass. The agent-run gate runs the static checks and the build for
   every PR, plus the smoke tests and Playwright journeys that cover the
   changed files once those exist.
2. `matt-reviewer` reviews every PR. Fix or answer each finding.
3. `mattjaikaran` approves. A PR merges only with both approvals on its
   current head commit.
4. Rebase merge when possible, else squash.
5. An agent PR that changes a decision in
   [docs/architecture.md](docs/architecture.md) or
   [docs/product/journeys.md](docs/product/journeys.md) must update that
   document in the same PR.

Both reviewers already have access. GitHub branch protection is not available
on this plan, so follow these rules by convention. `agent-run merge` enforces
steps 1 to 3 for agent PRs.

## Tests

Testing is minimal. The app keeps two kinds of tests only:

- A Playwright smoke test: the built app boots and every journey entry route
  renders.
- Playwright journey tests: one per journey in
  [docs/product/journeys.md](docs/product/journeys.md).

Do not add unit tests. The existing Vitest tests stay as they are and are not
extended. Details: [docs/testing.md](docs/testing.md).

## Local checks

Run these before a PR. They are the gates that exist today:

```bash
bun run format:check
bun run lint:strict
bun run typecheck
bun run build
bun run check-conventions
bun run check-dependencies
bun run doctor
```

`bun run test` runs the existing Vitest tests; it is not a license to add more.
Once the Playwright harness lands, run its smoke and journey tests as well.
