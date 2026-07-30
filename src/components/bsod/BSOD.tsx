import { useEffect } from 'react'
import styles from './BSOD.module.css'

export interface BSODProps {
  onDismiss: () => void
}

export function BSOD({ onDismiss }: BSODProps) {
  useEffect(() => {
    function dismiss() {
      onDismiss()
    }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [onDismiss])

  return (
    <div className={styles.screen} onClick={onDismiss}>
      <div className={styles.header}>Portfolio_OS</div>
      <p>A fatal exception 0x00000E has occurred at RECYCLE_BIN.EMPTY.</p>
      <p>*** STOP: 0xC000021A — nothing was actually deleted. This is a portfolio site. ***</p>
      <p>Your old side projects are safe. This crash was staged for comedic effect.</p>
      <p className={styles.hint}>Press any key or click to continue…</p>
    </div>
  )
}
