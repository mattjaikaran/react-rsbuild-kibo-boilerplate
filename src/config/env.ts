export const env = {
  apiUrl: import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8000/api',
  apiTimeout: Number(import.meta.env.PUBLIC_API_TIMEOUT ?? 10000),
  appName:
    import.meta.env.PUBLIC_APP_NAME ?? 'React Rsbuild Boilerplate',
  appEnv: import.meta.env.PUBLIC_APP_ENV ?? 'development',
  isDev: import.meta.env.MODE === 'development',
  isProd: import.meta.env.MODE === 'production',
} as const
