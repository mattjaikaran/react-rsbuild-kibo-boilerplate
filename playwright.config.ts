import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

/**
 * Journey tests live in `e2e/`. The backend JOURNEYS gate reads
 * `test-results/journeys.json`, so each journey is one test tagged `@J-NNN`
 * with `test.step('J-NNN-S<n>: ...')` titles. Build before running locally:
 * `bun run build && bun run test:e2e`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  /* The HTML report never opens: a failing gate must not wait for a browser. */
  reporter: [['list'], ['json', { outputFile: 'test-results/journeys.json' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'bun run preview',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
