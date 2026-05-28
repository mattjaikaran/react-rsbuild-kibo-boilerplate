import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TodoForm } from '@/forms/todos/todo-form'

export const Route = createFileRoute('/todos/create')({
  component: CreateTodoPage,
})

// react-doctor-disable-next-line react-doctor/only-export-components
function CreateTodoPage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate({ to: '/todos' })
  }

  const handleCancel = () => {
    navigate({ to: '/todos' })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Todo</h1>
          <p className="text-muted-foreground">
            Add a new task to your todo list
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <TodoForm
          onSubmit={async (data) => {
            console.log('Create todo:', data)
            handleSuccess()
          }}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
