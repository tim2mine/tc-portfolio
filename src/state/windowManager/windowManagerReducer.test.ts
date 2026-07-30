import { describe, expect, it } from 'vitest'
import { initialWindowManagerState, windowManagerReducer } from './windowManagerReducer'
import type { WindowManagerState } from './types'

const pos = { x: 10, y: 10 }
const size = { width: 200, height: 200 }

function open(state: WindowManagerState, id: string) {
  return windowManagerReducer(state, { type: 'OPEN', id, defaultPosition: pos, defaultSize: size })
}

describe('windowManagerReducer', () => {
  it('opens a window that did not exist yet, seeding defaults and focusing it', () => {
    const state = open(initialWindowManagerState, 'about')
    expect(state.windows.about).toMatchObject({
      id: 'about',
      isOpen: true,
      isMinimized: false,
      position: pos,
      size,
    })
    expect(state.order).toEqual(['about'])
    expect(state.focusedId).toBe('about')
  })

  it('does not duplicate an id in order when reopening', () => {
    let state = open(initialWindowManagerState, 'about')
    state = windowManagerReducer(state, { type: 'CLOSE', id: 'about' })
    state = open(state, 'about')
    expect(state.order).toEqual(['about'])
  })

  it('opening a second window focuses it and raises its z-index above the first', () => {
    let state = open(initialWindowManagerState, 'about')
    state = open(state, 'resume')
    expect(state.focusedId).toBe('resume')
    expect(state.windows.resume.zIndex).toBeGreaterThan(state.windows.about.zIndex)
  })

  it('closing the focused window transfers focus to the next-highest z-index open window', () => {
    let state = open(initialWindowManagerState, 'about')
    state = open(state, 'resume')
    state = open(state, 'contact') // contact is now focused/top
    state = windowManagerReducer(state, { type: 'CLOSE', id: 'contact' })
    expect(state.focusedId).toBe('resume')
    expect(state.windows.contact.isOpen).toBe(false)
  })

  it('closing a non-focused window does not change focus', () => {
    let state = open(initialWindowManagerState, 'about')
    state = open(state, 'resume')
    state = windowManagerReducer(state, { type: 'CLOSE', id: 'about' })
    expect(state.focusedId).toBe('resume')
  })

  it('closing the only open window clears focus', () => {
    let state = open(initialWindowManagerState, 'about')
    state = windowManagerReducer(state, { type: 'CLOSE', id: 'about' })
    expect(state.focusedId).toBeNull()
  })

  it('minimizing the focused window clears its minimized-false flag and transfers focus', () => {
    let state = open(initialWindowManagerState, 'about')
    state = open(state, 'resume') // resume focused/top
    state = windowManagerReducer(state, { type: 'MINIMIZE', id: 'resume' })
    expect(state.windows.resume.isMinimized).toBe(true)
    expect(state.focusedId).toBe('about')
  })

  it('minimizing the last open window clears focusedId', () => {
    let state = open(initialWindowManagerState, 'about')
    state = windowManagerReducer(state, { type: 'MINIMIZE', id: 'about' })
    expect(state.focusedId).toBeNull()
  })

  it('FOCUS brings a background window to front and updates focusedId', () => {
    let state = open(initialWindowManagerState, 'about')
    state = open(state, 'resume') // resume on top
    state = windowManagerReducer(state, { type: 'FOCUS', id: 'about' })
    expect(state.focusedId).toBe('about')
    expect(state.windows.about.zIndex).toBeGreaterThan(state.windows.resume.zIndex)
  })

  it('FOCUS is a no-op on a minimized window', () => {
    let state = open(initialWindowManagerState, 'about')
    state = windowManagerReducer(state, { type: 'MINIMIZE', id: 'about' })
    const before = state
    state = windowManagerReducer(state, { type: 'FOCUS', id: 'about' })
    expect(state).toBe(before)
  })

  describe('TOGGLE_MINIMIZE (taskbar-button click semantics)', () => {
    it('restores and focuses a minimized window', () => {
      let state = open(initialWindowManagerState, 'about')
      state = windowManagerReducer(state, { type: 'MINIMIZE', id: 'about' })
      state = windowManagerReducer(state, { type: 'TOGGLE_MINIMIZE', id: 'about' })
      expect(state.windows.about.isMinimized).toBe(false)
      expect(state.focusedId).toBe('about')
    })

    it('minimizes the currently focused window', () => {
      let state = open(initialWindowManagerState, 'about')
      state = windowManagerReducer(state, { type: 'TOGGLE_MINIMIZE', id: 'about' })
      expect(state.windows.about.isMinimized).toBe(true)
      expect(state.focusedId).toBeNull()
    })

    it('brings a background (open, unfocused) window to front instead of minimizing it', () => {
      let state = open(initialWindowManagerState, 'about')
      state = open(state, 'resume') // resume focused/top, about is background
      state = windowManagerReducer(state, { type: 'TOGGLE_MINIMIZE', id: 'about' })
      expect(state.windows.about.isMinimized).toBe(false)
      expect(state.focusedId).toBe('about')
    })
  })

  it('MOVE updates only the position of the target window', () => {
    let state = open(initialWindowManagerState, 'about')
    const newPos = { x: 42, y: 99 }
    state = windowManagerReducer(state, { type: 'MOVE', id: 'about', position: newPos })
    expect(state.windows.about.position).toEqual(newPos)
    expect(state.windows.about.size).toEqual(size)
  })

  it('MOVE on an unknown id is a no-op', () => {
    const state = windowManagerReducer(initialWindowManagerState, {
      type: 'MOVE',
      id: 'ghost',
      position: { x: 1, y: 1 },
    })
    expect(state).toBe(initialWindowManagerState)
  })
})
