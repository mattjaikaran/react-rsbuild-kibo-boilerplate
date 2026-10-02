import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { RegisterForm } from '@/forms/auth/register-form'
import { useStore } from '@/lib/store'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

// react-doctor-disable-next-line react-doctor/only-export-components
export function RegisterPage() {
  const navigate = useNavigate()
  const register = useStore(state => state.register)
  const isLoading = useStore(state => state.isLoading)
  const error = useStore(state => state.error)

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1" />
          <CardContent>
            {error && <p role="alert" className="text-destructive">{error}</p>}
            <RegisterForm
              isLoading={isLoading}
              onSubmit={async data => {
                try {
                  await register(data)
                  await navigate({ to: '/dashboard' })
                } catch {
                  // The store supplies the form's error message.
                }
              }}
              onSwitchToLogin={() => {
                navigate({ to: '/auth/login' })
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
