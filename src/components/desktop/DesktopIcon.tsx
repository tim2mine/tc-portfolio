import { AppIcon } from '../common/AppIcon'
import styles from './DesktopIcon.module.css'

export interface DesktopIconProps {
  icon: string
  label: string
  selected: boolean
  onSelect: () => void
  onOpen: () => void
}

export function DesktopIcon({ icon, label, selected, onSelect, onOpen }: DesktopIconProps) {
  return (
    <button
      type="button"
      className={`${styles.icon} ${selected ? styles.selected : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onOpen()
      }}
    >
      <div className={styles.glyph}>
        <AppIcon icon={icon} size={44} />
      </div>
      <div className={styles.label}>{label}</div>
    </button>
  )
}
