import { useCallback, useRef } from 'react'

const HOURGLASS_DURATION_MS = 400

export function useHourglassCursor() {
  const timeoutRef = useRef<number | undefined>(undefined)

  return useCallback(() => {
    document.body.classList.add('cursor-hourglass')
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      document.body.classList.remove('cursor-hourglass')
    }, HOURGLASS_DURATION_MS)
  }, [])
}
