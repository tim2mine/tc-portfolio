import { useEffect, useState } from 'react'

function formatTime(date: Date) {
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes} ${ampm}`
}

export function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(interval)
  }, [])

  return <span id="clock">{formatTime(now)}</span>
}
