import { appRegistry } from '../../apps/registry'
import { aboutContent } from '../../content/about'
import { useAppActions } from '../../hooks/useAppActions'
import { useClickOutside } from '../../hooks/useClickOutside'
import { AppIcon } from '../common/AppIcon'
import styles from './StartMenu.module.css'

export interface StartMenuProps {
  onClose: () => void
}

export function StartMenu({ onClose }: StartMenuProps) {
  const { openApp } = useAppActions()
  const menuRef = useClickOutside<HTMLDivElement>(onClose)

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
            <span>
              <AppIcon icon={app.icon} size={16} />
            </span>{' '}
            {app.iconLabel}
          </button>
        ))}
    </div>
  )
}
