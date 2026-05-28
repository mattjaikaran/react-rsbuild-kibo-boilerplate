import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { MagicLinkForm } from '@/forms/auth/magic-link-form'

export const Route = createFileRoute('/auth/magic-link')({
  component: MagicLinkPage,
})

// react-doctor-disable-next-line react-doctor/only-export-components
function MagicLinkPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1" />
          <CardContent>
            <MagicLinkForm
              onSubmit={async (data) => {
                console.log('Magic link:', data)
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
