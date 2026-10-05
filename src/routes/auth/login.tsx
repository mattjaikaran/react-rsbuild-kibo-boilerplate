import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { LoginForm } from '@/forms/auth/login-form'
import { useStore } from '@/lib/store'

// TanStack file-router registration requires Route; its plugin owns route HMR.
// react-doctor-disable-next-line react-doctor/only-export-components
export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

export function LoginPage() {
  const navigate = useNavigate()
  const login = useStore((state) => state.login)
  const isLoading = useStore((state) => state.isLoading)
  const error = useStore((state) => state.error)

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1" />
          <CardContent>
            {error && (
              <p role="alert" className="text-destructive">
                {error}
              </p>
            )}
            <LoginForm
              isLoading={isLoading}
              onSubmit={async (data) => {
                try {
                  await login(data)
                  await navigate({ to: '/dashboard' })
                } catch {
                  // The store supplies the form's error message.
                }
              }}
              onSwitchToRegister={() => {
                navigate({ to: '/auth/register' })
              }}
              onSwitchToMagicLink={() => {
                navigate({ to: '/auth/magic-link' })
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
