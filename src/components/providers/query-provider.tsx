import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

// To enable devtools: bun add -d @tanstack/react-query-devtools
// Then uncomment the lazy import and JSX below

interface QueryProviderProps {
  children: React.ReactNode
}

interface ApiErrorWithResponse {
  response?: {
    status?: number
  }
}

function isApiError(error: unknown): error is ApiErrorWithResponse {
  return typeof error === 'object' && error !== null && 'response' in error
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: (failureCount, error: unknown) => {
              if (isApiError(error)) {
                const status = error.response?.status
                if (status && status >= 400 && status < 500) {
                  if (status === 408 || status === 429) {
                    return failureCount < 2
                  }
                  return false
                }
              }
              return failureCount < 3
            },
            retryDelay: (attemptIndex: number) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: (failureCount, error: unknown) => {
              if (isApiError(error)) {
                const status = error.response?.status
                if (status && status >= 400 && status < 500) {
                  return false
                }
              }
              return failureCount < 2
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  )
}
