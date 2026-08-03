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

export interface AchievementTrack {
  title: string
  subtitle: string
  duration: string
}

export interface AchievementsContent {
  nowPlaying: string
  tracks: AchievementTrack[]
}

export interface Testimonial {
  quote: string
  author: string
  role: string
}

export interface TestimonialsContent {
  scanSummary: string
  testimonials: Testimonial[]
}

export interface ProjectFile {
  name: string
  description: string
}

export interface Project {
  slug: string
  name: string
  summary: string
  role: string
  stack: string
  files: ProjectFile[]
  linkedApps?: string[]
}

export interface NetworkPlace {
  id: string
  label: string
  description: string
  icon: string
}
