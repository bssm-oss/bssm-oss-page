import { useEffect, useMemo, useState } from 'react'
import { WorkspaceCanvas } from '../components/workspace/WorkspaceCanvas'
import { InspectorPanel } from '../components/workspace/InspectorPanel'
import {
  getAiProvider,
  getEditorActor,
  getProviderApiKey,
  getStoredMode,
  storeAiProvider,
  storeEditorActor,
  storeMode,
  storeProviderApiKey,
  verifyEditPassphrase,
} from '../lib/editorAccess'
import { requestAiCompletion } from '../lib/ai'
import { validateRuntimeSource } from '../lib/runtimeSource'
import {
  appendThreadMessage,
  applyNodeSource,
  createThread,
  getTransportLabel,
  subscribeWorkspace,
  undoLastRevision,
} from '../services/workspaceStore'
import type { AiProvider, AiResult, EditorMode, WorkspaceSnapshot } from '../types'

interface EditorWorkspacePageProps {
  initialMode?: EditorMode
}

const defaultModels: Record<AiProvider, string> = {
  openai: 'gpt-5-mini',
  anthropic: 'claude-sonnet-4-5',
}

function createEmptySnapshot(): WorkspaceSnapshot {
  return {
    workspace: {
      version: 1,
      activeTheme: 'experimental-oss-editor',
      lastAppliedAt: '',
      lastAppliedBy: '',
      nodes: [],
    },
    threads: [],
    revisions: [],
    transport: 'local',
  }
}

export function EditorWorkspacePage({ initialMode }: EditorWorkspacePageProps) {
  const resolvedMode = initialMode ?? getStoredMode('ai')
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot>(() => createEmptySnapshot())
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [draftSource, setDraftSource] = useState('')
  const [sourceError, setSourceError] = useState<string | null>(null)
  const [actor, setActor] = useState(() => getEditorActor())
  const [passphrase, setPassphrase] = useState('')
  const [unlockError, setUnlockError] = useState<string | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(
    () => !import.meta.env.VITE_EDITOR_PASSPHRASE_SHA256,
  )
  const [prompt, setPrompt] = useState('')
  const [aiProvider, setAiProvider] = useState<AiProvider>(() => getAiProvider())
  const [apiKey, setApiKey] = useState(() => getProviderApiKey(getAiProvider()))
  const [model, setModel] = useState(() => defaultModels[getAiProvider()])
  const [aiBusy, setAiBusy] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<AiResult | null>(null)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [isPinPlacementActive, setIsPinPlacementActive] = useState(false)

  useEffect(() => {
    storeMode(resolvedMode)
  }, [resolvedMode])

  useEffect(() => {
    storeEditorActor(actor)
  }, [actor])

  useEffect(() => {
    storeAiProvider(aiProvider)
    setApiKey(getProviderApiKey(aiProvider))
    setModel(defaultModels[aiProvider])
  }, [aiProvider])

  useEffect(() => {
    storeProviderApiKey(aiProvider, apiKey)
  }, [aiProvider, apiKey])

  useEffect(() => {
    return subscribeWorkspace((nextSnapshot) => {
      setSnapshot(nextSnapshot)
    })
  }, [])

  useEffect(() => {
    if (snapshot.workspace.nodes.length === 0) {
      return
    }

    const currentExists = snapshot.workspace.nodes.some(
      (node) => node.nodeId === selectedNodeId,
    )

    if (currentExists) {
      return
    }

    setSelectedNodeId(snapshot.workspace.nodes[0]?.nodeId ?? null)
  }, [snapshot.workspace.nodes, selectedNodeId])

  const selectedNode = useMemo(
    () =>
      selectedNodeId
        ? snapshot.workspace.nodes.find((node) => node.nodeId === selectedNodeId) ?? null
        : null,
    [selectedNodeId, snapshot.workspace.nodes],
  )

  const selectedThreads = useMemo(
    () =>
      selectedNodeId
        ? snapshot.threads.filter((thread) => thread.nodeId === selectedNodeId)
        : [],
    [selectedNodeId, snapshot.threads],
  )

  useEffect(() => {
    setDraftSource(selectedNode?.source ?? '')
    setSourceError(null)
    setAiResult(null)
  }, [selectedNode?.nodeId, selectedNode?.source])

  useEffect(() => {
    if (selectedThreads.length === 0) {
      setActiveThreadId(null)
      return
    }

    if (!activeThreadId) {
      setActiveThreadId(selectedThreads[0].threadId)
      return
    }

    const exists = selectedThreads.some((thread) => thread.threadId === activeThreadId)

    if (!exists) {
      setActiveThreadId(selectedThreads[0].threadId)
    }
  }, [activeThreadId, selectedThreads])

  async function handleUnlock() {
    const isValid = await verifyEditPassphrase(passphrase)

    if (!isValid) {
      setUnlockError('Shared edit passphrase가 일치하지 않습니다.')
      setIsUnlocked(false)
      return
    }

    setUnlockError(null)
    setIsUnlocked(true)
  }

  async function handleApply(trigger: 'code' | 'ai') {
    if (!selectedNode) {
      return
    }

    if (!isUnlocked) {
      setSourceError('Apply 전에 먼저 편집 잠금을 해제해야 합니다.')
      return
    }

    const validated = validateRuntimeSource(draftSource, selectedNode.props)

    if (!validated.ok) {
      setSourceError(validated.error)
      return
    }

    setSourceError(null)
    await applyNodeSource(selectedNode.nodeId, draftSource, actor, trigger)
  }

  async function handleUndo() {
    if (!selectedNode || !isUnlocked) {
      return
    }

    try {
      await undoLastRevision(selectedNode.nodeId, actor)
      setSourceError(null)
    } catch (error) {
      setSourceError(error instanceof Error ? error.message : 'Undo failed.')
    }
  }

  async function ensureThread() {
    if (!selectedNode) {
      return null
    }

    if (activeThreadId) {
      return activeThreadId
    }

    const threadId = await createThread(
      selectedNode.nodeId,
      {
        nodeId: selectedNode.nodeId,
        x: 0.88,
        y: 0.12,
      },
      actor,
      'Started an AI editing thread.',
    )

    setActiveThreadId(threadId)
    return threadId
  }

  async function handleRunAi() {
    if (!selectedNode || !prompt.trim()) {
      return
    }

    if (!isUnlocked) {
      setAiError('AI 수정도 먼저 편집 잠금을 해제해야 합니다.')
      return
    }

    const threadId = await ensureThread()

    if (!threadId) {
      return
    }

    const currentThread =
      selectedThreads.find((thread) => thread.threadId === threadId) ?? null

    setAiBusy(true)
    setAiError(null)

    try {
      await appendThreadMessage(threadId, {
        role: 'user',
        text: prompt,
        author: actor,
        provider: aiProvider,
      })

      const result = await requestAiCompletion({
        provider: aiProvider,
        apiKey,
        model,
        node: selectedNode,
        thread: currentThread,
        prompt,
      })

      setAiResult(result)
      setDraftSource(result.nextSource)
      setPrompt('')

      await appendThreadMessage(threadId, {
        role: 'assistant',
        text: `${result.summary}\n\n${result.notes.join('\n')}`,
        author: `${aiProvider}:${model}`,
        provider: aiProvider,
      })
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'AI request failed.')
    } finally {
      setAiBusy(false)
    }
  }

  async function handlePlacePin(nodeId: string, x: number, y: number) {
    if (!isUnlocked) {
      setUnlockError('핀을 찍으려면 먼저 편집 잠금을 해제해야 합니다.')
      return
    }

    const threadId = await createThread(
      nodeId,
      {
        nodeId,
        x,
        y,
      },
      actor,
      'Pinned this block for live discussion.',
    )

    setActiveThreadId(threadId)
    setIsPinPlacementActive(false)
  }

  return (
    <div className="workspace-page">
      <section className="workspace-toolbar">
        <div>
          <span className="eyebrow">Experimental OSS editor</span>
          <h1 className="workspace-toolbar__title">
            하나의 랜딩을 클릭하고, 오른쪽에서 코드나 AI로 바로 바꾸는 캔버스
          </h1>
        </div>
        <div className="workspace-toolbar__meta">
          <span className="chip">{resolvedMode.toUpperCase()}</span>
          <span className="chip">{getTransportLabel(snapshot)}</span>
          <span className="chip">
            last apply {snapshot.workspace.lastAppliedBy || 'seed'}
          </span>
        </div>
      </section>

      <div className="workspace-layout">
        <WorkspaceCanvas
          isPinPlacementActive={resolvedMode === 'ai' && isPinPlacementActive}
          selectedNodeId={selectedNodeId}
          workspace={snapshot.workspace}
          onOpenThread={setActiveThreadId}
          onPlacePin={handlePlacePin}
          onSelectNode={setSelectedNodeId}
        />

        <InspectorPanel
          activeThreadId={activeThreadId}
          actor={actor}
          aiBusy={aiBusy}
          aiError={aiError}
          aiProvider={aiProvider}
          aiResult={aiResult}
          apiKey={apiKey}
          draftSource={draftSource}
          isPinPlacementActive={isPinPlacementActive}
          isUnlocked={isUnlocked}
          mode={resolvedMode}
          model={model}
          onActorChange={setActor}
          onAiProviderChange={(value) => {
            setAiProvider(value)
            setAiError(null)
          }}
          onApiKeyChange={setApiKey}
          onApplyAi={() => {
            void handleApply('ai')
          }}
          onApplyCode={() => {
            void handleApply('code')
          }}
          onDraftSourceChange={setDraftSource}
          onModelChange={setModel}
          onPassphraseChange={setPassphrase}
          onPromptChange={setPrompt}
          onRunAi={() => {
            void handleRunAi()
          }}
          onSelectThread={setActiveThreadId}
          onTogglePinPlacement={() => {
            setIsPinPlacementActive((current) => !current)
          }}
          onUndo={() => {
            void handleUndo()
          }}
          onUnlock={() => {
            void handleUnlock()
          }}
          passphrase={passphrase}
          prompt={prompt}
          selectedNode={selectedNode}
          selectedThreads={selectedThreads}
          sourceError={sourceError}
          transportLabel={getTransportLabel(snapshot)}
          unlockError={unlockError}
        />
      </div>
    </div>
  )
}
