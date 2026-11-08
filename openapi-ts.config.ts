import { defineConfig } from '@hey-api/openapi-ts'

/**
 * OpenAPI contract used to generate `src/api/generated`.
 *
 * `OPENAPI_SPEC` lets a mattstack monorepo point at its live backend contract,
 * for example `../backend/docs/openapi/openapi.json`. Standalone, the vendored
 * fixture above keeps the app buildable before a backend exists.
 */
const input = process.env.OPENAPI_SPEC ?? 'backend/docs/openapi/openapi.json'

export default defineConfig({
  input,
  output: 'src/api/generated',
  plugins: [
    '@hey-api/typescript',
    {
      name: '@hey-api/client-axios',
      baseUrl: false,
      runtimeConfigPath: '@/api/client-config',
    },
    '@hey-api/sdk',
    {
      name: 'zod',
      compatibilityVersion: 4,
      requests: true,
      responses: true,
      definitions: true,
    },
    '@tanstack/react-query',
  ],
})
