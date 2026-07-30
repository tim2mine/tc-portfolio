import { useEffect, useRef } from 'react'
import { appRegistry } from '../../apps/registry'
import { aboutContent } from '../../content/about'
import { useAppActions } from '../../hooks/useAppActions'
import styles from './StartMenu.module.css'

export interface StartMenuProps {
  onClose: () => void
}

export function StartMenu({ onClose }: StartMenuProps) {
  const { openApp } = useAppActions()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [onClose])

  return (
    <div ref={menuRef} className={styles.menu}>
      <div className={styles.header}>
        <span>🙂</span> {aboutContent.name}
      </div>
      {appRegistry
        .filter((app) => app.showInStartMenu)
        .map((app) => (
          <button
            key={app.id}
            type="button"
            className={styles.item}
            onClick={() => {
              openApp(app)
              onClose()
            }}
          >
            <span>{app.icon}</span> {app.iconLabel}
          </button>
        ))}
    </div>
  )
}
