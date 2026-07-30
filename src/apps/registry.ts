import { AboutWindow } from './about/AboutWindow'
import { ResumeWindow } from './resume/ResumeWindow'
import { ContactWindow } from './contact/ContactWindow'
import { RecycleBinWindow } from './recyclebin/RecycleBinWindow'
import type { AppConfig } from './types'

export const appRegistry: AppConfig[] = [
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
]

export const appRegistryById: Record<string, AppConfig> = Object.fromEntries(
  appRegistry.map((app) => [app.id, app]),
)
