import { describe, expect, it } from 'vitest'
import { createDevProxy } from './proxy'

describe('createDevProxy', () => {
  it('proxies Django paths and rewrites the request host to the target', () => {
    expect(createDevProxy('http://api-dev:8000')).toEqual({
      '/api': { target: 'http://api-dev:8000', changeOrigin: true },
      '/admin': { target: 'http://api-dev:8000', changeOrigin: true },
      '/static/admin': { target: 'http://api-dev:8000', changeOrigin: true },
      '/media': { target: 'http://api-dev:8000', changeOrigin: true },
    })
  })
})
