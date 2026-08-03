import { useEffect, useState } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'
import { Calendar } from './Calendar'
import styles from './Clock.module.css'

function formatTime(date: Date) {
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes} ${ampm}`
}

export function Clock() {
  const [now, setNow] = useState(() => new Date())
  const [open, setOpen] = useState(false)
  const containerRef = useClickOutside<HTMLDivElement>(() => setOpen(false))

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={containerRef} className={styles.wrap}>
      <span id="clock" className={styles.time} onClick={() => setOpen((o) => !o)}>
        {formatTime(now)}
      </span>
      {open && <Calendar date={now} />}
    </div>
  )
}
