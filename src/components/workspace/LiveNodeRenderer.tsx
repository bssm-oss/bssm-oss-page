import { validateRuntimeSource } from '../../lib/runtimeSource'
import type { EditableNode } from '../../types'

interface LiveNodeRendererProps {
  node: EditableNode
  onError?: (nodeId: string, message: string | null) => void
}

export function LiveNodeRenderer({ node, onError }: LiveNodeRendererProps) {
  const validated = validateRuntimeSource(node.source, node.props)

  if (!validated.ok) {
    onError?.(node.nodeId, validated.error)

    return (
      <article className="runtime-error-card">
        <strong>Render error</strong>
        <p>{validated.error}</p>
      </article>
    )
  }

  onError?.(node.nodeId, null)

  return <>{validated.render(node.props)}</>
}

