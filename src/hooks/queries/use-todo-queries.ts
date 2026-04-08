import { todoQueryKeys, todosApi } from '@/api/todos'
import type { PaginatedResponse, QueryParams, Todo } from '@/types'
import {
  type InfiniteData,
  useInfiniteQuery,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query'

interface TodoStats {
  total: number
  completed: number
  pending: number
  overdue: number
  byPriority: Record<string, number>
}

export const useTodos = (
  params?: QueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Todo>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<PaginatedResponse<Todo>, Error>({
    queryKey: todoQueryKeys.list(params),
    queryFn: () => todosApi.getTodos(params),
    staleTime: 30 * 1000,
    ...options,
  })
}

export const useInfiniteTodos = (params?: Omit<QueryParams, 'page'>) => {
  return useInfiniteQuery<
    PaginatedResponse<Todo>,
    Error,
    InfiniteData<PaginatedResponse<Todo>>,
    readonly unknown[],
    number
  >({
    queryKey: [...todoQueryKeys.lists(), 'infinite', params],
    queryFn: ({ pageParam }) =>
      todosApi.getTodos({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
  })
}

export const useTodo = (
  id: string,
  options?: Omit<UseQueryOptions<Todo, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Todo, Error>({
    queryKey: todoQueryKeys.detail(id),
    queryFn: () => todosApi.getTodo(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    ...options,
  })
}

export const useTodoStats = (
  options?: Omit<UseQueryOptions<TodoStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TodoStats, Error>({
    queryKey: todoQueryKeys.stats(),
    queryFn: () => todosApi.getStats(),
    staleTime: 60 * 1000,
    ...options,
  })
}

export const useTodosByPriority = (
  priority: 'low' | 'medium' | 'high',
  params?: Omit<QueryParams, 'filters'>,
  options?: Omit<UseQueryOptions<Todo[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Todo[], Error>({
    queryKey: todoQueryKeys.byPriority(priority),
    queryFn: () => todosApi.getByPriority(priority, params),
    ...options,
  })
}

export const useTodosByStatus = (
  completed: boolean,
  params?: Omit<QueryParams, 'filters'>,
  options?: Omit<UseQueryOptions<Todo[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Todo[], Error>({
    queryKey: todoQueryKeys.byStatus(completed),
    queryFn: () => todosApi.getByStatus(completed, params),
    ...options,
  })
}

export const useOverdueTodos = (
  options?: Omit<UseQueryOptions<Todo[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Todo[], Error>({
    queryKey: ['todos', 'overdue'],
    queryFn: () => todosApi.getOverdue(),
    refetchInterval: 5 * 60 * 1000,
    ...options,
  })
}

export const useTodosDueToday = (
  options?: Omit<UseQueryOptions<Todo[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Todo[], Error>({
    queryKey: ['todos', 'due-today'],
    queryFn: () => todosApi.getDueToday(),
    ...options,
  })
}

export const useSearchTodos = (
  query: string,
  params?: QueryParams,
  options?: Omit<UseQueryOptions<Todo[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Todo[], Error>({
    queryKey: ['todos', 'search', query, params],
    queryFn: () => todosApi.search(query, params),
    enabled: query.length >= 2,
    ...options,
  })
}
