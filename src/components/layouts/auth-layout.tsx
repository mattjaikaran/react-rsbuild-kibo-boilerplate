import { Outlet } from '@tanstack/react-router'

interface AuthLayoutProps {
  children?: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 px-4">
        {children || <Outlet />}
      </div>
    </div>
  )
}
