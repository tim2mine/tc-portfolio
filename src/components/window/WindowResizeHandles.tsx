import type { ResizeDirection } from '../../hooks/useResizable'
import styles from './WindowResizeHandles.module.css'

const DIRECTIONS: ResizeDirection[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

export function WindowResizeHandles() {
  return (
    <>
      {DIRECTIONS.map((dir) => (
        <div key={dir} className={`${styles.handle} ${styles[dir]}`} data-resize-dir={dir} />
      ))}
    </>
  )
}
