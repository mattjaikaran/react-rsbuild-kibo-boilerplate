import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Button } from '@/components/ui/button'
import { useSetTheme, useStore, useTheme } from '@/lib/store'
import { useEffect } from 'react'

export function MainLayout() {
  const isAuthenticated = useStore((state) => state.isAuthenticated)
  const logout = useStore((state) => state.logout)
  const navigate = useNavigate()
  const theme = useTheme()
  const setTheme = useSetTheme()
  useEffect(() => {
    if (theme !== 'system') return
    const preference = window.matchMedia('(prefers-color-scheme: dark)')
    const followSystem = () => setTheme('system')
    preference.addEventListener('change', followSystem)
    return () => preference.removeEventListener('change', followSystem)
  }, [theme, setTheme])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex min-h-14 flex-wrap items-center gap-3 py-3 sm:flex-nowrap">
          <nav
            aria-label="Main navigation"
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium"
          >
            <Link to="/" className="font-bold">
              Rsbuild + Kibo
            </Link>
            <Link to="/" className="transition-colors hover:text-foreground/80">
              Home
            </Link>
            <Link to="/about" className="transition-colors hover:text-foreground/80">
              About
            </Link>
            <Link to="/examples" className="transition-colors hover:text-foreground/80">
              Examples
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-x-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button
                variant="ghost"
                onClick={async () => {
                  try {
                    await logout()
                  } catch {
                    useStore.getState().setError('Signed out locally. Server logout failed.')
                  } finally {
                    await navigate({ to: '/auth/login' })
                  }
                }}
              >
                Sign Out
              </Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Sign In</Link>
              </Button>
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
