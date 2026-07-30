import { useSound } from '../../hooks/useSound'

export function SoundToggle() {
  const { muted, toggleMuted } = useSound()

  return (
    <span
      role="button"
      tabIndex={0}
      title="Toggle sound"
      style={{ cursor: 'pointer', fontSize: 13 }}
      onClick={toggleMuted}
    >
      {muted ? '🔇' : '🔊'}
    </span>
  )
}
