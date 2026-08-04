import type { Project } from './types'

export const projects: Project[] = [
  {
    slug: 'homelab',
    name: 'Homelab',
    summary:
      'An ongoing home infrastructure project covering server virtualization, self-hosted apps, network segmentation, and monitoring — built and administered solo to apply and grow systems administration skills.',
    role: '[System Admin]',
    stack: '[Proxmox, Docker, pfSense, Nginx]',
    files: [],
    linkedApps: ['network-places'],
  },
  {
    slug: 'xp-luna-portfolio',
    name: 'XP:Luna Portfolio',
    summary:
      "This site — a Windows XP 'Luna' desktop rebuilt as a portfolio, with draggable windows, a working Start menu and taskbar, a BIOS boot sequence, and a real Terminal you can type commands into. Built on a plugin-style architecture where every app is a self-contained registry entry, so new features never touch the shared window manager.",
    role: 'Designer & Developer',
    stack: 'React, TypeScript, Vite',
    files: [
      {
        name: 'CASE-STUDY.md',
        description: 'Technical write-up: architecture, build timeline, and design decisions',
        href: 'https://github.com/tim2mine/tc-portfolio/blob/master/CASE-STUDY.md',
      },
      {
        name: 'luna-design-system.html',
        description: 'Visual design reference: color, typography, and icon system',
        href: 'https://timothycatalano.dev/luna-design-system.html',
      },
    ],
  },
]
