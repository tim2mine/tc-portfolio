import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { appRegistry, appRegistryById } from '../registry'
import { useAppActions } from '../../hooks/useAppActions'
import { useSound } from '../../hooks/useSound'
import { buildCommandRegistry, parseInput, UNKNOWN_COMMAND, type TerminalContext } from './commands'
import styles from './TerminalWindow.module.css'

interface HistoryEntry {
  input: string
  output: string | null
}

export function TerminalWindow() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [inputValue, setInputValue] = useState('')
  const unlockedRef = useRef<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const { openApp, closeApp } = useAppActions()
  const { playClick, playError } = useSound()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [history])

  function buildCtx(): TerminalContext {
    return {
      appRegistry,
      appRegistryById,
      openApp,
      closeApp,
      unlocked: unlockedRef.current,
      history,
    }
  }

  function runCommand(raw: string): { cmd: string; output: string | null } {
    const { cmd, args } = parseInput(raw)
    const registry = buildCommandRegistry(buildCtx())
    const handler = registry[cmd]
    if (!handler) {
      playError()
      return { cmd, output: UNKNOWN_COMMAND(cmd) }
    }
    playClick()
    return { cmd, output: handler(args) }
  }

  function handleSubmit() {
    const raw = inputValue
    if (!raw.trim()) {
      setInputValue('')
      return
    }
    const { cmd, output } = runCommand(raw)
    setInputValue('')
    setHistoryIndex(-1)
    if (cmd === 'clear') {
      setHistory([])
      return
    }
    setHistory((prev) => [...prev, { input: raw, output }])
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit()
      return
    }
    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault()
      setHistory((prev) => [...prev, { input: inputValue, output: '^C' }])
      setInputValue('')
      setHistoryIndex(-1)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInputValue(history[nextIndex].input)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const nextIndex = historyIndex + 1
      if (nextIndex >= history.length) {
        setHistoryIndex(-1)
        setInputValue('')
      } else {
        setHistoryIndex(nextIndex)
        setInputValue(history[nextIndex].input)
      }
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const prefix = inputValue.trim().toLowerCase()
      if (!prefix) return
      const commandNames = Object.keys(buildCommandRegistry(buildCtx()))
      const match = commandNames.find((name) => name.startsWith(prefix))
      if (match) setInputValue(match)
    }
  }

  return (
    <div className={styles.termRoot} onClick={() => inputRef.current?.focus()}>
      <div className={styles.termOutput} ref={outputRef} aria-live="polite">
        <div className={styles.termLine}>
          Microsoft Windows XP [Version 5.1.2600]
        </div>
        <div className={styles.termLine}>Type &apos;help&apos; to see a list of commands.</div>
        {history.map((entry, i) => (
          <div key={i}>
            <div className={styles.termLine}>
              <span className={styles.termPrompt}>C:\Users\Guest&gt;</span> {entry.input}
            </div>
            {entry.output && (
              <div className={styles.termLine}>
                {entry.output.split('\n').map((line, j) => (
                  <div key={j}>{line || '\u00A0'}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.termInputLine}>
        <span className={styles.termPrompt}>C:\Users\Guest&gt;</span>
        <input
          ref={inputRef}
          className={styles.termInput}
          style={{ width: `${Math.max(inputValue.length, 1)}ch` }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal command input"
        />
        <span className={styles.cursor} />
      </div>
    </div>
  )
}
