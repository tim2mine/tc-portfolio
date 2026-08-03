import { AboutWindow } from './about/AboutWindow'
import { ResumeWindow } from './resume/ResumeWindow'
import { ContactWindow } from './contact/ContactWindow'
import { RecycleBinWindow } from './recyclebin/RecycleBinWindow'
import { SitePropertiesWindow } from './site-properties/SitePropertiesWindow'
import { WinampWindow } from './winamp/WinampWindow'
import { CCleanerWindow } from './ccleaner/CCleanerWindow'
import { OutlookWindow } from './outlook/OutlookWindow'
import { PaintWindow } from './paint/PaintWindow'
import { TerminalWindow } from './terminal/TerminalWindow'
import { NetworkPlacesWindow } from './network-places/NetworkPlacesWindow'
import { createProjectFolderWindow } from './projects/ProjectFolderWindow'
import { projects } from '../content/projects'
import type { AppConfig } from './types'

const staticApps: AppConfig[] = [
  {
    id: 'about',
    title: 'My Computer — Properties',
    icon: '🖥️',
    iconLabel: 'My Computer',
    defaultPosition: { x: 120, y: 70 },
    defaultSize: { width: 400, height: 320 },
    component: AboutWindow,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'resume',
    title: 'Resume.txt — Notepad',
    icon: '📄',
    iconLabel: 'My Documents',
    defaultPosition: { x: 260, y: 110 },
    defaultSize: { width: 420, height: 320 },
    component: ResumeWindow,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'contact',
    title: 'Contact — Internet Explorer',
    icon: '🌐',
    iconLabel: 'Internet Explorer',
    defaultPosition: { x: 340, y: 150 },
    defaultSize: { width: 380, height: 300 },
    component: ContactWindow,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'recyclebin',
    title: 'Recycle Bin',
    icon: '🗑️',
    iconLabel: 'Recycle Bin',
    defaultPosition: { x: 400, y: 190 },
    defaultSize: { width: 300, height: 160 },
    component: RecycleBinWindow,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'site-properties',
    title: 'Properties — About This Site',
    icon: '⚙️',
    iconLabel: 'Properties',
    defaultPosition: { x: 220, y: 130 },
    defaultSize: { width: 360, height: 260 },
    component: SitePropertiesWindow,
    showOnDesktop: false,
    showInStartMenu: false,
  },
  {
    id: 'winamp',
    title: 'Achievements.m3u — Winamp',
    icon: '🎵',
    iconLabel: 'Winamp',
    defaultPosition: { x: 480, y: 80 },
    defaultSize: { width: 300, height: 360 },
    component: WinampWindow,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'ccleaner',
    title: 'Recuva — Recover Testimonials',
    icon: '🧹',
    iconLabel: 'Testimonials',
    defaultPosition: { x: 150, y: 220 },
    defaultSize: { width: 380, height: 320 },
    component: CCleanerWindow,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'outlook',
    title: 'New Message — Outlook',
    icon: '📧',
    iconLabel: 'Outlook',
    defaultPosition: { x: 300, y: 200 },
    defaultSize: { width: 420, height: 380 },
    component: OutlookWindow,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'paint',
    title: 'Paint',
    icon: '🎨',
    iconLabel: 'Paint',
    defaultPosition: { x: 500, y: 260 },
    defaultSize: { width: 320, height: 220 },
    component: PaintWindow,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'terminal',
    title: 'C:\\WINDOWS\\system32\\cmd.exe',
    icon: '/icons/terminal.svg',
    iconLabel: 'Terminal',
    defaultPosition: { x: 180, y: 100 },
    defaultSize: { width: 620, height: 400 },
    component: TerminalWindow,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'network-places',
    title: 'Network Services',
    icon: '/icons/network-services.svg',
    iconLabel: 'Network Services',
    defaultPosition: { x: 260, y: 160 },
    defaultSize: { width: 380, height: 300 },
    component: NetworkPlacesWindow,
    showOnDesktop: false,
    showInStartMenu: false,
  },
]

const projectApps: AppConfig[] = projects.map((project, i) => ({
  id: `project-${project.slug}`,
  title: `${project.name} — Case Study`,
  icon: '📁',
  iconLabel: project.name,
  defaultPosition: { x: 80 + i * 30, y: 260 + i * 30 },
  defaultSize: { width: 380, height: 320 },
  component: createProjectFolderWindow(project),
  showOnDesktop: true,
  showInStartMenu: true,
}))

export const appRegistry: AppConfig[] = [...staticApps, ...projectApps]

export const appRegistryById: Record<string, AppConfig> = Object.fromEntries(
  appRegistry.map((app) => [app.id, app]),
)
