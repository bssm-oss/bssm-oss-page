import { getApp, getApps, initializeApp } from 'firebase/app'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { createSeedWorkspace } from '../data/workspaceSeed'
import type {
  CommentMessage,
  CommentPin,
  CommentThread,
  RevisionEntry,
  RevisionTrigger,
  WorkspaceSnapshot,
} from '../types'

const storageKeys = {
  workspace: 'bssm-live-editor.workspace',
  threads: 'bssm-live-editor.threads',
  revisions: 'bssm-live-editor.revisions',
}

const listeners = new Set<(snapshot: WorkspaceSnapshot) => void>()
const channel =
  typeof BroadcastChannel === 'undefined'
    ? null
    : new BroadcastChannel('bssm-live-editor.sync')

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean)

let cachedSnapshot: WorkspaceSnapshot = createSnapshot('local')

function createSnapshot(transport: WorkspaceSnapshot['transport']): WorkspaceSnapshot {
  return {
    workspace: createSeedWorkspace(),
    threads: [],
    revisions: [],
    transport,
  }
}

function safeStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  const candidate = window.localStorage
  return candidate &&
    typeof candidate.getItem === 'function' &&
    typeof candidate.setItem === 'function'
    ? candidate
    : null
}

function cloneSnapshot(snapshot: WorkspaceSnapshot) {
  return JSON.parse(JSON.stringify(snapshot)) as WorkspaceSnapshot
}

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function readLocalSnapshot(): WorkspaceSnapshot {
  const storage = safeStorage()

  if (!storage) {
    return cloneSnapshot(cachedSnapshot)
  }

  const workspace = storage.getItem(storageKeys.workspace)
  const threads = storage.getItem(storageKeys.threads)
  const revisions = storage.getItem(storageKeys.revisions)

  if (!workspace) {
    const fresh = createSnapshot('local')
    writeLocalSnapshot(fresh)
    return fresh
  }

  return {
    workspace: JSON.parse(workspace),
    threads: threads ? JSON.parse(threads) : [],
    revisions: revisions ? JSON.parse(revisions) : [],
    transport: 'local',
  } satisfies WorkspaceSnapshot
}

function writeLocalSnapshot(snapshot: WorkspaceSnapshot) {
  const storage = safeStorage()

  if (!storage) {
    cachedSnapshot = cloneSnapshot(snapshot)
    return
  }

  storage.setItem(storageKeys.workspace, JSON.stringify(snapshot.workspace))
  storage.setItem(storageKeys.threads, JSON.stringify(snapshot.threads))
  storage.setItem(storageKeys.revisions, JSON.stringify(snapshot.revisions))
  cachedSnapshot = cloneSnapshot(snapshot)
}

function emitLocalSnapshot(snapshot: WorkspaceSnapshot) {
  writeLocalSnapshot(snapshot)
  listeners.forEach((listener) => {
    listener(cloneSnapshot(snapshot))
  })
  channel?.postMessage({ type: 'sync' })
}

function getFirebaseDb() {
  if (!hasFirebaseConfig) {
    return null
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  return getFirestore(app)
}

async function ensureRemoteSeed() {
  const db = getFirebaseDb()

  if (!db) {
    return
  }

  const workspaceRef = doc(db, 'workspaces', 'default')
  const snapshot = await getDoc(workspaceRef)

  if (!snapshot.exists()) {
    await setDoc(workspaceRef, createSeedWorkspace())
  }
}

async function withRemoteSnapshot() {
  const db = getFirebaseDb()

  if (!db) {
    throw new Error('Firebase is not configured.')
  }

  await ensureRemoteSeed()

  const workspaceRef = doc(db, 'workspaces', 'default')
  const workspaceSnapshot = await getDoc(workspaceRef)
  const threadSnapshot = await getDocs(collection(workspaceRef, 'threads'))
  const revisionSnapshot = await getDocs(collection(workspaceRef, 'revisions'))

  return {
    workspaceRef,
    workspace: workspaceSnapshot.data() as WorkspaceSnapshot['workspace'],
    threads: threadSnapshot.docs.map((item) => item.data() as CommentThread),
    revisions: revisionSnapshot.docs
      .map((item) => item.data() as RevisionEntry)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
  }
}

channel?.addEventListener('message', () => {
  if (hasFirebaseConfig) {
    return
  }

  const snapshot = readLocalSnapshot()
  cachedSnapshot = snapshot
  listeners.forEach((listener) => {
    listener(cloneSnapshot(snapshot))
  })
})

export function subscribeWorkspace(listener: (snapshot: WorkspaceSnapshot) => void) {
  if (!hasFirebaseConfig) {
    const snapshot = readLocalSnapshot()
    cachedSnapshot = snapshot
    listener(cloneSnapshot(snapshot))
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  }

  const db = getFirebaseDb()

  if (!db) {
    throw new Error('Firebase is not configured.')
  }

  let remoteState = createSnapshot('firestore')
  let isActive = true
  listener(cloneSnapshot(remoteState))

  ensureRemoteSeed().catch(() => undefined)

  const workspaceRef = doc(db, 'workspaces', 'default')
  const unsubscribeWorkspace = onSnapshot(workspaceRef, (snapshot) => {
    if (!isActive || !snapshot.exists()) {
      return
    }

    remoteState = {
      ...remoteState,
      workspace: snapshot.data() as WorkspaceSnapshot['workspace'],
      transport: 'firestore',
    }
    cachedSnapshot = cloneSnapshot(remoteState)
    listener(cloneSnapshot(remoteState))
  })

  const unsubscribeThreads = onSnapshot(
    collection(workspaceRef, 'threads'),
    (snapshot) => {
      if (!isActive) {
        return
      }

      remoteState = {
        ...remoteState,
        threads: snapshot.docs
          .map((item) => item.data() as CommentThread)
          .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
      }
      cachedSnapshot = cloneSnapshot(remoteState)
      listener(cloneSnapshot(remoteState))
    },
  )

  const unsubscribeRevisions = onSnapshot(
    collection(workspaceRef, 'revisions'),
    (snapshot) => {
      if (!isActive) {
        return
      }

      remoteState = {
        ...remoteState,
        revisions: snapshot.docs
          .map((item) => item.data() as RevisionEntry)
          .sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
      }
      cachedSnapshot = cloneSnapshot(remoteState)
      listener(cloneSnapshot(remoteState))
    },
  )

  return () => {
    isActive = false
    unsubscribeWorkspace()
    unsubscribeThreads()
    unsubscribeRevisions()
  }
}

function updateNodePins(nodePins: CommentPin[], pin: CommentPin) {
  return [...nodePins, pin]
}

function replaceNodeSource(
  workspace: WorkspaceSnapshot['workspace'],
  nodeId: string,
  nextSource: string,
  actor: string,
) {
  const nextWorkspace = JSON.parse(JSON.stringify(workspace)) as WorkspaceSnapshot['workspace']
  const nextNodes = nextWorkspace.nodes.map((node) => {
    if (node.nodeId !== nodeId) {
      return node
    }

    return {
      ...node,
      source: nextSource,
      updatedAt: new Date().toISOString(),
      updatedBy: actor,
    }
  })

  return {
    ...nextWorkspace,
    nodes: nextNodes,
    lastAppliedAt: new Date().toISOString(),
    lastAppliedBy: actor,
  }
}

export async function applyNodeSource(
  nodeId: string,
  nextSource: string,
  actor: string,
  trigger: RevisionTrigger,
) {
  if (!hasFirebaseConfig) {
    const snapshot = readLocalSnapshot()
    const node = snapshot.workspace.nodes.find((item) => item.nodeId === nodeId)

    if (!node) {
      throw new Error('Selected node was not found.')
    }

    const revision: RevisionEntry = {
      revisionId: generateId('revision'),
      nodeId,
      previousSource: node.source,
      nextSource,
      actor,
      createdAt: new Date().toISOString(),
      trigger,
    }

    const nextSnapshot: WorkspaceSnapshot = {
      ...snapshot,
      workspace: replaceNodeSource(snapshot.workspace, nodeId, nextSource, actor),
      revisions: [revision, ...snapshot.revisions].slice(0, 24),
    }

    emitLocalSnapshot(nextSnapshot)
    return
  }

  const { workspace, workspaceRef } = await withRemoteSnapshot()
  const node = workspace.nodes.find((item) => item.nodeId === nodeId)

  if (!node) {
    throw new Error('Selected node was not found.')
  }

  await setDoc(workspaceRef, replaceNodeSource(workspace, nodeId, nextSource, actor))
  await addDoc(collection(workspaceRef, 'revisions'), {
    revisionId: generateId('revision'),
    nodeId,
    previousSource: node.source,
    nextSource,
    actor,
    createdAt: new Date().toISOString(),
    trigger,
  } satisfies RevisionEntry)

}

export async function undoLastRevision(nodeId: string, actor: string) {
  const revisions = cachedSnapshot.revisions.filter((item) => item.nodeId === nodeId)
  const lastRevision = revisions[0]

  if (!lastRevision) {
    throw new Error('No revision available for this node yet.')
  }

  await applyNodeSource(nodeId, lastRevision.previousSource, actor, 'undo')
}

export async function createThread(
  nodeId: string,
  pin: Omit<CommentPin, 'pinId' | 'threadId'>,
  actor: string,
  text: string,
) {
  const pinId = generateId('pin')
  const threadId = generateId('thread')
  const now = new Date().toISOString()
  const nextPin: CommentPin = {
    ...pin,
    pinId,
    threadId,
  }

  const thread: CommentThread = {
    threadId,
    nodeId,
    title: text.slice(0, 40) || 'New thread',
    status: 'open',
    createdAt: now,
    updatedAt: now,
    pinId,
    messages: [
      {
        messageId: generateId('message'),
        role: 'comment',
        text,
        author: actor,
        createdAt: now,
      },
    ],
  }

  if (!hasFirebaseConfig) {
    const snapshot = readLocalSnapshot()
    const nextWorkspace = cloneSnapshot(snapshot).workspace
    nextWorkspace.nodes = nextWorkspace.nodes.map((node) =>
      node.nodeId === nodeId
        ? { ...node, commentPins: updateNodePins(node.commentPins, nextPin) }
        : node,
    )

    emitLocalSnapshot({
      ...snapshot,
      workspace: nextWorkspace,
      threads: [thread, ...snapshot.threads],
    })

    return thread.threadId
  }

  const { workspace, workspaceRef } = await withRemoteSnapshot()
  const nextWorkspace = JSON.parse(
    JSON.stringify(workspace),
  ) as WorkspaceSnapshot['workspace']
  nextWorkspace.nodes = workspace.nodes.map((node) =>
    node.nodeId === nodeId
      ? { ...node, commentPins: updateNodePins(node.commentPins, nextPin) }
      : node,
  )
  await setDoc(workspaceRef, nextWorkspace)
  await setDoc(doc(collection(workspaceRef, 'threads'), threadId), thread)

  return thread.threadId
}

export async function appendThreadMessage(
  threadId: string,
  message: Omit<CommentMessage, 'messageId' | 'createdAt'>,
) {
  const now = new Date().toISOString()
  const nextMessage: CommentMessage = {
    ...message,
    messageId: generateId('message'),
    createdAt: now,
  }

  if (!hasFirebaseConfig) {
    const snapshot = readLocalSnapshot()
    const nextThreads = snapshot.threads.map((thread) =>
      thread.threadId === threadId
        ? {
            ...thread,
            updatedAt: now,
            messages: [...thread.messages, nextMessage],
          }
        : thread,
    )

    emitLocalSnapshot({
      ...snapshot,
      threads: nextThreads,
    })
    return
  }

  const { workspaceRef, threads } = await withRemoteSnapshot()
  const currentThread = threads.find((thread) => thread.threadId === threadId)

  if (!currentThread) {
    throw new Error('Selected thread was not found.')
  }

  await setDoc(doc(collection(workspaceRef, 'threads'), threadId), {
    ...currentThread,
    updatedAt: now,
    messages: [...currentThread.messages, nextMessage],
  })
}

export function getTransportLabel(snapshot: WorkspaceSnapshot) {
  return snapshot.transport === 'firestore' ? 'live / firestore' : 'demo / local'
}
