import type { WindowManagerAction, WindowManagerState, WindowState } from './types'

export const initialWindowManagerState: WindowManagerState = {
  windows: {},
  order: [],
  focusedId: null,
  nextZIndex: 10,
}

function topVisibleWindowId(
  windows: Record<string, WindowState>,
  order: string[],
  excludeId?: string,
): string | null {
  let topId: string | null = null
  let topZ = -Infinity
  for (const id of order) {
    if (id === excludeId) continue
    const win = windows[id]
    if (!win || !win.isOpen || win.isMinimized) continue
    if (win.zIndex > topZ) {
      topZ = win.zIndex
      topId = id
    }
  }
  return topId
}

export function windowManagerReducer(
  state: WindowManagerState,
  action: WindowManagerAction,
): WindowManagerState {
  switch (action.type) {
    case 'OPEN': {
      const existing = state.windows[action.id]
      const zIndex = state.nextZIndex
      const nextWindow: WindowState = existing
        ? { ...existing, isOpen: true, isMinimized: false, zIndex }
        : {
            id: action.id,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex,
            position: action.defaultPosition,
            size: action.defaultSize,
            restoreBounds: null,
          }
      return {
        ...state,
        windows: { ...state.windows, [action.id]: nextWindow },
        order: state.order.includes(action.id) ? state.order : [...state.order, action.id],
        focusedId: action.id,
        nextZIndex: state.nextZIndex + 1,
      }
    }

    case 'CLOSE': {
      const existing = state.windows[action.id]
      if (!existing || !existing.isOpen) return state
      const restored = existing.isMaximized && existing.restoreBounds ? existing.restoreBounds : null
      const windows = {
        ...state.windows,
        [action.id]: {
          ...existing,
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
          restoreBounds: null,
          ...(restored ? { position: restored.position, size: restored.size } : {}),
        },
      }
      const focusedId =
        state.focusedId === action.id
          ? topVisibleWindowId(windows, state.order, action.id)
          : state.focusedId
      return { ...state, windows, focusedId }
    }

    case 'MINIMIZE': {
      const existing = state.windows[action.id]
      if (!existing || !existing.isOpen || existing.isMinimized) return state
      const windows = {
        ...state.windows,
        [action.id]: { ...existing, isMinimized: true },
      }
      const focusedId =
        state.focusedId === action.id
          ? topVisibleWindowId(windows, state.order, action.id)
          : state.focusedId
      return { ...state, windows, focusedId }
    }

    case 'TOGGLE_MINIMIZE': {
      const existing = state.windows[action.id]
      if (!existing || !existing.isOpen) return state

      // Minimized -> restore and focus.
      if (existing.isMinimized) {
        const zIndex = state.nextZIndex
        return {
          ...state,
          windows: {
            ...state.windows,
            [action.id]: { ...existing, isMinimized: false, zIndex },
          },
          focusedId: action.id,
          nextZIndex: state.nextZIndex + 1,
        }
      }

      // Focused and visible -> minimize (mirrors clicking the active taskbar button).
      if (state.focusedId === action.id) {
        const windows = {
          ...state.windows,
          [action.id]: { ...existing, isMinimized: true },
        }
        const focusedId = topVisibleWindowId(windows, state.order, action.id)
        return { ...state, windows, focusedId }
      }

      // Open, visible, but not focused -> bring to front.
      const zIndex = state.nextZIndex
      return {
        ...state,
        windows: { ...state.windows, [action.id]: { ...existing, zIndex } },
        focusedId: action.id,
        nextZIndex: state.nextZIndex + 1,
      }
    }

    case 'FOCUS': {
      const existing = state.windows[action.id]
      if (!existing || !existing.isOpen || existing.isMinimized) return state
      if (state.focusedId === action.id) return state
      const zIndex = state.nextZIndex
      return {
        ...state,
        windows: { ...state.windows, [action.id]: { ...existing, zIndex } },
        focusedId: action.id,
        nextZIndex: state.nextZIndex + 1,
      }
    }

    case 'MOVE': {
      const existing = state.windows[action.id]
      if (!existing) return state
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...existing, position: action.position },
        },
      }
    }

    case 'RESIZE': {
      const existing = state.windows[action.id]
      if (!existing) return state
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...existing, position: action.position, size: action.size },
        },
      }
    }

    case 'TOGGLE_MAXIMIZE': {
      const existing = state.windows[action.id]
      if (!existing || !existing.isOpen) return state
      const zIndex = state.nextZIndex

      if (existing.isMaximized) {
        const restored = existing.restoreBounds ?? { position: existing.position, size: existing.size }
        return {
          ...state,
          windows: {
            ...state.windows,
            [action.id]: {
              ...existing,
              isMaximized: false,
              position: restored.position,
              size: restored.size,
              restoreBounds: null,
              zIndex,
            },
          },
          focusedId: action.id,
          nextZIndex: state.nextZIndex + 1,
        }
      }

      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...existing,
            isMaximized: true,
            restoreBounds: { position: existing.position, size: existing.size },
            position: action.maximizedBounds.position,
            size: action.maximizedBounds.size,
            zIndex,
          },
        },
        focusedId: action.id,
        nextZIndex: state.nextZIndex + 1,
      }
    }

    default:
      return state
  }
}
