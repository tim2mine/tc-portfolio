import { useState } from 'react'
import { appRegistry } from '../../apps/registry'
import { useAppActions } from '../../hooks/useAppActions'
import { DesktopIcon } from './DesktopIcon'
import styles from './Desktop.module.css'

export function Desktop() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { openApp } = useAppActions()

  return (
    <div className={styles.desktop} onClick={() => setSelectedId(null)}>
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
    </div>
  )
}
