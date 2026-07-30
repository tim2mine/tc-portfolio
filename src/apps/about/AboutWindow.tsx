import { aboutContent } from '../../content/about'
import styles from './AboutWindow.module.css'

export function AboutWindow() {
  return (
    <>
      <div className={styles.menubar}>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Help</span>
      </div>
      <div className={styles.body}>
        <p className={styles.intro}>
          <strong>{aboutContent.name}</strong> — {aboutContent.title}
        </p>
        <div className={styles.row}>
          <div className={styles.label}>Registered to:</div>
          <div>{aboutContent.name}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Location:</div>
          <div>{aboutContent.location}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>System:</div>
          <div>{aboutContent.summary}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Processor:</div>
          <div>{aboutContent.skills}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Installed drivers:</div>
          <div>{aboutContent.installedDrivers}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Status:</div>
          <div>{aboutContent.status}</div>
        </div>
      </div>
    </>
  )
}
