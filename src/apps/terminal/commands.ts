import type { AppConfig } from '../types'
import type { AboutContent, ResumeContent, ContactContent } from '../../content/types'
import { aboutContent } from '../../content/about'
import { resumeContent } from '../../content/resume'
import { contactContent } from '../../content/contact'

export function parseInput(raw: string): { cmd: string; args: string[] } {
  const [cmd, ...args] = raw.trim().split(/\s+/).filter(Boolean)
  return { cmd: cmd?.toLowerCase() ?? '', args }
}

export const NAV_ALIASES: Record<string, string> = {
  resume: 'resume',
  about: 'about',
  contact: 'contact',
  trash: 'recyclebin',
  music: 'winamp',
}

export function formatResume(content: ResumeContent = resumeContent): string {
  return [
    `${content.name} — ${content.title}`,
    '',
    ...content.experience.map((e) => `${e.years}  ${e.role}, ${e.organization}`),
    '',
    `Skills: ${content.skills.join(', ')}`,
    `Education: ${content.education}`,
  ].join('\n')
}

export function formatAbout(content: AboutContent = aboutContent): string {
  return [
    `${content.name} — ${content.title}`,
    `Location: ${content.location}`,
    `Summary: ${content.summary}`,
    `Skills: ${content.skills}`,
    `Status: ${content.status}`,
  ].join('\n')
}

export function formatContact(content: ContactContent = contactContent): string {
  return content.links.map((l) => `${l.label}: ${l.value}`).join('\n')
}

const CAT_FORMATTERS: Record<string, () => string> = {
  'resume.txt': () => formatResume(),
  'about.txt': () => formatAbout(),
  'contact.txt': () => formatContact(),
}

export interface TerminalContext {
  appRegistry: AppConfig[]
  appRegistryById: Record<string, AppConfig>
  openApp: (app: AppConfig) => void
  closeApp: (id: string) => void
  unlocked: Set<string>
  history: { input: string; output: string | null }[]
}

function projectApps(ctx: TerminalContext): AppConfig[] {
  return ctx.appRegistry.filter((app) => app.id.startsWith('project-'))
}

function resolveAppId(name: string | undefined, ctx: TerminalContext): string | undefined {
  if (!name) return undefined
  const lower = name.toLowerCase()
  if (NAV_ALIASES[lower]) return NAV_ALIASES[lower]
  if (ctx.appRegistryById[lower]) return lower
  const project = projectApps(ctx).find(
    (app) => app.iconLabel.toLowerCase() === lower || app.id === `project-${lower}`,
  )
  return project?.id
}

export const UNKNOWN_COMMAND = (cmd: string) =>
  `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`

export function buildCommandRegistry(
  ctx: TerminalContext,
): Record<string, (args: string[]) => string | null> {
  const cd = (args: string[]): string | null => {
    if (args[0]?.toLowerCase() === 'projects') {
      const names = projectApps(ctx).map((app) => app.iconLabel)
      return names.length ? names.join('\n') : 'No projects found.'
    }
    const id = resolveAppId(args[0], ctx)
    const app = id ? ctx.appRegistryById[id] : undefined
    if (!app) return `The system cannot find the path specified: ${args[0] ?? ''}`
    ctx.openApp(app)
    return `Opening ${app.iconLabel}...`
  }

  return {
    help: () =>
      [
        'Available commands:',
        '  help              show this list',
        '  ls                list navigable folders',
        '  cd <name>         open a folder/app (resume, about, contact, trash, music, projects)',
        '  cat <file>        print a file (resume.txt, about.txt, contact.txt)',
        '  open <name>       same as cd',
        '  whoami            who is using this terminal',
        '  neofetch          system info card',
        '  history           show command history',
        '  clear             clear the screen',
        '  exit              close this window',
      ].join('\n'),

    whoami: () => 'GUEST\\visitor — but you probably want `cat about.txt`',

    ls: () => {
      const names = ctx.appRegistry
        .filter((app) => app.showOnDesktop && !app.id.startsWith('project-'))
        .map((app) => app.iconLabel)
      names.push('Projects')
      return names.join('\n')
    },

    cd,
    open: cd,

    cat: (args) => {
      const file = args[0]?.toLowerCase()
      const formatter = file ? CAT_FORMATTERS[file] : undefined
      if (!formatter) return `The system cannot find the file specified: ${args[0] ?? ''}`
      return formatter()
    },

    clear: () => null,

    history: () => ctx.history.map((h) => h.input).join('\n') || '(empty)',

    neofetch: () =>
      [
        `${aboutContent.name}@portfolio-os`,
        '-------------------',
        'OS: PortfolioOS XP',
        `Role: ${aboutContent.title}`,
        `Status: ${aboutContent.status}`,
        `Packages: ${aboutContent.skills}`,
      ].join('\n'),

    sudo: (args) => {
      if (args.join(' ').toLowerCase() !== 'hire-me') {
        return `Sorry, user guest is not allowed to execute "${args.join(' ')}" as root.`
      }
      if (!ctx.unlocked.has('sudo-hire-me')) {
        ctx.unlocked.add('sudo-hire-me')
        return 'guest is not in the sudoers file. This incident will be reported.'
      }
      const contact = ctx.appRegistryById['contact']
      if (contact) ctx.openApp(contact)
      return 'Permission granted. Redirecting to contact...'
    },

    exit: () => {
      ctx.closeApp('terminal')
      return null
    },
  }
}
