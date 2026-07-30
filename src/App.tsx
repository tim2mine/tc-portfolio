import { useState } from 'react'
import { WindowManagerProvider } from './state/windowManager/WindowManagerContext'
import { SoundProvider } from './state/sound/SoundContext'
import { SkinProvider } from './state/skin/SkinContext'
import { BSODProvider } from './state/bsod/BSODContext'
import { ViewportModeProvider } from './state/viewport/ViewportModeContext'
import { appRegistry } from './apps/registry'
import { Desktop } from './components/desktop/Desktop'
import { Window } from './components/window/Window'
import { Taskbar } from './components/taskbar/Taskbar'
import { StartMenu } from './components/start-menu/StartMenu'
import { BootScreen } from './components/boot/BootScreen'
import { hasBootedThisSession, markBootedThisSession } from './utils/boot'

function DesktopShell() {
  const [startMenuOpen, setStartMenuOpen] = useState(false)

  return (
    <>
      <h2 className="sr-only">
        A Windows XP style desktop used as a portfolio site, with clickable icons that open
        draggable resume, about, and contact windows.
      </h2>
      <Desktop />
      {appRegistry.map((app) => {
        const Content = app.component
        return (
          <Window key={app.id} id={app.id} title={app.title} icon={app.icon}>
            <Content />
          </Window>
        )
      })}
      <Taskbar onToggleStartMenu={() => setStartMenuOpen((open) => !open)} />
      {startMenuOpen && <StartMenu onClose={() => setStartMenuOpen(false)} />}
    </>
  )
}

function App() {
  const [booted, setBooted] = useState(hasBootedThisSession)

  return (
    <SoundProvider>
      <SkinProvider>
        <ViewportModeProvider>
          <BSODProvider>
            {booted ? (
              <WindowManagerProvider>
                <DesktopShell />
              </WindowManagerProvider>
            ) : (
              <BootScreen
                onFinish={() => {
                  markBootedThisSession()
                  setBooted(true)
                }}
              />
            )}
          </BSODProvider>
        </ViewportModeProvider>
      </SkinProvider>
    </SoundProvider>
  )
}

export default App
