import {
  todoArchiveCompleted,
  todoBulkDelete,
  todoBulkUpdate,
  todoCreate,
  todoDelete,
  todoGet,
  todoList,
  todoStats,
  todoToggle,
  todoUpdate,
} from '@/api/generated/sdk.gen'
import type { TodoListData } from '@/api/generated/types.gen'
import type {
  CreateTodoRequest,
  PaginatedResponse,
  QueryParams,
  Todo,
  UpdateTodoRequest,
} from '@/types'

export const todoQueryKeys = {
  all: ['todos'] as const,
  lists: () => [...todoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...todoQueryKeys.lists(), params] as const,
  details: () => [...todoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoQueryKeys.details(), id] as const,
  stats: () => [...todoQueryKeys.all, 'stats'] as const,
  byPriority: (priority: string) => [...todoQueryKeys.all, 'priority', priority] as const,
  byStatus: (completed: boolean) => [...todoQueryKeys.all, 'status', completed] as const,
}

type TodoListQuery = NonNullable<TodoListData['query']>

/**
 * App-facing todo contract on top of the generated SDK.
 *
 * List filters stay in one place (`TodoListQuery`) so the generated operation
 * owns the wire format; array-returning helpers unwrap the paginated envelope.
 */
export const todosApi = {
  getTodos: async (params?: QueryParams): Promise<PaginatedResponse<Todo>> => {
    const { data } = await todoList({ query: params, throwOnError: true })
    return data
  },

  getTodo: async (id: string): Promise<Todo> => {
    const { data } = await todoGet({ path: { todoId: id }, throwOnError: true })
    return data
  },

  createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
    const { data } = await todoCreate({ body: todo, throwOnError: true })
    return data
  },

  updateTodo: async (id: string, updates: UpdateTodoRequest): Promise<Todo> => {
    const { data } = await todoUpdate({
      path: { todoId: id },
      body: updates,
      throwOnError: true,
    })
    return data
  },

  deleteTodo: async (id: string): Promise<{ message: string }> => {
    const { data } = await todoDelete({ path: { todoId: id }, throwOnError: true })
    return data
  },

  toggleTodo: async (id: string): Promise<Todo> => {
    const { data } = await todoToggle({ path: { todoId: id }, throwOnError: true })
    return data
  },

  getStats: async (): Promise<{
    total: number
    completed: number
    pending: number
    overdue: number
    byPriority: Record<string, number>
  }> => {
    const { data } = await todoStats({ throwOnError: true })
    return data
  },

  getByPriority: async (
    priority: string,
    params?: Omit<QueryParams, 'filters'>,
  ): Promise<Todo[]> => {
    const { data } = await todoList({
      query: { ...params, priority } as TodoListQuery,
      throwOnError: true,
    })
    return data.data
  },

  getByStatus: async (
    completed: boolean,
    params?: Omit<QueryParams, 'filters'>,
  ): Promise<Todo[]> => {
    const { data } = await todoList({
      query: { ...params, completed },
      throwOnError: true,
    })
    return data.data
  },

  getOverdue: async (): Promise<Todo[]> => {
    const { data } = await todoList({ query: { overdue: true }, throwOnError: true })
    return data.data
  },

  getDueToday: async (): Promise<Todo[]> => {
    const { data } = await todoList({ query: { due_today: true }, throwOnError: true })
    return data.data
  },

  search: async (query: string, params?: QueryParams): Promise<Todo[]> => {
    const { data } = await todoList({ query: { ...params, search: query }, throwOnError: true })
    return data.data
  },

  bulkUpdate: async (ids: string[], updates: UpdateTodoRequest): Promise<Todo[]> => {
    const { data } = await todoBulkUpdate({ body: { ids, ...updates }, throwOnError: true })
    return data
  },

  bulkDelete: async (ids: string[]): Promise<{ deletedCount: number }> => {
    const { data } = await todoBulkDelete({ body: { ids }, throwOnError: true })
    return data
  },

  archiveCompleted: async (): Promise<{ message: string; archivedCount: number }> => {
    const { data } = await todoArchiveCompleted({ throwOnError: true })
    return data
  },
}
