import { recycleBinContent } from '../../content/recyclebin'
import styles from './RecycleBinWindow.module.css'

export function RecycleBinWindow() {
  return <div className={styles.body}>{recycleBinContent.intro}</div>
}
