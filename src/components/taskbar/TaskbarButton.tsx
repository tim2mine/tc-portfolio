import { AppIcon } from '../common/AppIcon'
import styles from './TaskbarButton.module.css'

export interface TaskbarButtonProps {
  icon: string
  title: string
  active: boolean
  onClick: () => void
}

export function TaskbarButton({ icon, title, active, onClick }: TaskbarButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.item} ${active ? styles.active : ''}`}
      onClick={onClick}
    >
      <span>
        <AppIcon icon={icon} size={16} />
      </span>
      <span>{title}</span>
    </button>
  )
}
