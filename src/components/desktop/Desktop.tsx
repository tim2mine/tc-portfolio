import { useState, type MouseEvent } from 'react'
import { appRegistry, appRegistryById } from '../../apps/registry'
import { useAppActions } from '../../hooks/useAppActions'
import { useSound } from '../../hooks/useSound'
import { DesktopIcon } from './DesktopIcon'
import { ContextMenu } from './ContextMenu'
import styles from './Desktop.module.css'

const CONTEXT_MENU_WIDTH = 180
const CONTEXT_MENU_HEIGHT = 110

export function Desktop() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [flashing, setFlashing] = useState(false)
  const { openApp } = useAppActions()
  const { playClick } = useSound()

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault()
    setSelectedId(null)
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - CONTEXT_MENU_WIDTH),
      y: Math.min(e.clientY, window.innerHeight - CONTEXT_MENU_HEIGHT),
    })
  }

  function handleArrangeIcons() {
    setSelectedId(null)
    playClick()
  }

  function handleRefresh() {
    setFlashing(true)
    playClick()
    setTimeout(() => setFlashing(false), 180)
  }

  function handleOpenProperties() {
    const app = appRegistryById['site-properties']
    if (app) openApp(app)
  }

  return (
    <div
      className={`${styles.desktop} ${flashing ? styles.flashing : ''}`}
      onClick={() => setSelectedId(null)}
      onContextMenu={handleContextMenu}
    >
      {appRegistry
        .filter((app) => app.showOnDesktop)
        .map((app) => (
          <DesktopIcon
            key={app.id}
            icon={app.icon}
            label={app.iconLabel}
            selected={selectedId === app.id}
            onSelect={() => setSelectedId(app.id)}
            onOpen={() => openApp(app)}
          />
        ))}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onArrangeIcons={handleArrangeIcons}
          onRefresh={handleRefresh}
          onOpenProperties={handleOpenProperties}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}
