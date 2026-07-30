import { createContext, useEffect, useState, type ReactNode } from 'react'

export type Skin = 'blue' | 'silver' | 'olive'

const SKIN_STORAGE_KEY = 'xp-portfolio:skin'
const SKINS: Skin[] = ['blue', 'silver', 'olive']

export interface SkinContextValue {
  skin: Skin
  setSkin: (skin: Skin) => void
}

export const SkinContext = createContext<SkinContextValue | null>(null)

function readStoredSkin(): Skin {
  if (typeof window === 'undefined') return 'blue'
  const stored = window.localStorage.getItem(SKIN_STORAGE_KEY)
  return SKINS.includes(stored as Skin) ? (stored as Skin) : 'blue'
}

export function SkinProvider({ children }: { children: ReactNode }) {
  const [skin, setSkinState] = useState<Skin>(readStoredSkin)

  useEffect(() => {
    document.documentElement.dataset.skin = skin
    window.localStorage.setItem(SKIN_STORAGE_KEY, skin)
  }, [skin])

  return (
    <SkinContext.Provider value={{ skin, setSkin: setSkinState }}>{children}</SkinContext.Provider>
  )
}
