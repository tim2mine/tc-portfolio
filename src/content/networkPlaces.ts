import type { NetworkPlace } from './types'

export const networkPlaces: NetworkPlace[] = [
  {
    id: 'proxmox',
    label: 'Proxmox Node',
    description: 'Hypervisor host running the VMs and containers behind the homelab.',
    icon: '/icons/network/proxmox.png',
  },
  {
    id: 'docker',
    label: 'Docker Host',
    description: 'Runs the self-hosted apps and services as containers.',
    icon: '/icons/network/docker.png',
  },
  {
    id: 'pfsense',
    label: 'pfSense Router',
    description: 'Firewall and router handling network segmentation and routing.',
    icon: '/icons/network/pfsense.jpg',
  },
  {
    id: 'truenas',
    label: 'TrueNAS Storage',
    description: 'Network-attached storage for backups and shared files.',
    icon: '/icons/network/truenas.jpg',
  },
  {
    id: 'nginx',
    label: 'Nginx Proxy Manager',
    description: 'Routes and terminates traffic for the self-hosted services.',
    icon: '/icons/network/nginx.png',
  },
]
