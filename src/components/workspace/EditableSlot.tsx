import type { KeyboardEvent, MouseEvent, PropsWithChildren } from 'react'
import type { CommentPin, EditableNode } from '../../types'

interface EditableSlotProps extends PropsWithChildren {
  node: EditableNode
  selected: boolean
  hasError: boolean
  isPinPlacementActive: boolean
  onSelect: (nodeId: string) => void
  onPlacePin: (nodeId: string, x: number, y: number) => void
  onOpenThread: (threadId: string) => void
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

function relativePosition(
  event: MouseEvent<HTMLElement>,
  currentTarget: HTMLElement,
) {
  const rect = currentTarget.getBoundingClientRect()
  return {
    x: clamp((event.clientX - rect.left) / rect.width),
    y: clamp((event.clientY - rect.top) / rect.height),
  }
}

function handleKeyboardSelect(
  event: KeyboardEvent<HTMLElement>,
  nodeId: string,
  onSelect: (nodeId: string) => void,
) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return
  }

  event.preventDefault()
  onSelect(nodeId)
}

function PinButton({
  pin,
  onOpenThread,
}: {
  pin: CommentPin
  onOpenThread: (threadId: string) => void
}) {
  return (
    <button
      className="editable-slot__pin"
      style={{
        left: `${pin.x * 100}%`,
        top: `${pin.y * 100}%`,
      }}
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onOpenThread(pin.threadId)
      }}
    >
      <span className="sr-only">Open thread</span>
      {pin.threadId.slice(-2)}
    </button>
  )
}

export function EditableSlot({
  node,
  selected,
  hasError,
  isPinPlacementActive,
  onSelect,
  onPlacePin,
  onOpenThread,
  children,
}: EditableSlotProps) {
  return (
    <div
      aria-label={`${node.title} editable block`}
      className={[
        'editable-slot',
        selected ? 'editable-slot--selected' : '',
        hasError ? 'editable-slot--error' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="button"
      tabIndex={0}
      onClick={(event) => {
        event.preventDefault()
        onSelect(node.nodeId)

        if (!isPinPlacementActive) {
          return
        }

        const position = relativePosition(event, event.currentTarget)
        onPlacePin(node.nodeId, position.x, position.y)
      }}
      onKeyDown={(event) => {
        handleKeyboardSelect(event, node.nodeId, onSelect)
      }}
    >
      <div className="editable-slot__label">
        <span>{node.kind}</span>
        <strong>{node.title}</strong>
      </div>

      {children}

      {node.commentPins.map((pin) => (
        <PinButton key={pin.pinId} pin={pin} onOpenThread={onOpenThread} />
      ))}
    </div>
  )
}

