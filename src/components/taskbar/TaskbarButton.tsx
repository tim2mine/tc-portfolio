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
      <span>{icon}</span>
      <span>{title}</span>
    </button>
  )
}
