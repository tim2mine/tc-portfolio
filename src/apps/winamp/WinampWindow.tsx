import { useState } from 'react'
import { achievementsContent } from '../../content/achievements'
import { useSound } from '../../hooks/useSound'
import styles from './WinampWindow.module.css'

export function WinampWindow() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { playClick } = useSound()

  const nowPlaying =
    activeIndex !== null
      ? `${achievementsContent.tracks[activeIndex].title} — ${achievementsContent.tracks[activeIndex].subtitle}`
      : achievementsContent.nowPlaying

  return (
    <div className={styles.player}>
      <div className={styles.lcd}>{nowPlaying}</div>
      <div className={styles.controls}>
        <span className={styles.controlBtn}>◀◀</span>
        <span className={styles.controlBtn}>▶</span>
        <span className={styles.controlBtn}>■</span>
        <span className={styles.controlBtn}>▶▶</span>
      </div>
      <div className={styles.playlist}>
        {achievementsContent.tracks.map((track, i) => (
          <div
            key={track.title + i}
            className={`${styles.track} ${i === activeIndex ? styles.active : ''}`}
            onClick={() => {
              setActiveIndex(i)
              playClick()
            }}
          >
            <div className={styles.trackInfo}>
              <div>
                {i + 1}. {track.title}
              </div>
              <div className={styles.trackSubtitle}>{track.subtitle}</div>
            </div>
            <div className={styles.trackDuration}>{track.duration}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
