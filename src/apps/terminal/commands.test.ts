import { describe, expect, it, vi } from 'vitest'
import { appRegistry, appRegistryById } from '../registry'
import {
  buildCommandRegistry,
  formatAbout,
  formatContact,
  formatResume,
  NAV_ALIASES,
  parseInput,
  type TerminalContext,
} from './commands'

function makeContext(overrides: Partial<TerminalContext> = {}): TerminalContext {
  return {
    appRegistry,
    appRegistryById,
    openApp: vi.fn(),
    closeApp: vi.fn(),
    unlocked: new Set(),
    history: [],
    ...overrides,
  }
}

describe('parseInput', () => {
  it('splits command and args', () => {
    expect(parseInput('cd resume')).toEqual({ cmd: 'cd', args: ['resume'] })
  })

  it('lowercases the command but not args', () => {
    expect(parseInput('CD Resume')).toEqual({ cmd: 'cd', args: ['Resume'] })
  })

  it('collapses extra whitespace', () => {
    expect(parseInput('   cd    resume   ')).toEqual({ cmd: 'cd', args: ['resume'] })
  })

  it('handles an empty string', () => {
    expect(parseInput('')).toEqual({ cmd: '', args: [] })
  })
})

describe('NAV_ALIASES', () => {
  it('every alias resolves to a real appRegistry id', () => {
    for (const id of Object.values(NAV_ALIASES)) {
      expect(appRegistryById[id]).toBeDefined()
    }
  })
})

describe('cd/open', () => {
  it('opens an app for a known alias', () => {
    const ctx = makeContext()
    const registry = buildCommandRegistry(ctx)
    const result = registry.cd(['resume'])
    expect(ctx.openApp).toHaveBeenCalledWith(appRegistryById['resume'])
    expect(result).toContain('Opening')
  })

  it('open is an alias for cd', () => {
    const ctx = makeContext()
    const registry = buildCommandRegistry(ctx)
    registry.open(['about'])
    expect(ctx.openApp).toHaveBeenCalledWith(appRegistryById['about'])
  })

  it('lists live project entries for cd projects', () => {
    const ctx = makeContext()
    const registry = buildCommandRegistry(ctx)
    const projectApps = appRegistry.filter((app) => app.id.startsWith('project-'))
    const result = registry.cd(['projects'])
    for (const app of projectApps) {
      expect(result).toContain(app.iconLabel)
    }
  })

  it('returns an error for an unknown path', () => {
    const ctx = makeContext()
    const registry = buildCommandRegistry(ctx)
    const result = registry.cd(['nowhere'])
    expect(ctx.openApp).not.toHaveBeenCalled()
    expect(result).toContain('cannot find the path')
  })
})

describe('sudo hire-me', () => {
  it('denies permission on the first call', () => {
    const ctx = makeContext()
    const registry = buildCommandRegistry(ctx)
    const result = registry.sudo(['hire-me'])
    expect(result).toContain('sudoers')
    expect(ctx.openApp).not.toHaveBeenCalled()
    expect(ctx.unlocked.has('sudo-hire-me')).toBe(true)
  })

  it('grants permission and opens contact on the second call', () => {
    const ctx = makeContext({ unlocked: new Set(['sudo-hire-me']) })
    const registry = buildCommandRegistry(ctx)
    const result = registry.sudo(['hire-me'])
    expect(result).toContain('Permission granted')
    expect(ctx.openApp).toHaveBeenCalledWith(appRegistryById['contact'])
  })
})

describe('exit', () => {
  it('closes the terminal window', () => {
    const ctx = makeContext()
    const registry = buildCommandRegistry(ctx)
    registry.exit([])
    expect(ctx.closeApp).toHaveBeenCalledWith('terminal')
  })
})

describe('clear', () => {
  it('returns null so the component wipes the screen itself', () => {
    const ctx = makeContext()
    const registry = buildCommandRegistry(ctx)
    expect(registry.clear([])).toBeNull()
  })
})

describe('history', () => {
  it('prints prior inputs', () => {
    const ctx = makeContext({ history: [{ input: 'help', output: 'x' }, { input: 'ls', output: 'y' }] })
    const registry = buildCommandRegistry(ctx)
    expect(registry.history([])).toBe('help\nls')
  })
})

describe('formatters', () => {
  it('formatResume includes name and skills', () => {
    const text = formatResume({
      name: 'Ada',
      title: 'Engineer',
      experience: [{ years: '2020', role: 'Dev', organization: 'Acme' }],
      skills: ['TS', 'React'],
      education: 'MIT',
      resumePdfUrl: null,
    })
    expect(text).toContain('Ada')
    expect(text).toContain('TS, React')
  })

  it('formatAbout includes location', () => {
    const text = formatAbout({
      name: 'Ada',
      title: 'Engineer',
      location: 'Remote',
      summary: 'Builds things',
      skills: 'TS',
      installedDrivers: 'n/a',
      status: 'Open',
    })
    expect(text).toContain('Remote')
  })

  it('formatContact includes links', () => {
    const text = formatContact({
      addressBarUrl: 'http://x',
      links: [{ label: 'Email', value: 'a@b.com', href: 'mailto:a@b.com' }],
    })
    expect(text).toBe('Email: a@b.com')
  })
})
