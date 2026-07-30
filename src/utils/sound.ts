const MUTE_STORAGE_KEY = 'xp-portfolio:muted'

type ToneOptions = {
  type?: OscillatorType
  gain?: number
}

class SoundEngine {
  private ctx: AudioContext | null = null
  private muted = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.muted = window.localStorage.getItem(MUTE_STORAGE_KEY) === 'true'
    }
  }

  isMuted() {
    return this.muted
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MUTE_STORAGE_KEY, String(muted))
    }
  }

  private getContext(): AudioContext | null {
    if (this.muted) return null
    try {
      this.ctx ??= new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      return this.ctx
    } catch {
      return null
    }
  }

  tone(freq: number, duration: number, opts: ToneOptions = {}) {
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = freq
      osc.type = opts.type ?? 'sine'
      gain.gain.value = opts.gain ?? 0.05
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      osc.stop(ctx.currentTime + duration)
    } catch {
      // Audio can fail silently (autoplay policy, unsupported browser) — never load-bearing.
    }
  }

  playClick() {
    this.tone(600, 0.05)
  }

  playOpen() {
    this.tone(700, 0.06)
  }

  playClose() {
    this.tone(300, 0.06)
  }

  playStartupChime() {
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      setTimeout(() => this.tone(freq, 0.35, { gain: 0.04 }), i * 140)
    })
  }

  playError() {
    this.tone(220, 0.18, { type: 'square', gain: 0.06 })
    setTimeout(() => this.tone(160, 0.25, { type: 'square', gain: 0.06 }), 180)
  }
}

export const soundEngine = new SoundEngine()
