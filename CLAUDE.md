# React Rsbuild + Kibo UI Boilerplate

## Build & Dev
- `bun run dev` — start dev server (port 3000)
- `bun run build` — production build
- `bun run preview` — preview prod build
- `bun run check` — typecheck + lint + test (run before committing)

## Test
- `bun run test` — run all tests (vitest)
- `bun run test:watch` — watch mode
- `bun run test:coverage` — with coverage
- Test utils at `src/test/utils.tsx` — exports `render` with providers pre-wrapped
- Tests co-located: `component.test.tsx` next to `component.tsx`

## Lint & Format
- `bun run lint` / `bun run lint:fix` — ESLint
- `bun run format` — Prettier
- `bun run typecheck` — tsc --noEmit

## Architecture
- **Rsbuild** (not Vite) — config in `rsbuild.config.ts`, uses `@rsbuild/plugin-react`
- **Kibo UI** — advanced components (kanban, calendar, editor, gantt) added via `bunx kibo-ui add <component>`
- **shadcn/ui** — base primitives in `src/components/ui/` — copy from shadcn docs
- **TanStack Router** — file-based routes in `src/routes/`, auto-generates `routeTree.gen.ts`
- **TanStack Query** — server state, configured in `src/main.tsx`
- **TanStack Table** — data tables with sorting/filtering/pagination
- **Zustand** — client state in `src/lib/store.ts`
- **Path alias** — `@/` maps to `src/`
- **Env vars** — use `PUBLIC_` prefix (not VITE_), accessed via `src/config/env.ts`

## Conventions
- Kibo UI components: `bunx kibo-ui add kanban` (copies into `src/components/ui/`)
- shadcn/ui components in `src/components/ui/`
- Layouts in `src/components/layouts/`
- Shared components in `src/components/shared/`
- Example/demo components in `src/components/examples/`
- API client in `src/api/client.ts` — axios with JWT interceptors
- Types in `src/types/`
- Custom hooks in `src/hooks/`

## Adding Kibo UI Components
```bash
bunx kibo-ui add kanban      # Drag-and-drop task board
bunx kibo-ui add calendar    # Full calendar with events
bunx kibo-ui add editor      # TipTap rich text editor
bunx kibo-ui add gantt       # Project timeline
bunx kibo-ui add list        # Sortable list
bunx kibo-ui add table       # Advanced data table
bunx kibo-ui add tree        # File tree / hierarchy
bunx kibo-ui add dropzone    # File upload drag-and-drop
```

## Adding a New Route
Create `src/routes/my-page.tsx`:
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/my-page')({
  component: MyPage,
})

function MyPage() {
  return <div>My Page</div>
}
```
The route is auto-registered via TanStack Router plugin.

## Docker
- `docker compose up -d` — build and run on port 3000
- Uses multi-stage build: bun install → rsbuild build → nginx serve
