import { useContext } from 'react'
import { ViewportModeContext, type ViewportMode } from '../state/viewport/ViewportModeContext'

/** Falls back to 'desktop' outside a ViewportModeProvider — a safe default, not an error case. */
export function useViewportMode(): ViewportMode {
  return useContext(ViewportModeContext)
}
