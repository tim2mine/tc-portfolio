import { useContext } from 'react'
import { BSODContext, type BSODContextValue } from '../state/bsod/BSODContext'

export function useBSOD(): BSODContextValue {
  const ctx = useContext(BSODContext)
  if (!ctx) {
    throw new Error('useBSOD must be used within a BSODProvider')
  }
  return ctx
}
