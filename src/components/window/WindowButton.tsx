import styles from './WindowButton.module.css'

export interface WindowButtonProps {
  variant: 'min' | 'max' | 'close'
  label: string
  symbol: string
  onClick: () => void
}

export function WindowButton({ variant, label, symbol, onClick }: WindowButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${variant !== 'close' ? styles.blue : ''}`}
      data-no-drag
      aria-label={label}
      onClick={onClick}
    >
      {symbol}
    </button>
  )
}
