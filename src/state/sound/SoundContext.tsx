import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { soundEngine } from '../../utils/sound'

export interface SoundContextValue {
  muted: boolean
  toggleMuted: () => void
  playClick: () => void
  playOpen: () => void
  playClose: () => void
  playStartupChime: () => void
  playError: () => void
  playPOSTBeep: () => void
}

export const SoundContext = createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(() => soundEngine.isMuted())

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      soundEngine.setMuted(next)
      // Confirmation click only when unmuting — soundEngine is already updated above, so
      // this plays; when muting, soundEngine is already silent, so this is a no-op either way.
      soundEngine.playClick()
      return next
    })
  }, [])

  const value = useMemo<SoundContextValue>(
    () => ({
      muted,
      toggleMuted,
      playClick: () => soundEngine.playClick(),
      playOpen: () => soundEngine.playOpen(),
      playClose: () => soundEngine.playClose(),
      playStartupChime: () => soundEngine.playStartupChime(),
      playError: () => soundEngine.playError(),
      playPOSTBeep: () => soundEngine.playPOSTBeep(),
    }),
    [muted, toggleMuted],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}
