export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

export function uniqueBy<T>(arr: T[], key: keyof T | ((item: T) => unknown)): T[] {
  const seen = new Set()
  return arr.filter((item) => {
    const k = typeof key === 'function' ? key(item) : item[key]
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

export function groupBy<T>(arr: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return arr.reduce(
    (groups, item) => {
      const k = typeof key === 'function' ? key(item) : String(item[key])
      if (!groups[k]) groups[k] = []
      groups[k].push(item)
      return groups
    },
    {} as Record<string, T[]>,
  )
}

export function sortBy<T>(arr: T[], key: keyof T | ((item: T) => number | string), order: 'asc' | 'desc' = 'asc'): T[] {
  return arr.toSorted((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key]
    const bVal = typeof key === 'function' ? key(b) : b[key]
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return order === 'asc' ? comparison : -comparison
  })
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.flat() as T[]
}

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

export function sample<T>(arr: T[], count: number = 1): T[] {
  const shuffled = shuffle(arr)
  return shuffled.slice(0, count)
}

export function intersection<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b)
  return a.filter((item) => setB.has(item))
}

export function difference<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b)
  return a.filter((item) => !setB.has(item))
}

export function union<T>(a: T[], b: T[]): T[] {
  return unique([...a, ...b])
}

export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = []
  const fail: T[] = []
  for (const item of arr) {
    if (predicate(item)) {
      pass.push(item)
    } else {
      fail.push(item)
    }
  }
  return [pass, fail]
}

export function compact<T>(arr: (T | null | undefined | false | 0 | '')[]): T[] {
  return arr.filter(Boolean) as T[]
}

export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}

export function zip<T, U>(a: T[], b: U[]): [T, U][] {
  const length = Math.min(a.length, b.length)
  const result: [T, U][] = []
  for (let i = 0; i < length; i++) {
    result.push([a[i]!, b[i]!])
  }
  return result
}

export function move<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...arr]
  const [item] = result.splice(fromIndex, 1) as [T]
  result.splice(toIndex, 0, item)
  return result
}
