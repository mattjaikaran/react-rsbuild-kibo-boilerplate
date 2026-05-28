import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTableExample } from '@/components/examples/data-table-example'
import { StatsCards } from '@/components/examples/stats-cards'

export const Route = createFileRoute('/examples')({
  component: ExamplesPage,
})

// react-doctor-disable-next-line react-doctor/only-export-components
function ExamplesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Component Examples</h1>
        <p className="mt-2 text-muted-foreground">
          Showcase of Kibo UI and shadcn/ui components included in this
          boilerplate. Add more with{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            bunx kibo-ui add &lt;component&gt;
          </code>
        </p>
      </div>

      <StatsCards />

      <Card>
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
          <CardDescription>
            TanStack Table with sorting, filtering, and pagination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableExample />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kanban Board</CardTitle>
            <CardDescription>
              Drag-and-drop task management with dnd-kit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add kanban support:{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                bunx kibo-ui add kanban
              </code>
            </p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <a
                href="https://www.kibo-ui.com/docs/components/kanban"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Docs
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              Full calendar with event management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add calendar support:{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                bunx kibo-ui add calendar
              </code>
            </p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <a
                href="https://www.kibo-ui.com/docs/components/calendar"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Docs
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rich Text Editor</CardTitle>
            <CardDescription>
              TipTap-based editor with toolbar and markdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add editor support:{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                bunx kibo-ui add editor
              </code>
            </p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <a
                href="https://www.kibo-ui.com/docs/components/editor"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Docs
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gantt Chart</CardTitle>
            <CardDescription>
              Project timeline visualization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add gantt support:{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                bunx kibo-ui add gantt
              </code>
            </p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <a
                href="https://www.kibo-ui.com/docs/components/gantt"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Docs
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
