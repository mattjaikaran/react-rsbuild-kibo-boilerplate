# React Rsbuild + Kibo UI Boilerplate

## Commands
```bash
bun run dev          # Dev server (port 3000)
bun run build        # Production build
bun run check        # typecheck + lint + test
bun run test         # Vitest
bun run lint:fix     # ESLint auto-fix
bun run format       # Prettier
```

## Architecture
- **Rsbuild** (not Vite) — `rsbuild.config.ts`, `@rsbuild/plugin-react`
- **Kibo UI** — advanced components added via `bunx kibo-ui add <component>`
- **shadcn/ui** — base primitives in `src/components/ui/`
- **TanStack Router** — file-based routes in `src/routes/`
- **TanStack Query** — server state, **TanStack Table** — data tables
- **Zustand** — client state in `src/lib/store.ts`
- **Recharts** — charts, **dnd-kit** — drag-and-drop
- **Path alias** — `@/` → `src/`, **Env vars** — `PUBLIC_` prefix
- **API client** — `src/api/client.ts` (axios + JWT)
- **Tests** — co-located `*.test.tsx`, utils at `src/test/utils.tsx`

## Kibo UI Components
```bash
bunx kibo-ui add kanban      # Drag-and-drop task board
bunx kibo-ui add calendar    # Full calendar with events
bunx kibo-ui add editor      # TipTap rich text editor
bunx kibo-ui add gantt       # Project timeline
bunx kibo-ui add table       # Advanced data table
bunx kibo-ui add tree        # File tree / hierarchy
bunx kibo-ui add dropzone    # File upload drag-and-drop
```

## New Route
```tsx
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/my-page')({ component: MyPage })
function MyPage() { return <div>My Page</div> }
```
