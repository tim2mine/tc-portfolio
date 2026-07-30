import { useSkin } from '../../hooks/useSkin'
import type { Skin } from '../../state/skin/SkinContext'
import styles from './SitePropertiesWindow.module.css'

const SKIN_LABELS: Record<Skin, string> = {
  blue: 'Blue (Luna)',
  silver: 'Silver',
  olive: 'Olive',
}

export function SitePropertiesWindow() {
  const { skin, setSkin } = useSkin()

  return (
    <div className={styles.body}>
      <p className={styles.intro}>
        This site is a Windows XP homage built as a portfolio — every icon opens a window
        instead of a page. No actual system files were harmed.
      </p>
      <div className={styles.sectionLabel}>Appearance</div>
      <div className={styles.skinRow}>
        {(Object.keys(SKIN_LABELS) as Skin[]).map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.skinBtn} ${option === skin ? styles.active : ''}`}
            onClick={() => setSkin(option)}
          >
            {SKIN_LABELS[option]}
          </button>
        ))}
      </div>
    </div>
  )
}
