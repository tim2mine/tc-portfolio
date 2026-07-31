import { useRef, type ReactNode } from 'react'
import { useWindowManager } from '../../state/windowManager/useWindowManager'
import { useDraggable, type DragBounds } from '../../hooks/useDraggable'
import { useResizable } from '../../hooks/useResizable'
import { useAppActions } from '../../hooks/useAppActions'
import { useViewportMode } from '../../hooks/useViewportMode'
import { TASKBAR_HEIGHT_PX, MIN_WINDOW_SIZE, MAXIMIZED_TEXT_SCALE } from '../../utils/constants'
import { WindowTitlebar } from './WindowTitlebar'
import { WindowResizeHandles } from './WindowResizeHandles'
import styles from './Window.module.css'

export interface WindowProps {
  id: string
  title: string
  icon: string
  children: ReactNode
}

function computeBounds(size: { width: number; height: number }): DragBounds {
  const margin = 40
  return {
    minX: -(size.width - margin),
    minY: 0,
    maxX: window.innerWidth - margin,
    maxY: window.innerHeight - TASKBAR_HEIGHT_PX - 28,
  }
}

function computeMaximizedBounds() {
  return {
    position: { x: 0, y: 0 },
    size: { width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT_PX },
  }
}

export function Window({ id, title, icon, children }: WindowProps) {
  const { state, focusWindow, moveWindow, resizeWindow } = useWindowManager()
  const { closeApp, toggleMinimizeApp, toggleMaximizeApp } = useAppActions()
  const viewportMode = useViewportMode()
  const win = state.windows[id]
  const windowRef = useRef<HTMLDivElement>(null)
  const titlebarRef = useRef<HTMLDivElement>(null)

  const isMobile = viewportMode === 'mobile'
  const isMaximized = win?.isMaximized ?? false

  useDraggable(titlebarRef, windowRef, {
    position: win?.position ?? { x: 0, y: 0 },
    onDragEnd: (position) => moveWindow(id, position),
    disabled: !win?.isOpen || isMobile || isMaximized,
    bounds: win ? computeBounds(win.size) : undefined,
  })

  useResizable(windowRef, {
    position: win?.position ?? { x: 0, y: 0 },
    size: win?.size ?? MIN_WINDOW_SIZE,
    minSize: MIN_WINDOW_SIZE,
    maxRight: typeof window !== 'undefined' ? window.innerWidth : 0,
    maxBottom: typeof window !== 'undefined' ? window.innerHeight - TASKBAR_HEIGHT_PX : 0,
    onResizeEnd: (position, size) => resizeWindow(id, position, size),
    disabled: !win?.isOpen || isMobile || isMaximized,
  })

  if (!win || !win.isOpen) return null

  const isActive = state.focusedId === id
  const showResizeHandles = !isMobile && !isMaximized

  // Maximized windows render "shrunk" (by 1/scale) and then zoom back up to the real
  // target size, so titlebar/text/icons all enlarge together to suit the fullscreen view.
  // Drag/resize are disabled while maximized, so this never fights the live-drag DOM
  // mutations those hooks make directly on windowRef.
  const scale = isMaximized ? MAXIMIZED_TEXT_SCALE : 1

  return (
    <div
      ref={windowRef}
      className={`${styles.win} ${win.isMinimized ? styles.hidden : ''}`}
      style={{
        left: win.position.x,
        top: win.position.y,
        width: win.size.width / scale,
        height: win.size.height / scale,
        zIndex: win.zIndex,
        zoom: scale,
      }}
      onPointerDown={() => {
        if (!isActive) focusWindow(id)
      }}
    >
      <WindowTitlebar
        ref={titlebarRef}
        icon={icon}
        title={title}
        active={isActive}
        maximized={isMaximized}
        onMinimize={() => toggleMinimizeApp(id)}
        onMaximize={isMobile ? undefined : () => toggleMaximizeApp(id, computeMaximizedBounds())}
        onClose={() => closeApp(id)}
      />
      {children}
      {showResizeHandles && <WindowResizeHandles />}
    </div>
  )
}
