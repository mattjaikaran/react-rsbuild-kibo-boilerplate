import { apiClient } from '@/api/client'
import type { ApiResponse, PaginatedResponse } from '@/types'
import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  type UseMutationOptions,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'

export const useApiGet = <TData = unknown, TError = Error>(
  url: string,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TData, TError>({
    queryKey: [url],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<TData>>(url)
      return response.data.data
    },
    ...options,
  })
}

export const useApiQuery = <TData = unknown, TError = Error>(
  queryKey: readonly unknown[],
  url: string,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<TData>>(url)
      return response.data.data
    },
    ...options,
  })
}

export const useApiPost = <
  TData = unknown,
  TError = Error,
  TVariables = unknown,
>(
  url: string,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (data: TVariables) => {
      const response = await apiClient.post<ApiResponse<TData>>(url, data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [url] })
    },
    ...options,
  })
}

export const useApiPut = <
  TData = unknown,
  TError = Error,
  TVariables = unknown,
>(
  url: string,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (data: TVariables) => {
      const response = await apiClient.put<ApiResponse<TData>>(url, data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [url] })
    },
    ...options,
  })
}

export const useApiPatch = <
  TData = unknown,
  TError = Error,
  TVariables = unknown,
>(
  url: string,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (data: TVariables) => {
      const response = await apiClient.patch<ApiResponse<TData>>(url, data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [url] })
    },
    ...options,
  })
}

export const useApiDelete = <TData = unknown, TError = Error>(
  url: string,
  options?: Omit<UseMutationOptions<TData, TError, void>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()
  return useMutation<TData, TError, void>({
    mutationFn: async () => {
      const response = await apiClient.delete<ApiResponse<TData>>(url)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [url] })
    },
    ...options,
  })
}

export const useApiDeleteById = <TData = unknown, TError = Error>(
  baseUrl: string,
  options?: Omit<UseMutationOptions<TData, TError, string>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()
  return useMutation<TData, TError, string>({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<ApiResponse<TData>>(`${baseUrl}/${id}`)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [baseUrl] })
    },
    ...options,
  })
}

export const useApiInfinite = <TData = unknown, TError = Error>(
  queryKey: readonly unknown[],
  url: string
) => {
  return useInfiniteQuery<
    PaginatedResponse<TData>,
    TError,
    InfiniteData<PaginatedResponse<TData>>,
    readonly unknown[],
    number
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<TData>>>(
        url,
        {
          params: { page: pageParam },
        }
      )
      return response.data.data
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
  })
}

export const usePrefetch = () => {
  const queryClient = useQueryClient()

  return {
    prefetch: async <TData>(
      queryKey: readonly unknown[],
      queryFn: () => Promise<TData>
    ) => {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
      })
    },
    prefetchUrl: async <TData>(queryKey: readonly unknown[], url: string) => {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: async () => {
          const response = await apiClient.get<ApiResponse<TData>>(url)
          return response.data.data
        },
      })
    },
  }
}

export const useInvalidate = () => {
  const queryClient = useQueryClient()

  return {
    invalidate: (queryKey: readonly unknown[]) =>
      queryClient.invalidateQueries({ queryKey }),
    invalidateAll: () => queryClient.invalidateQueries(),
    invalidateExact: (queryKey: readonly unknown[]) =>
      queryClient.invalidateQueries({ queryKey, exact: true }),
    remove: (queryKey: readonly unknown[]) =>
      queryClient.removeQueries({ queryKey }),
  }
}
