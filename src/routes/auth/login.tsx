import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { LoginForm } from '@/forms/auth/login-form'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1" />
          <CardContent>
            <LoginForm
              onSubmit={async (data) => {
                console.log('Login:', data)
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
