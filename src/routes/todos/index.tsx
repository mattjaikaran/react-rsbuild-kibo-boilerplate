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
import { useStore } from '@/lib/store'
import { TodoForm } from '@/forms/todos/todo-form'
import type { Todo } from '@/types'

// TanStack file-router registration requires Route; its plugin owns route HMR.
// react-doctor-disable-next-line react-doctor/only-export-components
export const Route = createFileRoute('/todos/')({
  component: TodosPage,
})

export function TodosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const todos = useStore((state) => state.todos)
  const toggleTodo = useStore((state) => state.toggleTodo)
  const deleteTodo = useStore((state) => state.deleteTodo)
  const updateTodo = useStore((state) => state.updateTodo)
  const isLoading = useStore((state) => state.isLoading)
  const error = useStore((state) => state.error)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter
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
            Manage demo tasks for this visit. Changes are not saved to a server and reset on reload.
          </p>
        </div>
        <Link to="/todos/create">
          <Button>
            <Plus className="mr-2 size-4" />
            Add Todo
          </Button>
        </Link>
      </div>
      {error && <p role="alert">{error}</p>}
      {editingTodo && (
        <div className="rounded-lg border bg-card p-6">
          <TodoForm
            key={editingTodo.id}
            defaultValues={editingTodo}
            isLoading={isLoading}
            onCancel={() => setEditingTodo(null)}
            onSubmit={async (data) => {
              await updateTodo(editingTodo.id, data)
              if (!useStore.getState().error) setEditingTodo(null)
            }}
          />
        </div>
      )}

      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                aria-label="Search todos"
                placeholder="Search todos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger aria-label="Filter by priority" className="w-[140px]">
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
            <SelectTrigger aria-label="Filter by status" className="w-[120px]">
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
              {todos.length === 0
                ? 'No todos yet. Create your first todo to get started!'
                : 'No todos match your current filters.'}
            </p>
            {todos.length === 0 && (
              <Link to="/todos/create" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 size-4" />
                  Create Your First Todo
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div key={todo.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="mt-1"
                  aria-label={`${todo.completed ? 'Mark pending' : 'Complete'}: ${todo.title}`}
                  aria-pressed={todo.completed}
                  disabled={isLoading}
                  onClick={() => {
                    void toggleTodo(todo.id)
                  }}
                >
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
                      <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                    )}
                    {todo.tags.length > 0 && (
                      <div className="flex gap-1">
                        {todo.tags.map((tag) => (
                          <span key={tag} className="rounded bg-secondary px-2 py-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => setEditingTodo(todo)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Delete ${todo.title}`}
                    disabled={isLoading}
                    onClick={() => {
                      void deleteTodo(todo.id)
                    }}
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
