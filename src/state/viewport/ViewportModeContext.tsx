import { createContext, useEffect, useState, type ReactNode } from 'react'
import { MOBILE_BREAKPOINT_PX } from '../../utils/constants'

export type ViewportMode = 'desktop' | 'mobile'

export const ViewportModeContext = createContext<ViewportMode>('desktop')

function computeMode(): ViewportMode {
  if (typeof window === 'undefined') return 'desktop'
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px), (pointer: coarse)`).matches
    ? 'mobile'
    : 'desktop'
}

export function ViewportModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewportMode>(computeMode)

  useEffect(() => {
    const widthQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`)
    const pointerQuery = window.matchMedia('(pointer: coarse)')
    const update = () => setMode(computeMode())
    widthQuery.addEventListener('change', update)
    pointerQuery.addEventListener('change', update)
    return () => {
      widthQuery.removeEventListener('change', update)
      pointerQuery.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.viewport = mode
  }, [mode])

  return <ViewportModeContext.Provider value={mode}>{children}</ViewportModeContext.Provider>
}
