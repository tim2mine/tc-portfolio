import { useClickOutside } from '../../hooks/useClickOutside'
import styles from './ContextMenu.module.css'

export interface ContextMenuProps {
  x: number
  y: number
  onArrangeIcons: () => void
  onRefresh: () => void
  onOpenProperties: () => void
  onClose: () => void
}

export function ContextMenu({
  x,
  y,
  onArrangeIcons,
  onRefresh,
  onOpenProperties,
  onClose,
}: ContextMenuProps) {
  const menuRef = useClickOutside<HTMLDivElement>(onClose)

  function runAndClose(action: () => void) {
    action()
    onClose()
  }

  return (
    <div ref={menuRef} className={styles.menu} style={{ left: x, top: y }}>
      <button type="button" className={styles.item} onClick={() => runAndClose(onArrangeIcons)}>
        Arrange Icons
      </button>
      <button type="button" className={styles.item} onClick={() => runAndClose(onRefresh)}>
        Refresh
      </button>
      <div className={styles.separator} />
      <button type="button" className={styles.item} onClick={() => runAndClose(onOpenProperties)}>
        Properties
      </button>
    </div>
  )
}
