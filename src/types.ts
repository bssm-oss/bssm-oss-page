export type ModeRoute = 'ai' | 'code'
export type EditorMode = ModeRoute

export type NodeKind = 'section' | 'card'
export type WorkspaceTransport = 'firestore' | 'local'
export type RevisionTrigger = 'code' | 'ai' | 'undo' | 'seed'
export type ThreadStatus = 'open' | 'resolved'
export type CommentRole = 'comment' | 'user' | 'assistant'
export type AiProvider = 'openai' | 'anthropic'

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

export interface EditableNode {
  nodeId: string
  kind: NodeKind
  title: string
  source: string
  props: Record<string, unknown>
  bindings: string[]
  commentPins: CommentPin[]
  updatedAt: string
  updatedBy: string
}

export interface CommentPin {
  pinId: string
  nodeId: string
  x: number
  y: number
  threadId: string
}

export interface CommentMessage {
  messageId: string
  role: CommentRole
  text: string
  author: string
  createdAt: string
  provider?: AiProvider
}

export interface CommentThread {
  threadId: string
  nodeId: string
  title: string
  status: ThreadStatus
  createdAt: string
  updatedAt: string
  pinId: string
  messages: CommentMessage[]
}

export interface RevisionEntry {
  revisionId: string
  nodeId: string
  previousSource: string
  nextSource: string
  actor: string
  createdAt: string
  trigger: RevisionTrigger
}

export interface WorkspaceDoc {
  version: number
  activeTheme: string
  lastAppliedAt: string
  lastAppliedBy: string
  nodes: EditableNode[]
}

export interface WorkspaceSnapshot {
  workspace: WorkspaceDoc
  threads: CommentThread[]
  revisions: RevisionEntry[]
  transport: WorkspaceTransport
}

export interface AiResult {
  summary: string
  nextSource: string
  notes: string[]
}
