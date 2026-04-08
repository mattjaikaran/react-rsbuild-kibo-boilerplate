import type { ApiError } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface OptimisticContext<TData> {
  previousData: TData | undefined
}

interface OptimisticMutationOptions<TData, TVariables> {
  queryKey: readonly unknown[]
  mutationFn: (variables: TVariables) => Promise<TData>
  optimisticUpdate: (old: TData | undefined, variables: TVariables) => TData
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: OptimisticContext<TData>
  ) => void
  onError?: (
    error: ApiError,
    variables: TVariables,
    context: OptimisticContext<TData> | undefined
  ) => void
  onSettled?: (
    data: TData | undefined,
    error: ApiError | null,
    variables: TVariables,
    context: OptimisticContext<TData> | undefined
  ) => void
}

export const useOptimisticMutation = <TData, TVariables>({
  queryKey,
  mutationFn,
  optimisticUpdate,
  onSuccess,
  onError,
  onSettled,
}: OptimisticMutationOptions<TData, TVariables>) => {
  const queryClient = useQueryClient()

  return useMutation<TData, ApiError, TVariables, OptimisticContext<TData>>({
    mutationFn,
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<TData>(queryKey)

      queryClient.setQueryData<TData>(queryKey, old =>
        optimisticUpdate(old, variables)
      )

      return { previousData }
    },
    onError: (error, variables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
      onError?.(error, variables, context)
    },
    onSuccess: (data, variables, context) => {
      onSuccess?.(data, variables, context)
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey })
      onSettled?.(data, error, variables, context)
    },
  })
}

export const useOptimisticAdd = <TItem extends { id: string }>(
  queryKey: readonly unknown[],
  mutationFn: (variables: Partial<TItem>) => Promise<TItem>
) => {
  const queryClient = useQueryClient()

  return useMutation<
    TItem,
    ApiError,
    Partial<TItem>,
    { previousData: TItem[] | undefined }
  >({
    mutationFn,
    onMutate: async newItem => {
      await queryClient.cancelQueries({ queryKey })
      const previousData = queryClient.getQueryData<TItem[]>(queryKey)

      const tempItem = {
        ...newItem,
        id: `temp-${Date.now()}`,
      } as unknown as TItem

      queryClient.setQueryData<TItem[]>(queryKey, old =>
        old ? [...old, tempItem] : [tempItem]
      )

      return { previousData }
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSuccess: newItem => {
      queryClient.setQueryData<TItem[]>(
        queryKey,
        old =>
          old?.map(item => (item.id.startsWith('temp-') ? newItem : item)) || [
            newItem,
          ]
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

export const useOptimisticUpdate = <TItem extends { id: string }>(
  queryKey: readonly unknown[],
  mutationFn: (variables: { id: string } & Partial<TItem>) => Promise<TItem>
) => {
  const queryClient = useQueryClient()

  return useMutation<
    TItem,
    ApiError,
    { id: string } & Partial<TItem>,
    { previousData: TItem[] | undefined }
  >({
    mutationFn,
    onMutate: async updatedItem => {
      await queryClient.cancelQueries({ queryKey })
      const previousData = queryClient.getQueryData<TItem[]>(queryKey)

      queryClient.setQueryData<TItem[]>(queryKey, old =>
        old?.map(item =>
          item.id === updatedItem.id
            ? ({ ...item, ...updatedItem } as TItem)
            : item
        )
      )

      return { previousData }
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

export const useOptimisticRemove = <TItem extends { id: string }>(
  queryKey: readonly unknown[],
  mutationFn: (id: string) => Promise<{ message: string }>
) => {
  const queryClient = useQueryClient()

  return useMutation<
    { message: string },
    ApiError,
    string,
    { previousData: TItem[] | undefined }
  >({
    mutationFn,
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey })
      const previousData = queryClient.getQueryData<TItem[]>(queryKey)

      queryClient.setQueryData<TItem[]>(queryKey, old =>
        old?.filter(item => item.id !== id)
      )

      return { previousData }
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
