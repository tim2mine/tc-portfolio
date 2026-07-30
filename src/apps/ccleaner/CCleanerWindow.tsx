import { testimonialsContent } from '../../content/testimonials'
import styles from './CCleanerWindow.module.css'

export function CCleanerWindow() {
  return (
    <div className={styles.body}>
      <div className={styles.scanBar}>{testimonialsContent.scanSummary}</div>
      <div className={styles.list}>
        {testimonialsContent.testimonials.map((t, i) => (
          <div key={t.author + i} className={styles.file}>
            <div className={styles.fileName}>
              testimonial_{String(i + 1).padStart(2, '0')}.dat — RECOVERED
            </div>
            <p className={styles.quote}>“{t.quote}”</p>
            <div className={styles.author}>
              {t.author} — {t.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
