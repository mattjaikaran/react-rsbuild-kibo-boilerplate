import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
  ]

  return (
    <nav className={`border-b bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center">
              <span className="text-xl font-bold text-primary">
                React Rsbuild
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-x-8 md:flex">
            {navigation.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                activeProps={{
                  className: 'text-primary bg-primary/10',
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-x-4 md:flex">
            <ThemeToggle />
            <div className="flex items-center gap-x-2">
              <Button variant="ghost" asChild>
                <Link to={'/auth/login' as string}>Sign In</Link>
              </Button>
              <Button asChild>
                <Link to={'/auth/register' as string}>Sign Up</Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-x-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-foreground transition-colors hover:text-primary"
                  activeProps={{
                    className: 'text-primary bg-primary/10',
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-border pb-3 pt-4">
              <div className="space-y-1 px-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link
                    to={'/auth/login' as string}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link
                    to={'/auth/register' as string}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
