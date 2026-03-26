export type ModeRoute = 'ai' | 'code'

export interface RepoSummary {
  name: string
  description: string
  language: string
  stars: number
  updatedAt: string
  href: string
  featured: boolean
  category: string
}

export interface OrgSnapshot {
  name: string
  slug: string
  href: string
  blog: string
  email: string
  followers: number
  publicRepos: number
  snapshotDate: string
  latestUpdate: string
  tagline: string
  intro: string
  repos: RepoSummary[]
}
