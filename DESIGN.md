# Design guide

## Direction

An editorial workspace: warm paper, clear ink typography, vivid cobalt actions,
and restrained mint status surfaces. Coral is reserved for destructive feedback.
The home page pairs a product promise with an explicitly labeled sample workspace,
not fabricated customer statistics. Its links open working examples and routes.

## Edit map

- `src/routes/index.tsx`: landing copy, `capabilities`, `previewTasks`, calls to
  action, and workspace preview. These module-level arrays are intentionally easy
  to replace. The preview is static sample data; `/todos` is the interactive demo.
- `src/index.css`: semantic HSL tokens in `:root` and `.dark`, Tailwind token
  mapping, radius, typography, global focus, and reduced-motion behavior.
- `src/components/ui`: existing shadcn/ui and Kibo primitives. Change variants
  here rather than introducing a second button or card implementation.
- `src/components/layouts`: shared navigation and page shell.
- `src/components/examples` and `src/routes/examples.tsx`: retained Kibo demos.
- `src/routes/dashboard` and `src/routes/todos`: working application surfaces.

## Tokens and typography

Use `background`/`foreground` for the page, `card` for elevated work surfaces,
`muted`/`muted-foreground` for supporting information, `primary` for cobalt
interactive emphasis, `accent` for mint status, and `destructive` for errors.
Always pair each surface with its semantic foreground. Edit both theme blocks
when changing a token; never bake light-only colors into component classes.

The system sans stack uses Inter when available, then Avenir Next and platform
fonts; no external font request is required. Headlines use tight tracking and
moderate weight, not all-caps paragraphs. Keep a single h1 per page, followed by
logical h2/h3 sections. Body copy should remain at least 14px and comfortable at
1.5–1.7 line height. Uppercase labels are short orientation cues only.

## Layout and components

Use the existing Tailwind spacing scale: 4–6 units inside cards, 8 between local
groups, and 16–24 between major landing sections. Keep paragraph measure around
32–40rem. The landing is two columns only on large screens, with a natural
reading-order stack on mobile; capability cards stack below medium widths.
Avoid fixed heights, tiny text, and decorative gradients. Cards group meaningful
information; a restrained border is the default, with shadow reserved for the
featured preview. Prefer Button `asChild` for route links and semantic lists for
collections. Keep preview content clearly distinguished from live API data.

## Interaction and accessibility

Use links for navigation and buttons for actions. All actions need visible names,
keyboard operation, and visible focus rings. Decorative icons use `aria-hidden`;
icon-only controls need accessible labels. External new-tab links announce that
behavior and retain `noopener noreferrer`. Never communicate status only through
color: include readable text. Preserve Radix keyboard and dialog semantics.

The global focus token follows cobalt in both themes. Reduced-motion preferences
minimize animations and transitions globally; do not add essential information
that depends on motion. New interactions must retain contrast in both themes,
work at narrow widths and 200% zoom, and preserve a logical tab order. Validate
changes with keyboard navigation, light/dark review, and the JSX accessibility
rules in Oxlint. React Doctor is a separate diagnostic gate, not a substitute for
manual accessibility review.

Use Node 20.19+ or 22.13+ (22 LTS recommended) and Bun 1.3+. The main navigation wraps at narrow widths rather than hiding routes or clipping sign-in actions.

Settings are split into account and preference tabs with React Hook Form and
Zod validation. The system theme is the fresh-install default; saving appearance
applies and persists the theme on this device. Profile and notification changes
are visit-local previews. Password validation clears entered credentials without
claiming to change an account; 2FA requires a real authentication provider.
Contact and feedback show explicit local-only submission outcomes. Feedback drafts
are saved to this tab's session storage. Todos use the existing in-memory store:
creation, editing, completion, and deletion work across routes and reset on reload.

System mode follows OS scheme changes while the app is open. Header and appearance
controls share one Zustand preference rather than competing theme providers.
Explicit light/dark choices persist on this device and override the OS. The initial
theme applies before asynchronous session restoration.

Doctor's component-only export rule has a precise exception on each required
TanStack `Route` registration: the file-router plugin owns route HMR. Component
exports remain checked, and the existing scan scope is unchanged. Login forms
and privacy/terms retain separate ownership despite intentional structural
similarities; they serve distinct authentication and legal workflows.
