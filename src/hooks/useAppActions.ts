import { useWindowManager } from '../state/windowManager/useWindowManager'
import { useSound } from './useSound'
import { useHourglassCursor } from './useHourglassCursor'
import type { AppConfig } from '../apps/types'
import type { Bounds } from '../state/windowManager/types'

export function useAppActions() {
  const { openWindow, closeWindow, toggleMinimizeWindow, toggleMaximizeWindow } = useWindowManager()
  const { playOpen, playClose, playClick } = useSound()
  const triggerHourglass = useHourglassCursor()

  return {
    openApp: (app: AppConfig) => {
      openWindow(app.id, app.defaultPosition, app.defaultSize)
      playOpen()
      triggerHourglass()
    },
    closeApp: (id: string) => {
      closeWindow(id)
      playClose()
    },
    toggleMinimizeApp: (id: string) => {
      toggleMinimizeWindow(id)
      playClick()
    },
    toggleMaximizeApp: (id: string, maximizedBounds: Bounds) => {
      toggleMaximizeWindow(id, maximizedBounds)
      playClick()
    },
  }
}
