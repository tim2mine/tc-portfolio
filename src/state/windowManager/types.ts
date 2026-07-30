export interface Point {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Bounds {
  position: Point
  size: Size
}

export interface WindowState {
  id: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  position: Point
  size: Size
  restoreBounds: Bounds | null
}

export interface WindowManagerState {
  windows: Record<string, WindowState>
  order: string[]
  focusedId: string | null
  nextZIndex: number
}

export type WindowManagerAction =
  | { type: 'OPEN'; id: string; defaultPosition: Point; defaultSize: Size }
  | { type: 'CLOSE'; id: string }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'TOGGLE_MINIMIZE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'MOVE'; id: string; position: Point }
  | { type: 'RESIZE'; id: string; position: Point; size: Size }
  | { type: 'TOGGLE_MAXIMIZE'; id: string; maximizedBounds: Bounds }
