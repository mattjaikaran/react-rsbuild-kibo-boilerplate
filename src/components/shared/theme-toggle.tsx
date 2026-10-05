import { Moon, Sun } from 'lucide-react'
import { useToggleTheme } from '@/lib/store'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const toggleTheme = useToggleTheme()

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun
        aria-hidden
        className="size-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"
      />
      <Moon
        aria-hidden
        className="absolute size-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
