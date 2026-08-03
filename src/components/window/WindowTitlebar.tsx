import { forwardRef, type MouseEvent } from 'react'
import { AppIcon } from '../common/AppIcon'
import { WindowButton } from './WindowButton'
import styles from './WindowTitlebar.module.css'

export interface WindowTitlebarProps {
  icon: string
  title: string
  active: boolean
  maximized: boolean
  onMinimize: () => void
  onMaximize?: () => void
  onClose: () => void
}

export const WindowTitlebar = forwardRef<HTMLDivElement, WindowTitlebarProps>(
  function WindowTitlebar(
    { icon, title, active, maximized, onMinimize, onMaximize, onClose },
    ref,
  ) {
    function handleDoubleClick(e: MouseEvent) {
      // Ignore double-clicks that land on a titlebar button (min/max/close already
      // handle their own single clicks — otherwise this would toggle maximize twice more).
      if ((e.target as HTMLElement).closest('[data-no-drag]')) return
      onMaximize?.()
    }

    return (
      <div
        ref={ref}
        className={`${styles.titlebar} ${active ? '' : styles.inactive} ${maximized ? styles.maximized : ''}`}
        onDoubleClick={handleDoubleClick}
      >
        <span className={styles.icon}>
          <AppIcon icon={icon} size={16} />
        </span>
        <span className={styles.text}>{title}</span>
        <WindowButton variant="min" label="Minimize" symbol="_" onClick={onMinimize} />
        {onMaximize && (
          <WindowButton
            variant="max"
            label={maximized ? 'Restore' : 'Maximize'}
            symbol={maximized ? '❐' : '□'}
            onClick={onMaximize}
          />
        )}
        <WindowButton variant="close" label="Close" symbol="✕" onClick={onClose} />
      </div>
    )
  },
)
