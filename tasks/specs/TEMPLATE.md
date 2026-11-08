# <Spec ID>: <title>

| Field              | Value                                                                              |
| ------------------ | ---------------------------------------------------------------------------------- |
| Spec ID            | S-<AREA>-<NN>                                                                      |
| Issue              | #<N> (batch: #<N>, #<N>)                                                           |
| Wave               | W<N>                                                                               |
| Role               | coding                                                                             |
| Status             | READY / BLOCKED-DEPS / BLOCKED-PLANNER / BLOCKED-HUMAN / MERGED / SUPERSEDED: #<N> |
| Size               | S / M                                                                              |
| Assigned executor  | agent-run (overnight)                                                              |
| Base commit        | <SHA of origin/main when written>                                                  |
| Branch             | `agent/<Spec ID>`                                                                  |
| Depends on         | <spec IDs, or none>                                                                |
| Conflicts with     | <spec IDs, or none>                                                                |
| Files owned        | <exact repository-relative paths, comma separated>                                 |
| Runtime locks      | none                                                                               |
| Changed-file limit | 8                                                                                  |
| Changed-line limit | 300                                                                                |
| Human needed       | none                                                                               |

## Goal

<One paragraph: the observable result.>

## Context and citations

<For each fact: `path:start-end`, the quoted line, and the constraint it sets.>

## Change

<Numbered, exact steps. Before and after code for every non-trivial edit. No
open design choices.>

## Out of scope

<What the executor must not touch. Include any route, store slice, or API
service that looks related but is not part of this spec.>

## Verification

<Exact commands and expected output. No new tests unless this is the W5
testing batch, which lists `e2e/smoke.spec.ts` and its journey specs in
`Files owned`.>
