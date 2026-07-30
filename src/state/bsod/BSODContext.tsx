import { createContext, useCallback, useState, type ReactNode } from 'react'
import { useSound } from '../../hooks/useSound'
import { BSOD } from '../../components/bsod/BSOD'

export interface BSODContextValue {
  trigger: () => void
}

export const BSODContext = createContext<BSODContextValue | null>(null)

export function BSODProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false)
  const { playError } = useSound()

  const trigger = useCallback(() => {
    setActive(true)
    playError()
  }, [playError])

  return (
    <BSODContext.Provider value={{ trigger }}>
      {children}
      {active && <BSOD onDismiss={() => setActive(false)} />}
    </BSODContext.Provider>
  )
}
