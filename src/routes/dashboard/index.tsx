import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Activity, AlertTriangle, CheckSquare, Clock } from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const stats = [
    { title: 'Total Tasks', value: 25, icon: CheckSquare, color: 'text-blue-500' },
    { title: 'Completed', value: 12, icon: Activity, color: 'text-emerald-500' },
    { title: 'Pending', value: 10, icon: Clock, color: 'text-amber-500' },
    { title: 'Overdue', value: 3, icon: AlertTriangle, color: 'text-rose-500' },
  ]

  const recentTasks = [
    { id: '1', title: 'Complete project setup', priority: 'high', completed: false },
    { id: '2', title: 'Write documentation', priority: 'medium', completed: false },
    { id: '3', title: 'Add unit tests', priority: 'high', completed: true },
    { id: '4', title: 'Optimize performance', priority: 'medium', completed: false },
    { id: '5', title: 'Deploy to production', priority: 'low', completed: false },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your tasks and activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your latest task activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      task.completed
                        ? 'bg-emerald-500'
                        : task.priority === 'high'
                          ? 'bg-rose-500'
                          : task.priority === 'medium'
                            ? 'bg-amber-500'
                            : 'bg-sky-500'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium ${
                        task.completed ? 'text-muted-foreground line-through' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.priority} priority
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'High', value: 8, color: 'bg-rose-500', total: 25 },
                { label: 'Medium', value: 12, color: 'bg-amber-500', total: 25 },
                { label: 'Low', value: 5, color: 'bg-sky-500', total: 25 },
              ].map(item => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${(item.value / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
