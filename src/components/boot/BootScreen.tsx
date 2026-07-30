import { useEffect } from 'react'
import { useSound } from '../../hooks/useSound'
import styles from './BootScreen.module.css'

const BOOT_DURATION_MS = 2000

export interface BootScreenProps {
  onFinish: () => void
}

export function BootScreen({ onFinish }: BootScreenProps) {
  const { playStartupChime } = useSound()

  useEffect(() => {
    playStartupChime()
    const timer = setTimeout(onFinish, BOOT_DURATION_MS)

    function skip(e: KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') onFinish()
    }
    document.addEventListener('keydown', skip)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', skip)
    }
  }, [onFinish, playStartupChime])

  return (
    <div className={styles.screen} onClick={onFinish}>
      <div className={styles.logo}>portfolio</div>
      <div className={styles.bar}>
        <div className={styles.barFill} />
      </div>
      <div className={styles.subtitle}>Starting up…</div>
      <div className={styles.hint}>click or press any key to skip</div>
    </div>
  )
}
