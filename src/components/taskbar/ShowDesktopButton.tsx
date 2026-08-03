import { useState } from 'react'
import { useWindowManager } from '../../state/windowManager/useWindowManager'
import { useSound } from '../../hooks/useSound'
import styles from './ShowDesktopButton.module.css'

export function ShowDesktopButton() {
  const { state, minimizeWindow, toggleMinimizeWindow } = useWindowManager()
  const { playClick } = useSound()
  const [hiddenIds, setHiddenIds] = useState<string[] | null>(null)

  function handleClick() {
    playClick()
    if (hiddenIds) {
      hiddenIds.forEach((id) => toggleMinimizeWindow(id))
      setHiddenIds(null)
      return
    }
    const visibleIds = state.order.filter(
      (id) => state.windows[id]?.isOpen && !state.windows[id]?.isMinimized,
    )
    if (visibleIds.length === 0) return
    visibleIds.forEach((id) => minimizeWindow(id))
    setHiddenIds(visibleIds)
  }

  return (
    <button
      type="button"
      className={styles.showDesktop}
      title="Show Desktop"
      onClick={handleClick}
    >
      🖥️
    </button>
  )
}
