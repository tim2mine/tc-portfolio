import styles from './PaintWindow.module.css'

export function PaintWindow() {
  return (
    <div className={styles.body}>
      <div className={styles.canvas}>
        <img
          className={styles.artwork}
          src="/images/deadpool-pixel-art.png"
          alt="Pixel art sprite"
        />
      </div>
      <p className={styles.caption}>Pixel Art Portfolio Coming Soon</p>
    </div>
  )
}
