import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRight, Check, Layers, MoveRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// TanStack file-router registration requires Route; its plugin owns route HMR.
// react-doctor-disable-next-line react-doctor/only-export-components
export const Route = createFileRoute('/')({ component: HomePage })

const capabilities = [
  {
    number: '01',
    title: 'Compose your workspace',
    description:
      'Kanban boards, calendars, charts, and data tables. Explore real Kibo UI examples, then make them your own.',
  },
  {
    number: '02',
    title: 'Connect the moving parts',
    description:
      'Type-safe TanStack routes, cached queries, forms, and state are already connected. Spend your time on the product.',
  },
  {
    number: '03',
    title: 'Keep your momentum',
    description:
      'Rsbuild powers the development loop. Native linting, formatting, and React Doctor keep the foundation intentional.',
  },
]
const previewTasks = [
  { title: 'Define the product story', detail: 'Strategy · completed', complete: true },
  { title: 'Build the first workspace', detail: 'Design · in progress', complete: false },
  { title: 'Share it with your team', detail: 'Launch · up next', complete: false },
]

export function HomePage() {
  return (
    <div className="space-y-16 py-6 md:space-y-24 md:py-12">
      <section
        className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]"
        aria-labelledby="home-heading"
      >
        <div className="space-y-7">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <Layers size={16} aria-hidden="true" /> A foundation for your next idea
          </p>
          <h1
            id="home-heading"
            className="max-w-xl text-5xl font-semibold leading-[1.06] tracking-tight md:text-6xl"
          >
            Less setup.
            <br />
            More possibility.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Turn a good idea into a workspace people love. A thoughtfully assembled React starter,
            with the powerful Kibo UI building blocks ready to go.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/examples">
                Explore the components <MoveRight aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">
                Open dashboard <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">React 19 / Rsbuild / Kibo UI / TanStack</p>
        </div>
        <Card className="overflow-hidden border-border shadow-lg">
          <CardHeader className="border-b bg-secondary/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Workspace preview
              </span>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                On track
              </span>
            </div>
            <CardTitle className="pt-3 text-2xl">Make room for great work.</CardTitle>
            <CardDescription>A sample launch plan. Your next chapter starts here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-sm text-muted-foreground">This week</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  03 <span className="text-sm font-normal text-muted-foreground">milestones</span>
                </p>
              </div>
              <div className="rounded-lg bg-accent p-4">
                <p className="text-sm text-accent-foreground">A little progress, daily</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-accent-foreground">
                  1 of 3
                </p>
              </div>
            </div>
            <ul className="divide-y divide-border">
              {previewTasks.map((task) => (
                <li key={task.title} className="flex items-center gap-3 py-4">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full ${task.complete ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground'}`}
                    aria-hidden="true"
                  >
                    {task.complete ? (
                      <Check size={16} />
                    ) : (
                      <span className="size-2 rounded-full bg-muted-foreground" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{task.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/todos">
                Try the live task workspace <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
      <section aria-labelledby="building-blocks-heading" className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Built to be yours
            </p>
            <h2 id="building-blocks-heading" className="text-3xl font-semibold tracking-tight">
              The essentials, already considered.
            </h2>
          </div>
          <a
            href="https://www.kibo-ui.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Kibo UI documentation <ArrowUpRight size={16} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {capabilities.map((item) => (
            <Card key={item.number} className="shadow-none">
              <CardHeader>
                <p className="mb-6 font-mono text-sm text-primary">{item.number}</p>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section
        className="flex flex-col justify-between gap-5 border-t border-border pt-8 sm:flex-row sm:items-center"
        aria-label="Starter resources"
      >
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
          Start with the examples. Keep what serves your idea.
          <br />
          Every component is here to be edited, not worked around.
        </p>
        <Button variant="outline" asChild>
          <a
            href="https://github.com/mattjaikaran/react-rsbuild-kibo-boilerplate"
            target="_blank"
            rel="noopener noreferrer"
          >
            View source <ArrowUpRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
      </section>
    </div>
  )
}
