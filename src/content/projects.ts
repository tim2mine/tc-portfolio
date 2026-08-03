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
    slug: 'project-two',
    name: '[TODO: Second Project Name]',
    summary: '[TODO: one-paragraph summary of the project — what it is, what problem it solves]',
    role: '[TODO: your role]',
    stack: '[TODO: tech stack]',
    files: [
      { name: 'overview.txt', description: '[TODO: brief write-up]' },
      { name: 'screenshot-01.png', description: '[TODO: screenshot placeholder]' },
    ],
  },
]
