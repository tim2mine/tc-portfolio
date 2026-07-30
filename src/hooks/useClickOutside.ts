import { useEffect, useRef, type RefObject } from 'react'

export function useClickOutside<T extends HTMLElement>(onOutside: () => void): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutside()
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [onOutside])

  return ref
}
