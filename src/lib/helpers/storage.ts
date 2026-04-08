export class StorageManager {
  private storage: Storage
  private prefix: string

  constructor(storage: Storage, prefix: string = '') {
    this.storage = storage
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}:${key}` : key
  }

  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = this.storage.getItem(this.getKey(key))
      if (item === null) return defaultValue
      return JSON.parse(item) as T
    } catch {
      return defaultValue
    }
  }

  set<T>(key: string, value: T): void {
    try {
      this.storage.setItem(this.getKey(key), JSON.stringify(value))
    } catch (err) {
      console.error(`Failed to set storage key "${key}":`, err)
    }
  }

  remove(key: string): void {
    this.storage.removeItem(this.getKey(key))
  }

  clear(): void {
    if (this.prefix) {
      const keysToRemove: string[] = []
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i)
        if (key?.startsWith(this.prefix)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((key) => this.storage.removeItem(key))
    } else {
      this.storage.clear()
    }
  }

  has(key: string): boolean {
    return this.storage.getItem(this.getKey(key)) !== null
  }

  keys(): string[] {
    const result: string[] = []
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key) {
        if (this.prefix) {
          if (key.startsWith(`${this.prefix}:`)) {
            result.push(key.slice(this.prefix.length + 1))
          }
        } else {
          result.push(key)
        }
      }
    }
    return result
  }
}

export const local = new StorageManager(
  typeof window !== 'undefined' ? window.localStorage : ({} as Storage),
)

export const session = new StorageManager(
  typeof window !== 'undefined' ? window.sessionStorage : ({} as Storage),
)
