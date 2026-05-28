import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebouncedCallback = <T extends (...args: any[]) => unknown>(
  callback: T,
  delay: number = 500
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )

  useEffect(() => {
    const timeout = timeoutRef.current
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [])

  return debouncedCallback
}

interface DebounceWithLoadingState<T> {
  debouncedValue: T
  isDebouncing: boolean
}

type DebounceWithLoadingAction<T> =
  | { type: 'start' }
  | { type: 'done'; value: T }

function debounceReducer<T>(
  state: DebounceWithLoadingState<T>,
  action: DebounceWithLoadingAction<T>
): DebounceWithLoadingState<T> {
  switch (action.type) {
    case 'start':
      return { ...state, isDebouncing: true }
    case 'done':
      return { debouncedValue: action.value, isDebouncing: false }
    default:
      return state
  }
}

export const useDebounceWithLoading = <T>(
  value: T,
  delay: number = 500
): { debouncedValue: T; isDebouncing: boolean } => {
  const [state, dispatch] = useReducer(debounceReducer<T>, {
    debouncedValue: value,
    isDebouncing: false,
  })

  useEffect(() => {
    dispatch({ type: 'start' })

    const timer = setTimeout(() => {
      dispatch({ type: 'done', value })
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return state
}
