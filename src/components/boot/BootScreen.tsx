import { useEffect, useRef, useState } from 'react'
import { useSound } from '../../hooks/useSound'
import styles from './BootScreen.module.css'

const OS_PHASE_DURATION_MS = 1300

const BIOS_LINES = [
  'Portfolio-OS BIOS v2.6.26, An Energy Star Ally',
  'Copyright (C) 2001-2026 Timothy Catalano',
  '',
  'Main Processor .......... Full-Stack Developer Unit   OK',
  'Memory Test .............. 65536K OK',
  '',
  'Detecting IDE drives...',
  'Primary Master   ... TC-PORTFOLIO SSD',
  'Primary Slave    ... None',
  'Secondary Master ... REACT-RUNTIME CD-ROM',
  'Secondary Slave  ... None',
  '',
  'Press DEL to enter SETUP, ESC to skip',
]

const LINE_DELAY_MS = 260
const BLANK_LINE_DELAY_MS = 130
const POST_PAUSE_MS = 700

export interface BootScreenProps {
  onFinish: () => void
}

export function BootScreen({ onFinish }: BootScreenProps) {
  const { playStartupChime, playPOSTBeep } = useSound()
  const [phase, setPhase] = useState<'bios' | 'os'>('bios')
  const [visibleCount, setVisibleCount] = useState(0)
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current

  useEffect(() => {
    function skip(e: KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') onFinish()
    }
    document.addEventListener('keydown', skip)
    return () => document.removeEventListener('keydown', skip)
  }, [onFinish])

  useEffect(() => {
    if (phase !== 'bios') return

    if (reducedMotion) {
      setVisibleCount(BIOS_LINES.length)
      playPOSTBeep()
      setPhase('os')
      return
    }

    if (visibleCount >= BIOS_LINES.length) {
      const timer = setTimeout(() => {
        playPOSTBeep()
        setPhase('os')
      }, POST_PAUSE_MS)
      return () => clearTimeout(timer)
    }

    const delay = BIOS_LINES[visibleCount] === '' ? BLANK_LINE_DELAY_MS : LINE_DELAY_MS
    const timer = setTimeout(() => setVisibleCount((count) => count + 1), delay)
    return () => clearTimeout(timer)
  }, [phase, visibleCount, reducedMotion, playPOSTBeep])

  useEffect(() => {
    if (phase !== 'os') return
    playStartupChime()
    const timer = setTimeout(onFinish, OS_PHASE_DURATION_MS)
    return () => clearTimeout(timer)
  }, [phase, onFinish, playStartupChime])

  if (phase === 'bios') {
    return (
      <div className={styles.biosScreen} onClick={onFinish}>
        {BIOS_LINES.slice(0, visibleCount).map((line, i) => (
          <div key={i} className={styles.biosLine}>
            {line || ' '}
          </div>
        ))}
        {visibleCount >= BIOS_LINES.length && <span className={styles.cursor} />}
      </div>
    )
  }

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
