import { recycleBinContent } from '../../content/recyclebin'
import { useBSOD } from '../../hooks/useBSOD'
import styles from './RecycleBinWindow.module.css'

export function RecycleBinWindow() {
  const { trigger } = useBSOD()

  return (
    <div className={styles.body}>
      <p className={styles.intro}>{recycleBinContent.intro}</p>
      <button type="button" className={styles.emptyBtn} onClick={trigger}>
        Empty Recycle Bin
      </button>
    </div>
  )
}
