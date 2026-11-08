## Summary

<!-- What changed and why. One or two sentences. -->

## Issues

<!-- One line per issue this PR closes. A batch PR closes every component issue. -->

Closes #

## Wave and journey

- Wave: <!-- for example W2 -->
- User journeys touched: <!-- for example J-05 Todos; or none -->

## Size

- [ ] 2,000 changed lines or fewer (insertions plus deletions, every file counted)
- [ ] One area per PR (routes/UI, data/auth, or tooling/docs)

## Verification

<!-- Commands you ran and what you saw. For example: bun run build, the route opened in the preview, the interaction you exercised. -->

## Review checklist

- [ ] CI is green on the current head
- [ ] `matt-reviewer` approved, then the owner approved
- [ ] No secrets, keys, or `.env` files
- [ ] `src/routeTree.gen.ts` was generated, not hand-edited
- [ ] No new or extended unit tests; Playwright smoke or journey tests only
- [ ] Docs updated (`docs/architecture.md`, `docs/product/journeys.md`, `DESIGN.md`) when behavior or design changed
- [ ] Dependency versions are exact and `DEPENDENCIES.md` is updated
