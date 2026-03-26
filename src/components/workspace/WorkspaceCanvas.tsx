import { workspaceLayout } from '../../data/workspaceSeed'
import { validateRuntimeSource } from '../../lib/runtimeSource'
import type { WorkspaceDoc } from '../../types'
import { EditableSlot } from './EditableSlot'
import { LiveNodeRenderer } from './LiveNodeRenderer'

interface WorkspaceCanvasProps {
  workspace: WorkspaceDoc
  selectedNodeId: string | null
  isPinPlacementActive: boolean
  onSelectNode: (nodeId: string) => void
  onPlacePin: (nodeId: string, x: number, y: number) => void
  onOpenThread: (threadId: string) => void
}

export function WorkspaceCanvas({
  workspace,
  selectedNodeId,
  isPinPlacementActive,
  onSelectNode,
  onPlacePin,
  onOpenThread,
}: WorkspaceCanvasProps) {
  const nodeMap = new Map(workspace.nodes.map((node) => [node.nodeId, node]))

  function renderNode(nodeId: string) {
    const node = nodeMap.get(nodeId)

    if (!node) {
      return null
    }

    const hasError = !validateRuntimeSource(node.source, node.props).ok

    return (
      <EditableSlot
        key={nodeId}
        hasError={hasError}
        isPinPlacementActive={isPinPlacementActive}
        node={node}
        selected={selectedNodeId === nodeId}
        onOpenThread={onOpenThread}
        onPlacePin={onPlacePin}
        onSelect={onSelectNode}
      >
        <LiveNodeRenderer node={node} />
      </EditableSlot>
    )
  }

  return (
    <section aria-label="Editable bssm-oss canvas" className="workspace-canvas">
      <div className="workspace-canvas__hero">
        {renderNode(workspaceLayout.heroNodeId)}

        <aside className="workspace-canvas__rail">
          {renderNode(workspaceLayout.latestHeaderNodeId)}
          <div className="workspace-rail-list">
            {workspaceLayout.latestCardNodeIds.map((nodeId) => renderNode(nodeId))}
          </div>
        </aside>
      </div>

      <div className="workspace-grid workspace-grid--stats">
        {workspaceLayout.statsNodeIds.map((nodeId) => renderNode(nodeId))}
      </div>

      <section className="workspace-section">
        {renderNode(workspaceLayout.featuredHeaderNodeId)}
        <div className="workspace-grid workspace-grid--featured">
          {workspaceLayout.featuredCardNodeIds.map((nodeId) => renderNode(nodeId))}
        </div>
      </section>

      <section className="workspace-section">
        {renderNode(workspaceLayout.themesHeaderNodeId)}
        <div className="workspace-grid workspace-grid--themes">
          {workspaceLayout.themeCardNodeIds.map((nodeId) => renderNode(nodeId))}
        </div>
      </section>

      <section className="workspace-section">
        {renderNode(workspaceLayout.atlasHeaderNodeId)}
        <div className="workspace-grid workspace-grid--atlas">
          {workspaceLayout.atlasCardNodeIds.map((nodeId) => renderNode(nodeId))}
        </div>
      </section>

      <section className="workspace-section">
        {renderNode(workspaceLayout.futureHeaderNodeId)}
        <div className="workspace-grid workspace-grid--modes">
          {workspaceLayout.futureCardNodeIds.map((nodeId) => renderNode(nodeId))}
        </div>
      </section>
    </section>
  )
}

