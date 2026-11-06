import type { ProxyConfig } from '@rsbuild/core'

/** Backend paths the dev server serves on the same origin as the app. */
export const DEV_PROXY_PATHS = ['/api', '/admin', '/static/admin', '/media'] as const

/**
 * Build the dev-server proxy for the Django backend.
 *
 * `changeOrigin: true` rewrites `Host` to the target host. Under Docker the
 * target is `http://api-dev:8000`, so Django requires `api-dev` in
 * `ALLOWED_HOSTS` and answers `400 DisallowedHost` otherwise.
 */
export function createDevProxy(target: string): ProxyConfig {
  return Object.fromEntries(DEV_PROXY_PATHS.map((path) => [path, { target, changeOrigin: true }]))
}
