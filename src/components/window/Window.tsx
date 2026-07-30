import { useRef, type ReactNode } from 'react'
import { useWindowManager } from '../../state/windowManager/useWindowManager'
import { useDraggable, type DragBounds } from '../../hooks/useDraggable'
import { useAppActions } from '../../hooks/useAppActions'
import { TASKBAR_HEIGHT_PX } from '../../utils/constants'
import { WindowTitlebar } from './WindowTitlebar'
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

export function Window({ id, title, icon, children }: WindowProps) {
  const { state, focusWindow, moveWindow } = useWindowManager()
  const { closeApp, toggleMinimizeApp } = useAppActions()
  const win = state.windows[id]
  const windowRef = useRef<HTMLDivElement>(null)
  const titlebarRef = useRef<HTMLDivElement>(null)

  useDraggable(titlebarRef, windowRef, {
    position: win?.position ?? { x: 0, y: 0 },
    onDragEnd: (position) => moveWindow(id, position),
    disabled: !win?.isOpen,
    bounds: win ? computeBounds(win.size) : undefined,
  })

  if (!win || !win.isOpen) return null

  const isActive = state.focusedId === id

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
      <WindowTitlebar
        ref={titlebarRef}
        icon={icon}
        title={title}
        active={isActive}
        onMinimize={() => toggleMinimizeApp(id)}
        onClose={() => closeApp(id)}
      />
      {children}
    </div>
  )
}
