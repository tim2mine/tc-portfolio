import styles from './Calendar.module.css'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export interface CalendarProps {
  date: Date
}

export function Calendar({ date }: CalendarProps) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const today = date.getDate()

  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        {MONTH_NAMES[month]} {year}
      </div>
      <div className={styles.grid}>
        {DAY_LABELS.map((label) => (
          <div key={label} className={styles.dayLabel}>
            {label}
          </div>
        ))}
        {cells.map((day, i) => (
          <div key={i} className={`${styles.day} ${day === today ? styles.today : ''}`}>
            {day ?? ''}
          </div>
        ))}
      </div>
    </div>
  )
}
