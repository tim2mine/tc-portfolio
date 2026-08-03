import { useRef, type ReactNode } from 'react'
import { useWindowManager } from '../../state/windowManager/useWindowManager'
import { useDraggable, type DragBounds } from '../../hooks/useDraggable'
import { useResizable } from '../../hooks/useResizable'
import { useAppActions } from '../../hooks/useAppActions'
import { useViewportMode } from '../../hooks/useViewportMode'
import { TASKBAR_HEIGHT_PX, MIN_WINDOW_SIZE, MAXIMIZED_TEXT_SCALE } from '../../utils/constants'
import { computeResizeScale } from '../../utils/windowScale'
import type { Size } from '../../state/windowManager/types'
import { WindowTitlebar } from './WindowTitlebar'
import { WindowResizeHandles } from './WindowResizeHandles'
import styles from './Window.module.css'

export interface WindowProps {
  id: string
  title: string
  icon: string
  defaultSize: Size
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

export function Window({ id, title, icon, defaultSize, children }: WindowProps) {
  const { state, focusWindow, moveWindow, resizeWindow } = useWindowManager()
  const { closeApp, toggleMinimizeApp, toggleMaximizeApp } = useAppActions()
  const viewportMode = useViewportMode()
  const win = state.windows[id]
  const windowRef = useRef<HTMLDivElement>(null)
  const titlebarRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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
    contentRef,
    defaultSize,
  })

  if (!win || !win.isOpen) return null

  const isActive = state.focusedId === id
  const showResizeHandles = !isMobile && !isMaximized

  // The outer .win div (windowRef) is always the window's true, unscaled position/size --
  // useDraggable/useResizable mutate it directly during a live gesture with plain pixel
  // math, no scale-awareness needed there at all. The scale-up effect lives entirely on an
  // inner wrapper (contentRef): rendered "shrunk" (by 1/scale) and transform-scaled back up
  // to the true size, so titlebar/text/icons all enlarge together -- for the fixed 1.3x
  // maximize bump, and now continuously while manually resizing past the window's own
  // default size. useResizable also mutates contentRef's size/transform directly, in the
  // same synchronous pointermove tick it resizes windowRef in, so the two never drift out
  // of sync for even a frame during a live drag.
  const scale = isMaximized ? MAXIMIZED_TEXT_SCALE : computeResizeScale(win.size, defaultSize)

  return (
    <div
      ref={windowRef}
      className={`${styles.win} ${win.isMinimized ? styles.hidden : ''}`}
      style={{
        left: win.position.x,
        top: win.position.y,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
      }}
      onPointerDown={() => {
        if (!isActive) focusWindow(id)
      }}
    >
      <div
        ref={contentRef}
        className={styles.zoomWrap}
        style={
          isMobile
            ? { width: '100%', height: '100%' }
            : {
                width: win.size.width / scale,
                height: win.size.height / scale,
                transform: `scale(${scale})`,
              }
        }
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
      </div>
      {showResizeHandles && <WindowResizeHandles />}
    </div>
  )
}
