import { contactContent } from '../../content/contact'
import styles from './ContactWindow.module.css'

export function ContactWindow() {
  return (
    <>
      <div className={styles.toolbar}>
        <span>◀</span>
        <span>▶</span>
        <span>⟳</span>
        <div className={styles.addressBar}>{contactContent.addressBarUrl}</div>
      </div>
      <div className={styles.body}>
        <div className={styles.favoritesLabel}>Favorites</div>
        {contactContent.links.map((link) => (
          <a key={link.label} className={styles.bookmark} href={link.href}>
            <span className={styles.dot}>●</span> {link.label} — {link.value}
          </a>
        ))}
      </div>
    </>
  )
}
