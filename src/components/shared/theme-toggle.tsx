import { Moon, Sun } from 'lucide-react'
import { useToggleTheme } from '@/lib/store'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const toggleTheme = useToggleTheme()

  return (
    <Button type="button" variant="ghost" className="gap-2" onClick={toggleTheme}>
      <Moon aria-hidden className="size-5 dark:hidden" />
      <Sun aria-hidden className="hidden size-5 dark:block" />
      <span className="dark:hidden">Switch to dark mode</span>
      <span className="hidden dark:inline">Switch to light mode</span>
    </Button>
  )
}
