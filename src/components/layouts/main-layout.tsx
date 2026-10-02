import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'

export function MainLayout() {
  const isAuthenticated = useStore(state => state.isAuthenticated)
  const logout = useStore(state => state.logout)
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <nav className="flex items-center gap-x-6 text-sm font-medium">
            <Link to="/" className="font-bold">
              Rsbuild + Kibo
            </Link>
            <Link
              to="/"
              className="transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="transition-colors hover:text-foreground/80"
            >
              About
            </Link>
            <Link
              to="/examples"
              className="transition-colors hover:text-foreground/80"
            >
              Examples
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-x-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button variant="ghost" onClick={async () => {
                try {
                  await logout()
                } catch {
                  useStore.getState().setError('Signed out locally. Server logout failed.')
                } finally {
                  await navigate({ to: '/auth/login' })
                }
              }}>Sign Out</Button>
            ) : (
              <Button variant="ghost" asChild><Link to="/auth/login">Sign In</Link></Button>
            )}
          </div>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          Built with React + Rsbuild + Kibo UI
        </div>
      </footer>
    </div>
  )
}
