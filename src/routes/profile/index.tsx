import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar, Edit, Mail, MapPin, Settings } from 'lucide-react'

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
})

// react-doctor-disable-next-line react-doctor/only-export-components
function ProfilePage() {
  const user = {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
  }

  const stats = { total: 25, completed: 12, pending: 10 }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/50 text-3xl font-bold text-primary-foreground">
              {user.firstName[0]}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="size-4" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span suppressHydrationWarning>Joined {new Date().toLocaleDateString()}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  Location not set
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/settings">
                  <Edit className="mr-2 size-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">
              {stats.completed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completion Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((stats.completed / stats.total) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: '1', action: 'Completed task', item: 'Review documentation', time: '2 hours ago' },
              { id: '2', action: 'Created task', item: 'Update dependencies', time: '5 hours ago' },
              { id: '3', action: 'Updated profile', item: 'Changed email', time: '1 day ago' },
              { id: '4', action: 'Completed task', item: 'Fix login bug', time: '2 days ago' },
            ].map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <div className="size-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.action}</span>
                    {' \u00B7 '}
                    <span className="text-muted-foreground">{activity.item}</span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
