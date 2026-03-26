import Editor from '@monaco-editor/react'
import type {
  AiProvider,
  AiResult,
  CommentThread,
  EditableNode,
  EditorMode,
} from '../../types'

interface InspectorPanelProps {
  actor: string
  onActorChange: (value: string) => void
  mode: EditorMode
  transportLabel: string
  selectedNode: EditableNode | null
  selectedThreads: CommentThread[]
  activeThreadId: string | null
  onSelectThread: (threadId: string) => void
  isUnlocked: boolean
  passphrase: string
  unlockError: string | null
  onPassphraseChange: (value: string) => void
  onUnlock: () => void
  isPinPlacementActive: boolean
  onTogglePinPlacement: () => void
  draftSource: string
  onDraftSourceChange: (value: string) => void
  sourceError: string | null
  onApplyCode: () => void
  onUndo: () => void
  prompt: string
  onPromptChange: (value: string) => void
  aiProvider: AiProvider
  onAiProviderChange: (value: AiProvider) => void
  apiKey: string
  onApiKeyChange: (value: string) => void
  model: string
  onModelChange: (value: string) => void
  onRunAi: () => void
  onApplyAi: () => void
  aiBusy: boolean
  aiError: string | null
  aiResult: AiResult | null
}

function CodeEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const isTestLike =
    typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('jsdom')

  if (isTestLike) {
    return (
      <textarea
        className="inspector-panel__textarea inspector-panel__textarea--code"
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />
    )
  }

  return (
    <div className="inspector-panel__editor">
      <Editor
        defaultLanguage="typescript"
        height="320px"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbersMinChars: 3,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
        }}
        theme="vs-light"
        value={value}
        onChange={(nextValue) => {
          onChange(nextValue ?? '')
        }}
      />
    </div>
  )
}

function ThreadList({
  activeThreadId,
  threads,
  onSelectThread,
}: {
  activeThreadId: string | null
  threads: CommentThread[]
  onSelectThread: (threadId: string) => void
}) {
  if (threads.length === 0) {
    return <div className="inspector-empty">아직 이 블록에 열린 스레드가 없습니다.</div>
  }

  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <button
          key={thread.threadId}
          className={`thread-list__item ${
            activeThreadId === thread.threadId ? 'thread-list__item--active' : ''
          }`}
          type="button"
          onClick={() => {
            onSelectThread(thread.threadId)
          }}
        >
          <strong>{thread.title}</strong>
          <span>{thread.messages.length} messages</span>
        </button>
      ))}
    </div>
  )
}

function ThreadDetail({ thread }: { thread: CommentThread | null }) {
  if (!thread) {
    return <div className="inspector-empty">핀을 찍거나 첫 메시지를 남기면 스레드가 생깁니다.</div>
  }

  return (
    <div className="thread-detail">
      {thread.messages.map((message) => (
        <article
          key={message.messageId}
          className={`thread-message thread-message--${message.role}`}
        >
          <div className="thread-message__meta">
            <strong>{message.author}</strong>
            <span>{new Date(message.createdAt).toLocaleTimeString('ko-KR')}</span>
          </div>
          <p>{message.text}</p>
        </article>
      ))}
    </div>
  )
}

export function InspectorPanel({
  actor,
  onActorChange,
  mode,
  transportLabel,
  selectedNode,
  selectedThreads,
  activeThreadId,
  onSelectThread,
  isUnlocked,
  passphrase,
  unlockError,
  onPassphraseChange,
  onUnlock,
  isPinPlacementActive,
  onTogglePinPlacement,
  draftSource,
  onDraftSourceChange,
  sourceError,
  onApplyCode,
  onUndo,
  prompt,
  onPromptChange,
  aiProvider,
  onAiProviderChange,
  apiKey,
  onApiKeyChange,
  model,
  onModelChange,
  onRunAi,
  onApplyAi,
  aiBusy,
  aiError,
  aiResult,
}: InspectorPanelProps) {
  const activeThread =
    selectedThreads.find((thread) => thread.threadId === activeThreadId) ?? selectedThreads[0] ?? null

  return (
    <aside className="inspector-panel">
      <div className="inspector-panel__top">
        <div>
          <p className="section-heading__label">Inspector</p>
          <h2 className="inspector-panel__title">
            {mode === 'code' ? 'Code Mode' : 'AI Mode'}
          </h2>
        </div>
        <span className="chip">{transportLabel}</span>
      </div>

      <label className="inspector-panel__field">
        <span>Editor alias</span>
        <input
          className="inspector-panel__input"
          value={actor}
          onChange={(event) => {
            onActorChange(event.target.value)
          }}
        />
      </label>

      <div className="inspector-panel__lock-card">
        <div>
          <strong>{isUnlocked ? '편집 unlocked' : '편집 locked'}</strong>
          <p>보기는 누구나 가능하지만 Apply는 passphrase를 통과한 세션만 허용합니다.</p>
        </div>
        <label className="inspector-panel__field">
          <span>Shared edit passphrase</span>
          <input
            className="inspector-panel__input"
            type="password"
            value={passphrase}
            onChange={(event) => {
              onPassphraseChange(event.target.value)
            }}
          />
        </label>
        <button className="shell-button" type="button" onClick={onUnlock}>
          Unlock editing
        </button>
        {unlockError ? <p className="inspector-panel__error">{unlockError}</p> : null}
      </div>

      {selectedNode ? (
        <div className="inspector-panel__selection">
          <div className="inspector-panel__selection-header">
            <div>
              <p className="section-heading__label">Selected node</p>
              <h3>{selectedNode.title}</h3>
            </div>
            <span className="chip">{selectedNode.kind}</span>
          </div>
          <div className="inspector-panel__chip-list">
            {selectedNode.bindings.map((binding) => (
              <span key={binding} className="chip">
                {binding}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="inspector-empty">
          캔버스에서 섹션이나 카드를 클릭하면 여기서 코드나 AI 스레드를 바로 엽니다.
        </div>
      )}

      {mode === 'code' ? (
        <>
          <CodeEditor value={draftSource} onChange={onDraftSourceChange} />
          {sourceError ? <p className="inspector-panel__error">{sourceError}</p> : null}
          <div className="inspector-panel__actions">
            <button
              className="shell-button"
              disabled={!selectedNode || !isUnlocked}
              type="button"
              onClick={onApplyCode}
            >
              Apply live
            </button>
            <button
              className="ghost-button"
              disabled={!selectedNode || !isUnlocked}
              type="button"
              onClick={onUndo}
            >
              Undo last apply
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="inspector-panel__thread-tools">
            <button
              className={isPinPlacementActive ? 'shell-button' : 'ghost-button'}
              disabled={!selectedNode || !isUnlocked}
              type="button"
              onClick={onTogglePinPlacement}
            >
              {isPinPlacementActive ? 'Pin mode on' : 'Place pin'}
            </button>
          </div>

          <ThreadList
            activeThreadId={activeThreadId}
            threads={selectedThreads}
            onSelectThread={onSelectThread}
          />
          <ThreadDetail thread={activeThread} />

          <div className="inspector-panel__provider">
            <label className="inspector-panel__field">
              <span>AI provider</span>
              <select
                className="inspector-panel__input"
                value={aiProvider}
                onChange={(event) => {
                  onAiProviderChange(event.target.value as AiProvider)
                }}
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </label>
            <label className="inspector-panel__field">
              <span>Model</span>
              <input
                className="inspector-panel__input"
                value={model}
                onChange={(event) => {
                  onModelChange(event.target.value)
                }}
              />
            </label>
            <label className="inspector-panel__field">
              <span>API key</span>
              <input
                className="inspector-panel__input"
                type="password"
                value={apiKey}
                onChange={(event) => {
                  onApiKeyChange(event.target.value)
                }}
              />
            </label>
          </div>

          <label className="inspector-panel__field">
            <span>Prompt the selected node</span>
            <textarea
              className="inspector-panel__textarea"
              placeholder="예: 이 카드의 배경을 더 붉게 만들고 제목을 더 직접적으로 바꿔."
              value={prompt}
              onChange={(event) => {
                onPromptChange(event.target.value)
              }}
            />
          </label>

          <div className="inspector-panel__actions">
            <button
              className="shell-button"
              disabled={!selectedNode || !isUnlocked || aiBusy}
              type="button"
              onClick={onRunAi}
            >
              {aiBusy ? 'Thinking…' : 'AI 사용'}
            </button>
            <button
              className="ghost-button"
              disabled={!aiResult || !isUnlocked}
              type="button"
              onClick={onApplyAi}
            >
              Apply AI result
            </button>
          </div>

          {aiError ? <p className="inspector-panel__error">{aiError}</p> : null}
          {aiResult ? (
            <article className="ai-result">
              <strong>{aiResult.summary}</strong>
              <ul className="ai-result__notes">
                {aiResult.notes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <pre className="ai-result__preview">
                <code>{aiResult.nextSource}</code>
              </pre>
            </article>
          ) : null}
        </>
      )}
    </aside>
  )
}

