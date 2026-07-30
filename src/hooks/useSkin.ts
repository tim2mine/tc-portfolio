import { useContext } from 'react'
import { SkinContext, type SkinContextValue } from '../state/skin/SkinContext'

export function useSkin(): SkinContextValue {
  const ctx = useContext(SkinContext)
  if (!ctx) {
    throw new Error('useSkin must be used within a SkinProvider')
  }
  return ctx
}
