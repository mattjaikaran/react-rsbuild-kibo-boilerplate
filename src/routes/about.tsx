import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

// react-doctor-disable-next-line react-doctor/only-export-components
function AboutPage() {
  const stack = [
    { name: 'React 19', description: 'UI library' },
    { name: 'Rsbuild', description: 'Rust-powered build tool (Rspack under the hood)' },
    { name: 'TypeScript', description: 'Type safety with strict mode' },
    { name: 'Kibo UI', description: 'Advanced components built on shadcn/ui' },
    { name: 'shadcn/ui', description: 'Radix + Tailwind component primitives' },
    { name: 'TanStack Router', description: 'File-based, type-safe routing' },
    { name: 'TanStack Query', description: 'Server state management' },
    { name: 'TanStack Table', description: 'Headless data table with sorting/filtering' },
    { name: 'Zustand', description: 'Client state management' },
    { name: 'Tailwind CSS', description: 'Utility-first styling with dark mode' },
    { name: 'Recharts', description: 'Composable chart library' },
    { name: 'React Hook Form + Zod', description: 'Form handling and validation' },
    { name: 'dnd-kit', description: 'Drag and drop for kanban boards' },
    { name: 'date-fns', description: 'Date utility library' },
    { name: 'React Day Picker', description: 'Flexible date picker component' },
    { name: 'Axios', description: 'HTTP client with interceptors' },
    { name: 'Vitest', description: 'Unit and component testing' },
    { name: 'Sonner', description: 'Toast notifications' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">About This Boilerplate</h1>
      <p className="text-muted-foreground">
        A production-ready React starter powered by Rsbuild and Kibo UI,
        combining Rust-based build tooling with advanced UI components for
        dashboards, project management, and data-heavy applications.
      </p>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {stack.map((item) => (
          <Card key={item.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
