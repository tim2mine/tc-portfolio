import { useWindowManager } from '../state/windowManager/useWindowManager'
import { useSound } from './useSound'
import type { AppConfig } from '../apps/types'

export function useAppActions() {
  const { openWindow, closeWindow, toggleMinimizeWindow } = useWindowManager()
  const { playOpen, playClose, playClick } = useSound()

  return {
    openApp: (app: AppConfig) => {
      openWindow(app.id, app.defaultPosition, app.defaultSize)
      playOpen()
    },
    closeApp: (id: string) => {
      closeWindow(id)
      playClose()
    },
    toggleMinimizeApp: (id: string) => {
      toggleMinimizeWindow(id)
      playClick()
    },
  }
}
