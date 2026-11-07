import type { ChartTheme } from '@tanstack/charts'

/**
 * Chart colors resolve from the same semantic tokens as the rest of the UI, so
 * charts follow the light/dark class toggled by the Zustand `ui` slice without
 * rebuilding their definitions.
 */
export const chartTheme: Partial<ChartTheme> = {
  foreground: 'hsl(var(--foreground))',
  muted: 'hsl(var(--muted-foreground))',
  grid: 'hsl(var(--border))',
  background: 'transparent',
  palette: [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ],
}
