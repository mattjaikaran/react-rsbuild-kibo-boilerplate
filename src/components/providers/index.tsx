import { Toaster } from 'sonner'
import { QueryProvider } from '@/components/providers/query-provider'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      {children}
      <Toaster richColors position="bottom-right" />
    </QueryProvider>
  )
}

export { QueryProvider }
