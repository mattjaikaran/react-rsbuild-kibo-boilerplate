import { createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layouts/main-layout'

interface RouterContext {
  queryClient: QueryClient
}

// TanStack file-router registration requires Route; its plugin owns route HMR.
// react-doctor-disable-next-line react-doctor/only-export-components
export const Route = createRootRouteWithContext<RouterContext>()({
  component: MainLayout,
})
