import { apiClient } from '@/api/client'
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

export const todosApi = {
  getTodos: async (params?: QueryParams): Promise<PaginatedResponse<Todo>> => {
    const { data } = await apiClient.get('/todos', { params })
    return data
  },

  getTodo: async (id: string): Promise<Todo> => {
    const { data } = await apiClient.get(`/todos/${id}`)
    return data
  },

  createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
    const { data } = await apiClient.post('/todos', todo)
    return data
  },

  updateTodo: async (id: string, updates: UpdateTodoRequest): Promise<Todo> => {
    const { data } = await apiClient.patch(`/todos/${id}`, updates)
    return data
  },

  deleteTodo: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/todos/${id}`)
    return data
  },

  toggleTodo: async (id: string): Promise<Todo> => {
    const { data } = await apiClient.post(`/todos/${id}/toggle`)
    return data
  },

  getStats: async (): Promise<{
    total: number
    completed: number
    pending: number
    overdue: number
    byPriority: Record<string, number>
  }> => {
    const { data } = await apiClient.get('/todos/stats')
    return data
  },

  getByPriority: async (priority: string, params?: Omit<QueryParams, 'filters'>): Promise<Todo[]> => {
    const { data } = await apiClient.get('/todos', {
      params: { ...params, priority },
    })
    return data
  },

  getByStatus: async (completed: boolean, params?: Omit<QueryParams, 'filters'>): Promise<Todo[]> => {
    const { data } = await apiClient.get('/todos', {
      params: { ...params, completed },
    })
    return data
  },

  getOverdue: async (): Promise<Todo[]> => {
    const { data } = await apiClient.get('/todos', {
      params: { overdue: true },
    })
    return data
  },

  getDueToday: async (): Promise<Todo[]> => {
    const { data } = await apiClient.get('/todos', {
      params: { due_today: true },
    })
    return data
  },

  search: async (query: string, params?: QueryParams): Promise<Todo[]> => {
    const { data } = await apiClient.get('/todos', {
      params: { ...params, search: query },
    })
    return data
  },

  bulkUpdate: async (ids: string[], updates: UpdateTodoRequest): Promise<Todo[]> => {
    const { data } = await apiClient.patch('/todos/bulk', { ids, ...updates })
    return data
  },

  bulkDelete: async (ids: string[]): Promise<{ deletedCount: number }> => {
    const { data } = await apiClient.post('/todos/bulk-delete', { ids })
    return data
  },

  archiveCompleted: async (): Promise<{ message: string; archivedCount: number }> => {
    const { data } = await apiClient.post('/todos/archive-completed')
    return data
  },
}
