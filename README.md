# React Rsbuild + Kibo UI Boilerplate

A production-ready React starter powered by [Rsbuild](https://rsbuild.rs) and [Kibo UI](https://www.kibo-ui.com) — combining Rust-based build tooling with advanced UI components for dashboards, project management, and data-heavy applications.

## Stack

- **React 19** — UI library
- **Rsbuild** — Rust-powered build tool (SWC compilation, fast refresh)
- **Kibo UI** — Advanced components built on shadcn/ui (kanban, calendar, editor, gantt, etc.)
- **shadcn/ui** — Radix + Tailwind component primitives
- **TypeScript** — Strict mode with path aliases (`@/`)
- **TanStack Router** — File-based, type-safe routing with auto code splitting
- **TanStack Query** — Server state management and caching
- **TanStack Table** — Headless data table with sorting, filtering, pagination
- **Zustand** — Client state management
- **Tailwind CSS** — Utility-first styling with dark mode
- **Recharts** — Composable chart library
- **dnd-kit** — Drag and drop (for kanban boards)
- **date-fns + React Day Picker** — Date utilities and date picker
- **React Hook Form + Zod** — Form handling and validation
- **Axios** — HTTP client with JWT interceptors
- **Vitest** — Unit and component testing
- **Sonner** — Toast notifications

## Quick Start

```bash
# install dependencies
bun install

# start dev server
bun run dev

# production build
bun run build
```

## Adding Kibo UI Components

Kibo UI components are added via CLI — they get copied into your project (same model as shadcn/ui):

```bash
# Add individual components
bunx kibo-ui add kanban
bunx kibo-ui add calendar
bunx kibo-ui add editor
bunx kibo-ui add gantt
bunx kibo-ui add list

# Or via shadcn CLI with registry
bunx shadcn add kanban --registry https://www.kibo-ui.com/registry
```

Available components: kanban, calendar, gantt, editor, table, list, avatar-stack, code-block, color-picker, credit-card, dropzone, image-crop, marquee, qr-code, rating, spinner, stories, tags, ticker, tree, video-player, and [many more](https://www.kibo-ui.com/docs).

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start dev server on port 3000 |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run lint:fix` | Run ESLint with auto-fix |
| `bun run format` | Format code with Prettier |
| `bun run typecheck` | TypeScript type checking |
| `bun run test` | Run tests |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:coverage` | Tests with coverage report |
| `bun run check` | Run typecheck + lint + test |

## Project Structure

```
src/
├── api/              # API client and service functions
├── components/
│   ├── examples/     # Example components (data table, stats cards)
│   ├── layouts/      # Page layouts (MainLayout)
│   ├── shared/       # Shared components (ThemeToggle)
│   └── ui/           # shadcn/ui + Kibo UI primitives
├── config/           # App configuration (env vars)
├── hooks/            # Custom React hooks
├── lib/              # Utilities (cn, store)
├── routes/           # TanStack Router file-based routes
├── test/             # Test setup and utilities
└── types/            # TypeScript type definitions
```

## Why Rsbuild + Kibo UI?

- **Rsbuild**: Dev/prod parity with Rspack, SWC everywhere, webpack plugin compat
- **Kibo UI**: Production-ready complex components (kanban, calendar, gantt, editor) that shadcn/ui doesn't cover — same copy-paste model, fully customizable

## Docker

```bash
docker compose up -d
```

## License

MIT
