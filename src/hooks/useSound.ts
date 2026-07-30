import { useContext } from 'react'
import { SoundContext, type SoundContextValue } from '../state/sound/SoundContext'

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    throw new Error('useSound must be used within a SoundProvider')
  }
  return ctx
}
