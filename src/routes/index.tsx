import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          React + Rsbuild + Kibo UI
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          A modern React starter with Rsbuild, Kibo UI (advanced shadcn/ui
          components), TanStack Router, TanStack Query, and Tailwind CSS.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Rsbuild</CardTitle>
            <CardDescription>
              Rust-powered build tool with dev/prod parity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              SWC compilation, fast refresh, webpack plugin compatibility.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kibo UI</CardTitle>
            <CardDescription>
              Advanced components built on shadcn/ui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Kanban boards, calendars, data tables, charts, and 40+ complex
              components.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TanStack</CardTitle>
            <CardDescription>
              Router + Query + Table
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Type-safe file routing, server state caching, powerful data
              tables.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link to="/examples">View Examples</Link>
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://www.kibo-ui.com/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kibo UI Docs
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://github.com/mattjaikaran/react-rsbuild-kibo-boilerplate"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </Button>
      </div>
    </div>
  )
}
