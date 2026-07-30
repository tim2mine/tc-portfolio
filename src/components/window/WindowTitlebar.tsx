import { forwardRef } from 'react'
import { WindowButton } from './WindowButton'
import styles from './WindowTitlebar.module.css'

export interface WindowTitlebarProps {
  icon: string
  title: string
  active: boolean
  onMinimize: () => void
  onClose: () => void
}

export const WindowTitlebar = forwardRef<HTMLDivElement, WindowTitlebarProps>(
  function WindowTitlebar({ icon, title, active, onMinimize, onClose }, ref) {
    return (
      <div ref={ref} className={`${styles.titlebar} ${active ? '' : styles.inactive}`}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.text}>{title}</span>
        <WindowButton variant="min" label="Minimize" symbol="_" onClick={onMinimize} />
        <WindowButton variant="close" label="Close" symbol="✕" onClick={onClose} />
      </div>
    )
  },
)
