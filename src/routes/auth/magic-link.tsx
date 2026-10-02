import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { MagicLinkForm } from '@/forms/auth/magic-link-form'
import { useStore } from '@/lib/store'
import { useState } from 'react'

export const Route = createFileRoute('/auth/magic-link')({
  component: MagicLinkPage,
})

// react-doctor-disable-next-line react-doctor/only-export-components
export function MagicLinkPage() {
  const navigate = useNavigate()
  const magicLink = useStore(state => state.magicLink)
  const isLoading = useStore(state => state.isLoading)
  const error = useStore(state => state.error)
  const [sent, setSent] = useState(false)

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1" />
          <CardContent>
            {error && <p role="alert" className="text-destructive">{error}</p>}
            {sent && <p role="status">If registered, you will receive a magic link.</p>}
            <MagicLinkForm
              isLoading={isLoading}
              onSubmit={async data => {
                try {
                  await magicLink(data)
                  setSent(true)
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
