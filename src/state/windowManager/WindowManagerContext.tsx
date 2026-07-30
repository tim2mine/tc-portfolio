import { createContext, useCallback, useMemo, useReducer, type ReactNode } from 'react'
import {
  initialWindowManagerState,
  windowManagerReducer,
} from './windowManagerReducer'
import type { Point, Size, WindowManagerState } from './types'

export interface WindowManagerContextValue {
  state: WindowManagerState
  openWindow: (id: string, defaultPosition: Point, defaultSize: Size) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  toggleMinimizeWindow: (id: string) => void
  focusWindow: (id: string) => void
  moveWindow: (id: string, position: Point) => void
}

export const WindowManagerContext = createContext<WindowManagerContextValue | null>(null)

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowManagerReducer, initialWindowManagerState)

  const openWindow = useCallback(
    (id: string, defaultPosition: Point, defaultSize: Size) =>
      dispatch({ type: 'OPEN', id, defaultPosition, defaultSize }),
    [],
  )
  const closeWindow = useCallback((id: string) => dispatch({ type: 'CLOSE', id }), [])
  const minimizeWindow = useCallback((id: string) => dispatch({ type: 'MINIMIZE', id }), [])
  const toggleMinimizeWindow = useCallback(
    (id: string) => dispatch({ type: 'TOGGLE_MINIMIZE', id }),
    [],
  )
  const focusWindow = useCallback((id: string) => dispatch({ type: 'FOCUS', id }), [])
  const moveWindow = useCallback(
    (id: string, position: Point) => dispatch({ type: 'MOVE', id, position }),
    [],
  )

  const value = useMemo<WindowManagerContextValue>(
    () => ({
      state,
      openWindow,
      closeWindow,
      minimizeWindow,
      toggleMinimizeWindow,
      focusWindow,
      moveWindow,
    }),
    [state, openWindow, closeWindow, minimizeWindow, toggleMinimizeWindow, focusWindow, moveWindow],
  )

  return (
    <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>
  )
}
