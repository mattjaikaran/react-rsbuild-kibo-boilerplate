export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function timeout<T>(promise: Promise<T>, ms: number, message?: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(message ?? `Operation timed out after ${ms}ms`))
    }, ms)
    promise
      .then((value) => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delay?: number; backoff?: number } = {},
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = 2 } = options
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < retries) {
        await sleep(delay * Math.pow(backoff, attempt))
      }
    }
  }

  throw lastError
}

export async function parallel<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number = Infinity,
): Promise<T[]> {
  if (concurrency === Infinity) {
    return Promise.all(tasks.map((task) => task()))
  }

  const results: T[] = []
  const executing: Promise<void>[] = []

  for (let i = 0; i < tasks.length; i++) {
    const p = tasks[i]!().then((result) => {
      results[i] = result
    })

    executing.push(p)

    if (executing.length >= concurrency) {
      await Promise.race(executing)
      executing.splice(
        executing.findIndex((e) => e === p),
        1,
      )
    }
  }

  await Promise.all(executing)
  return results
}

export async function series<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
  const results: T[] = []
  for (const task of tasks) {
    results.push(await task())
  }
  return results
}

export async function waterfall<T>(
  tasks: ((input: T) => Promise<T>)[],
  initialValue: T,
): Promise<T> {
  let result = initialValue
  for (const task of tasks) {
    result = await task(result)
  }
  return result
}

export function debounceAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let pendingReject: ((reason: unknown) => void) | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      if (pendingReject) {
        pendingReject(new Error('Debounced'))
        pendingReject = null
      }
    }

    return new Promise<ReturnType<T>>((resolve, reject) => {
      pendingReject = reject
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args)
          resolve(result as ReturnType<T>)
        } catch (err) {
          reject(err)
        } finally {
          timeoutId = null
          pendingReject = null
        }
      }, ms)
    })
  }
}

export function throttleAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let lastCall = 0
  let pending: Promise<ReturnType<T>> | null = null

  return async (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall < ms && pending) {
      return pending
    }

    lastCall = now
    pending = fn(...args) as Promise<ReturnType<T>>
    return pending
  }
}

export async function poll<T>(
  fn: () => Promise<T>,
  options: { interval?: number; maxAttempts?: number; condition?: (result: T) => boolean } = {},
): Promise<T> {
  const { interval = 1000, maxAttempts = Infinity, condition = () => true } = options

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await fn()
    if (condition(result)) return result
    if (attempt < maxAttempts - 1) await sleep(interval)
  }

  throw new Error('Polling max attempts reached')
}

export class AsyncQueue {
  private queue: (() => Promise<void>)[] = []
  private running = false
  private concurrency: number

  constructor(concurrency: number = 1) {
    this.concurrency = concurrency
  }

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await task())
        } catch (err) {
          reject(err)
        }
      })
      this.process()
    })
  }

  private async process(): Promise<void> {
    if (this.running) return
    this.running = true

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.concurrency)
      await Promise.all(batch.map((task) => task()))
    }

    this.running = false
  }

  get size(): number {
    return this.queue.length
  }
}
