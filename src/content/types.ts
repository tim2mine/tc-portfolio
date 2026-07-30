export interface AboutContent {
  name: string
  title: string
  location: string
  summary: string
  skills: string
  installedDrivers: string
  status: string
}

export interface ResumeEntry {
  years: string
  role: string
  organization: string
}

export interface ResumeContent {
  name: string
  title: string
  experience: ResumeEntry[]
  skills: string[]
  education: string
  resumePdfUrl: string | null
}

export interface ContactLink {
  label: string
  value: string
  href: string
}

export interface ContactContent {
  addressBarUrl: string
  links: ContactLink[]
}

export interface RecycleBinItem {
  name: string
  description: string
}

export interface RecycleBinContent {
  intro: string
  items: RecycleBinItem[]
}
