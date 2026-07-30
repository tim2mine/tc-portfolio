const BOOT_SESSION_KEY = 'xp-portfolio:booted'

export function hasBootedThisSession(): boolean {
  if (typeof window === 'undefined') return true
  return window.sessionStorage.getItem(BOOT_SESSION_KEY) === 'true'
}

export function markBootedThisSession(): void {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(BOOT_SESSION_KEY, 'true')
}
