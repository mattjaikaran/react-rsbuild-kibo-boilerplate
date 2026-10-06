# Design guide

This is the authoritative repository-local guide for applying a new visual design
without replacing the Rsbuild, TanStack Router, Zustand, shadcn/ui, or Kibo architecture.
Update this guide before changing visual code; README.md and CLAUDE.md point here.

## Design brief

Fill or revise these decisions for each redesign before implementation:

- **Direction:** editorial workspace, clear hierarchy, restrained borders, honest
  sample content. Record the intended audience, visual references, and what to avoid.
- **Colors:** warm-paper light surfaces remain the current light direction; dark
  pages are pure black with neutral elevated surfaces. Actions and focus are
  monochrome; coral is reserved for destructive feedback. Record both palettes
  and every semantic surface/foreground pair rather than isolated hex values.
- **Typography:** Inter when available, then Avenir Next and system sans; no remote
  font dependency. Record heading/body sizes, weights, line heights, and measure.
- **Layout:** responsive reading order, restrained cards, no decorative gradients
  or fixed content heights. Record spacing, density, widths, and mobile stacking.
- **Interactions:** visible names and focus, keyboard operation, reduced motion,
  explicit local-only outcomes for demo forms. Record hover, active, disabled,
  loading, error, and empty states and distinguish sample from live data.

## Source edit map and ownership

- `src/index.css`: `:root` and `.dark` semantic HSL tokens, Tailwind `@theme`
  mappings, radius, body font, native `color-scheme`, focus and reduced motion.
- `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/input.tsx`, `src/components/ui/textarea.tsx`,
  `src/components/ui/select.tsx`, `src/components/ui/form.tsx`, `src/components/ui/label.tsx`, `src/components/ui/table.tsx`, `src/components/ui/dropdown-menu.tsx`,
  `src/components/ui/skeleton.tsx`, and `src/components/ui/image.tsx`: existing copied shadcn/ui/Kibo primitives.
  Reuse their variants and semantic tokens; only edit a primitive for a shared
  visual requirement. Preserve upstream APIs, accessibility, and the existing
  convention-check exclusions for `src/components/ui`; do not impose application
  component conventions on copied primitives or introduce parallel implementations.
- `src/components/shared/theme-toggle.tsx`: the shared, immediate two-way action
  used by header and settings. `src/components/nav/navbar.tsx` and `src/components/nav/footer.tsx`
  own reusable navigation; `src/components/layouts/main-layout.tsx` owns the active
  shell, navigation, and OS appearance listener. Other layouts remain in
  `src/components/layouts`.
- `src/routes/index.tsx`: landing copy, `capabilities`, `previewTasks`, calls to
  action, and explicitly labeled static workspace preview. `/todos` is the live demo.
- `src/components/examples` and `src/routes/examples.tsx`: retained Kibo demos;
  adapt compositions without replacing the installed component architecture.
- `src/routes/dashboard` and `src/routes/todos`: application compositions.
- `src/routes/settings/index.tsx` and `src/routes/settings/-components/settings-navigation.tsx`:
  settings tabs; `src/routes/settings/-components/preference-settings.tsx`: shared immediate theme
  control, visit-local language and notification forms;
  `src/routes/settings/-components/account-settings.tsx`: profile/security previews.
- `src/lib/store/slices/uiSlice.ts`: system initial value, opposite-resolved-theme
  `toggleTheme`, and root-class application. `src/lib/store/index.ts`: persisted
  `app-store` theme plus legacy `theme` key restoration; `src/main.tsx` initializes
  appearance before asynchronous session restoration finishes. These own behavior,
  not alternative design controls. Never hand-edit `src/routeTree.gen.ts`.

## Applying a new design

1. Update the **Design brief** above with concrete decisions and acceptance criteria.
   Keep this edit map accurate if source ownership changes.
2. Implement semantic tokens in both `:root` and `.dark` in `src/index.css` first.
   Pair background/foreground, card/card-foreground, popover/popover-foreground,
   primary/primary-foreground, secondary, muted, accent, and destructive roles.
   Keep dark `background` at `0 0% 0%`, dark surfaces neutral, and action/focus
   tokens monochrome. Do not hard-code light-only colors in compositions.
   Preserve `color-scheme: light` on root and `dark` on `.dark` for native controls.
3. Apply typography, radius, spacing and focus changes through existing shared
   primitives and shell before route-level compositions. Reuse Button variants
   and `asChild` for links; retain Radix semantics and copied-component ownership.
4. Update landing, Kibo examples, dashboard, todos and settings compositions using
   those tokens and primitives. Keep sample labels and real route actions. Use
   semantic lists, one h1 per page, logical h2/h3 hierarchy, comfortable body text
   (at least 14px), and paragraph measure near 32–40rem. Prefer 4–6 spacing units
   inside cards, 8 between groups, and 16–24 between major landing sections.
5. Preserve the appearance invariant below. Header and settings must render the
   same shared binary control; theme changes are immediate, not form submissions.
   Keep unrelated preference validation and visit-local outcomes intact.
6. Run the local gates below, then perform actual browser review via `bun run dev`
   or a built preview. Inspect `/`, `/examples`, `/dashboard`, `/todos`, and
   `/settings` in light/dark at narrow and wide widths and 200% zoom. Inspect the
   black body, neutral cards/popovers, action/focus contrast, native selects and
   scrollbars; exercise hover, dialogs, errors, keyboard tab order and reduced
   motion. Do not treat source inspection or passing gates as visual evidence.
7. Review the resulting design against the brief and update this guide to describe
   the delivered design. Report only checks actually run and unresolved findings.

## Appearance invariant and browser checks

A fresh install starts in internal `system` mode and follows OS scheme changes
while open. There is **no System option** in the UI: the only visible action
switches directly to the opposite resolved light/dark appearance. Both header and
Appearance settings use `ThemeToggle` and the existing Zustand `toggleTheme`.
An explicit choice persists and overrides later OS changes and reloads.

For a fresh-install browser test, remove localStorage `theme` and `app-store`
(the latter is Zustand's serialized theme state), then reload with light and dark
OS emulation. Change OS emulation while still in the initial system state. Click
`Switch to dark mode` or `Switch to light mode`, change OS emulation again and
reload: the explicit choice must remain. In `/settings`, select the `Appearance`
button, then use the same named theme action; verify the header agrees immediately
and no System radio/select or theme-save step exists. Settings has no route-level
auth guard; the header and appearance check require no sign-in. Preserve language
preview and notification forms separately from persisted theme behavior.

## Accessibility and demo boundaries

Use links for navigation, buttons for actions, visible names, and decorative icons
with `aria-hidden`. External new-tab links announce that behavior and retain
`noopener noreferrer`. Never communicate status by color alone. Keep focus visible
and preserve Radix keyboard/dialog semantics. Reduced motion must not remove
essential information. JSX accessibility lint and React Doctor do not replace
manual keyboard, contrast, responsive, and zoom review.

Profile and notification changes are visit-local previews. Password validation
clears credentials without claiming an account change; 2FA requires a real provider.
Contact and feedback report local-only outcomes; feedback drafts use tab session
storage. Todos use the existing in-memory store and reset on reload. Keep these
boundaries honest when restyling. TanStack Route export exceptions remain scoped
because the file-router plugin owns route HMR; keep route and scan conventions.

## Local commands

Use Node 20.19+ or 22.13+ (22 LTS recommended) and Bun 1.3+.
These are the actual package.json commands; their presence is not a success claim:

```bash
bun run dev                # Rsbuild development server (port 3000)
bun run build              # Production build
bun run preview            # Preview built output
bun run format:check       # Oxfmt check, no writes
bun run lint:strict        # Oxlint with warnings denied
bun run typecheck          # tsc --noEmit
bun run test               # Vitest run
bun run check-conventions  # Existing source conventions
bun run check-dependencies # Existing dependency policy
bun run check              # typecheck, lint, test, conventions, dependencies
bun run gauntlet           # format check plus lint/type/test/conventions/dependencies
bun run doctor             # React Doctor, blocking errors
```

`check` and `gauntlet` use normal `lint`; run `lint:strict` separately when warnings
must fail. `bun run format` writes formatting and `bun run lint:fix` applies fixes;
review those edits rather than assuming they are visual verification. Preserve the
Oxlint/Oxfmt packages, root configurations, scripts and editor integration.
