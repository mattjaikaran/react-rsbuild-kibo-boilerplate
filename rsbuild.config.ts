import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack'
import { createDevProxy } from './src/config/proxy.ts'

/**
 * Dev proxy, not used by the static production build.
 *
 * `changeOrigin: true` rewrites `Host` to this target. In Docker the target is
 * `http://api-dev:8000`, so Django must list `api-dev` in `ALLOWED_HOSTS`;
 * otherwise every proxied request returns `400 DisallowedHost`.
 */
const apiProxyTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:8000'

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
  html: {
    template: './index.html',
    title: 'React Rsbuild + Kibo UI Boilerplate',
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  tools: {
    rspack: {
      plugins: [TanStackRouterRspack()],
    },
  },
  server: {
    port: 3000,
    proxy: createDevProxy(apiProxyTarget),
  },
  output: {
    cleanDistPath: true,
  },
})
