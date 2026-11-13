# Contributing

## Set up

Install and run the commands in [AGENTS.md](AGENTS.md#commands). The dev server
runs on port 3000 and proxies `/api` to
`API_PROXY_TARGET` (default `http://localhost:8000`). Copy `.env.example` to
`.env.local` to change the client API URL and timeout. Set `API_PROXY_TARGET`
in the shell when the proxy target changes, for example
`API_PROXY_TARGET=http://api-dev:8000 bun run dev`.

Read [docs/architecture.md](docs/architecture.md) before adding a route or
moving a boundary. Read [DESIGN.md](DESIGN.md) before changing the UI.

## Work flow

Two tracks run at the same time:

- **Owner sessions:** larger or supervised work (L issues, planning, verbatim
  ports) goes straight to `main`. No PR.
- **Overnight agents:** agent-run claims READY specs and opens one PR per spec
  on `agent/<Spec ID>`. You review and merge them in the morning.

1. Pick an issue. Each issue has a size label and a wave milestone.
2. Read the spec in `tasks/specs/` when one exists. The executor rules are in
   [AGENTS.md](AGENTS.md#spec-workflow-agent-run).
3. Commit as [AGENTS.md](AGENTS.md#git-and-commits) describes.
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

Spec planning, limits, and the executor workflow are in
[tasks/specs/README.md](tasks/specs/README.md) and
[AGENTS.md](AGENTS.md#spec-workflow-agent-run). Size is not file count.

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
and wave into one batch PR; the
[spec rules](tasks/specs/README.md#rules) define the limits, the commit
layout, and how the PR closes every component issue.

## Specs

The format, status values, and executor rules live in
[tasks/specs/README.md](tasks/specs/README.md),
[tasks/specs/TEMPLATE.md](tasks/specs/TEMPLATE.md), and
[AGENTS.md](AGENTS.md#spec-workflow-agent-run).

## Review process

1. CI must pass: the gates in [AGENTS.md](AGENTS.md#verify), plus the smoke
   and Playwright journeys that cover the change once the W5 specs exist.
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

Testing policy: [docs/testing.md](docs/testing.md) and
[AGENTS.md](AGENTS.md#testing-policy). Never publish a result you did not run.

## Local checks

Run the verification gates in [AGENTS.md](AGENTS.md#verify) before a PR. Once
the W5 specs land, build and run them with `bun run build && bun run test:e2e`.

## CI

`.github/workflows/ci.yml` runs the format, lint, typecheck, build, convention,
and dependency gates as parallel jobs on every pull request, on demand, and
weekly. The weekly run gives `agent-run merge` a `main` baseline. Jobs use the
repository's self-hosted runner on LXC 107; a pull request from a fork runs on
`ubuntu-latest` instead, because fork code must never execute on a self-hosted
runner. The sharded Playwright job runs the shipped config and passes with no
tests until the W5 specs land.
