export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags) as T
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item)) as T

  const cloned = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T {
  const result = deepClone(target)

  for (const source of sources) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceVal = source[key]
        const targetVal = result[key as keyof T]

        if (isObject(sourceVal) && isObject(targetVal)) {
          ;(result as Record<string, unknown>)[key] = deepMerge(
            targetVal as Record<string, unknown>,
            sourceVal as Record<string, unknown>,
          )
        } else {
          ;(result as Record<string, unknown>)[key] = deepClone(sourceVal)
        }
      }
    }
  }

  return result
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (isObject(value)) return Object.keys(value).length === 0
  return false
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}

export function get(obj: Record<string, unknown>, path: string, defaultValue?: unknown): unknown {
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let result: unknown = obj

  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue
    result = (result as Record<string, unknown>)[key]
  }

  return result === undefined ? defaultValue : result
}

export function set(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let current: Record<string, unknown> = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!
    if (!(key in current) || !isObject(current[key])) {
      current[key] = /^\d+$/.test(keys[i + 1]!) ? [] : {}
    }
    current = current[key] as Record<string, unknown>
  }

  current[keys[keys.length - 1]!] = value
}

export function has(obj: Record<string, unknown>, path: string): boolean {
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current === null || current === undefined || !isObject(current)) return false
    if (!(key in current)) return false
    current = current[key]
  }

  return true
}

export function mapKeys<T>(
  obj: Record<string, T>,
  fn: (key: string, value: T) => string,
): Record<string, T> {
  const result: Record<string, T> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[fn(key, value)] = value
  }
  return result
}

export function mapValues<T, U>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => U,
): Record<string, U> {
  const result: Record<string, U> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = fn(value, key)
  }
  return result
}

export function defaults<T extends Record<string, unknown>>(obj: T, ...sources: Partial<T>[]): T {
  const result = { ...obj }
  for (const source of sources) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key) && !(key in result)) {
        ;(result as Record<string, unknown>)[key] = source[key]
      }
    }
  }
  return result
}
