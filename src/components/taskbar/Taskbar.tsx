import { appRegistryById } from '../../apps/registry'
import { useWindowManager } from '../../state/windowManager/useWindowManager'
import { useAppActions } from '../../hooks/useAppActions'
import { useSound } from '../../hooks/useSound'
import { TaskbarButton } from './TaskbarButton'
import { SoundToggle } from './SoundToggle'
import { Clock } from './Clock'
import styles from './Taskbar.module.css'

export interface TaskbarProps {
  onToggleStartMenu: () => void
}

export function Taskbar({ onToggleStartMenu }: TaskbarProps) {
  const { state } = useWindowManager()
  const { toggleMinimizeApp } = useAppActions()
  const { playClick } = useSound()

  const openIds = state.order.filter((id) => state.windows[id]?.isOpen)

  return (
    <div className={styles.taskbar}>
      <button
        type="button"
        className={styles.startBtn}
        onClick={(e) => {
          // Stop propagation so StartMenu's document-level "click outside" listener
          // never sees this click — otherwise open+close could race on the same click.
          e.stopPropagation()
          onToggleStartMenu()
          playClick()
        }}
      >
        <span>⊞</span> start
      </button>
      <div className={styles.taskItems}>
        {openIds.map((id) => {
          const app = appRegistryById[id]
          const win = state.windows[id]
          if (!app || !win) return null
          return (
            <TaskbarButton
              key={id}
              icon={app.icon}
              title={app.title}
              active={state.focusedId === id && !win.isMinimized}
              onClick={() => toggleMinimizeApp(id)}
            />
          )
        })}
      </div>
      <div className={styles.tray}>
        <SoundToggle />
        <Clock />
      </div>
    </div>
  )
}
