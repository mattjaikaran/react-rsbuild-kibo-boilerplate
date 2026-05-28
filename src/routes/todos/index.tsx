import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, Circle, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/todos/')({
  component: TodosPage,
})

interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  tags: string[]
}

const sampleTodos: Todo[] = [
  {
    id: '1',
    title: 'Complete project setup',
    description: 'Set up the React Rsbuild boilerplate with all necessary configurations',
    completed: false,
    priority: 'high',
    dueDate: '2024-12-31',
    tags: ['development', 'setup'],
  },
  {
    id: '2',
    title: 'Write documentation',
    description: 'Create comprehensive documentation for the boilerplate',
    completed: false,
    priority: 'medium',
    dueDate: '2024-12-25',
    tags: ['documentation'],
  },
  {
    id: '3',
    title: 'Add unit tests',
    description: 'Implement unit tests for all components and utilities',
    completed: true,
    priority: 'high',
    tags: ['testing'],
  },
  {
    id: '4',
    title: 'Optimize performance',
    description: 'Review and optimize application performance',
    completed: false,
    priority: 'medium',
    tags: ['performance'],
  },
  {
    id: '5',
    title: 'Deploy to production',
    description: 'Set up CI/CD pipeline and deploy',
    completed: false,
    priority: 'low',
    dueDate: '2025-01-15',
    tags: ['deployment', 'devops'],
  },
]

// react-doctor-disable-next-line react-doctor/only-export-components
function TodosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredTodos = sampleTodos.filter(todo => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority =
      priorityFilter === 'all' || todo.priority === priorityFilter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && todo.completed) ||
      (statusFilter === 'pending' && !todo.completed)
    return matchesSearch && matchesPriority && matchesStatus
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Todos</h1>
          <p className="text-muted-foreground">
            Manage your tasks and stay organized
          </p>
        </div>
        <Link to="/todos/create">
          <Button>
            <Plus className="mr-2 size-4" />
            Add Todo
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Search todos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTodos.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-center">
            <p className="text-muted-foreground">
              {sampleTodos.length === 0
                ? 'No todos yet. Create your first todo to get started!'
                : 'No todos match your current filters.'}
            </p>
            {sampleTodos.length === 0 && (
              <Link to="/todos/create" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 size-4" />
                  Create Your First Todo
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <button type="button" className="mt-1">
                  {todo.completed ? (
                    <CheckCircle2 className="size-5 text-green-600" />
                  ) : (
                    <Circle className="size-5 text-muted-foreground" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3
                      className={`font-medium ${todo.completed ? 'text-muted-foreground line-through' : ''}`}
                    >
                      {todo.title}
                    </h3>
                    <span
                      className={`rounded-full border px-2 py-1 text-xs ${getPriorityColor(todo.priority)}`}
                    >
                      {todo.priority}
                    </span>
                  </div>

                  {todo.description && (
                    <p
                      className={`mb-2 text-sm text-muted-foreground ${todo.completed ? 'line-through' : ''}`}
                    >
                      {todo.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {todo.dueDate && (
                      <span>
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {todo.tags.length > 0 && (
                      <div className="flex gap-1">
                        {todo.tags.map(tag => (
                          <span
                            key={tag}
                            className="rounded bg-secondary px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
