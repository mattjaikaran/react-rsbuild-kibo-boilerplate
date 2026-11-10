# Specs

agent-run claims specs in this directory overnight. It reads only the header
table of `S-<AREA>-<NN>-<slug>.md` files (parser: `agent_run/specs.py` in
agent-run). A spec is claimable when its Status is `READY`, its dependencies
are `MERGED` or their `agent/<Spec ID>` PR is merged, and no claimed spec owns
the same files.

## Who writes specs

A frontier model plans: it reads the issue, the source code, and
[docs/architecture.md](../../docs/architecture.md), makes every design choice,
and writes S and M specs that a small model (Haiku, DeepSeek Flash) can
execute without a design decision. L issues stay supervised until they are
split.

## Rules

- One spec per issue, or one batch spec for several issues in the same area
  and wave. A batch owns the union of the files, ships one commit per
  component, and closes every component issue. Keep a PR at 2,000 changed
  lines or fewer.
- Component specs stay within 8 files and 300 changed lines. A batch spec
  stays within 20 files and 2,000 changed lines (sum of its components'
  limits).
- `Files owned` lists every path the executor may change. The gate fails on
  any other path.
- Tests: none, except in W5. A W5 journey batch lists its Playwright journey
  (`e2e/jNN-*.spec.ts`) and the smoke test (`e2e/smoke.spec.ts`), and nothing
  else. The existing Vitest tests are not touched. See
  [CONTRIBUTING.md](../../CONTRIBUTING.md) and
  [docs/testing.md](../../docs/testing.md).
- Each spec has a GitHub issue with the `agent-run` and `size:S` or `size:M`
  labels. agent-run writes `Closes #N` into the PR.
- Cite current code as `path:start-end` with the quoted lines. Re-check the
  citations when a dependency merges.
- One area per batch: routes/UI, data/auth, or tooling/docs. A batch that
  mixes areas is split.

## Status

| Status                | Meaning                                          |
| --------------------- | ------------------------------------------------ |
| `READY`               | Claimable tonight                                |
| `BLOCKED-DEPS`        | Waits on another spec's merge                    |
| `BLOCKED-PLANNER`     | A design decision is missing                     |
| `BLOCKED-HUMAN`       | Needs an owner decision or access                |
| `IN PROGRESS (local)` | An owner is doing it; the lane must not claim it |
| `MERGED`              | The PR merged; dependencies are satisfied        |
| `SUPERSEDED: #N`      | Replaced by another issue or spec                |

Use exactly `DONE`, `MERGED`, or `COMPLETE` when a spec is finished; only those
satisfy a dependency.

## Template

Copy [TEMPLATE.md](TEMPLATE.md). Keep the header table valid: agent-run reads
the Field and Value columns only.

## Verification

Every spec ends with exact commands and expected output. Use the commands that
exist in this repository:

```bash
bun run format:check
bun run lint:strict
bun run typecheck
bun run build
bun run check-conventions
bun run check-dependencies
bun run check-agent-docs
```

Add `bun run doctor` for component or configuration changes. Add the Playwright
command only when the spec owns an `e2e/` file and the harness exists. Never
claim a browser result the executor did not observe.
