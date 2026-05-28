import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { RegisterForm } from '@/forms/auth/register-form'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

// react-doctor-disable-next-line react-doctor/only-export-components
function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1" />
          <CardContent>
            <RegisterForm
              onSubmit={async (data) => {
                console.log('Register:', data)
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
