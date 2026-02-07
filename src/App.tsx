import { useMemo, useCallback, useEffect } from "react"

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useReactFlow,
} from "@xyflow/react"
import type { Node, Edge, OnNodesChange } from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import InfoNode from "@/components/react-flow/nodes/info-node"
import { parseFiles, parsePasteItems } from "@/lib/clipboard-parser"
import { FIT_VIEW_DURATION, FIT_VIEW_DELAY, NODE_VERTICAL_SPACING } from "@/lib/constants"

import AppHeader from "./components/app-header"
import ContentNode from "./components/react-flow/nodes/content-node"
import PasteNode from "./components/react-flow/nodes/paste-node"
import { useClipboardDataMapStore } from "./store/clipboard-data-map-store"

function App() {
  const { fitView } = useReactFlow()

  const {
    dataMap,
    setDataMap,
    setIsDragOver,
    setLastPastedType,
    activeNodeId,
    setActiveNodeId,
  } = useClipboardDataMapStore()

  const [nodes, setNodes] = useNodesState<Node>([])
  const edges: Edge[] = []

  const onNodesChange: OnNodesChange = useCallback(() => {
    // Remove automatic fitView to avoid conflicts with navigation
  }, [])

  // Get navigable nodes (content nodes + info node, excluding paste node)
  const navigableNodes = useMemo(
    () => nodes.filter(
      (node) => node.type === "contentNode" || node.type === "infoNode"
    ),
    [nodes]
  )

  // Navigation functions
  const handleNavigateUp = useCallback(() => {
    if (navigableNodes.length === 0) return

    const currentIndex = navigableNodes.findIndex(
      (node) => node.id === activeNodeId
    )
    let prevIndex

    if (currentIndex === -1) {
      const firstContentIndex = navigableNodes.findIndex(
        (node) => node.type === "contentNode"
      )
      prevIndex = firstContentIndex !== -1 ? firstContentIndex : 0
    } else {
      prevIndex =
        currentIndex > 0 ? currentIndex - 1 : navigableNodes.length - 1
    }

    const targetNode = navigableNodes[prevIndex]
    if (targetNode) {
      setActiveNodeId(targetNode.id)

      fitView({
        duration: FIT_VIEW_DURATION,
        nodes: [targetNode],
      })
    }
  }, [navigableNodes, activeNodeId, setActiveNodeId, fitView])

  const handleNavigateDown = useCallback(() => {
    if (navigableNodes.length === 0) return

    const currentIndex = navigableNodes.findIndex(
      (node) => node.id === activeNodeId
    )
    let nextIndex

    if (currentIndex === -1) {
      const firstContentIndex = navigableNodes.findIndex(
        (node) => node.type === "contentNode"
      )
      nextIndex = firstContentIndex !== -1 ? firstContentIndex : 0
    } else {
      nextIndex =
        currentIndex < navigableNodes.length - 1 ? currentIndex + 1 : 0
    }

    const targetNode = navigableNodes[nextIndex]
    if (targetNode) {
      setActiveNodeId(targetNode.id)

      fitView({
        duration: FIT_VIEW_DURATION,
        nodes: [targetNode],
      })
    }
  }, [navigableNodes, activeNodeId, setActiveNodeId, fitView])

  const handleFocusActive = useCallback(() => {
    const activeNode = navigableNodes.find((node) => node.id === activeNodeId)
    if (activeNode) {
      fitView({
        duration: FIT_VIEW_DURATION,
        nodes: [activeNode],
      })
    }
  }, [navigableNodes, activeNodeId, fitView])

  // Handle clipboard data processing
  const processClipboardData = useCallback(
    (clipboardData: Map<string, string[]>, source: string) => {
      setDataMap(clipboardData)
      setLastPastedType(source)
    },
    [setDataMap, setLastPastedType]
  )

  // Handle file drops
  const handleFileDrop = useCallback(
    async (files: FileList) => {
      const clipboardData = await parseFiles(files)
      processClipboardData(clipboardData, "Drag & Drop")
    },
    [processClipboardData]
  )

  // Global drag and drop handlers
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(true)
    },
    [setIsDragOver]
  )

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(true)
    },
    [setIsDragOver]
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (
        !e.relatedTarget ||
        !e.currentTarget.contains(e.relatedTarget as Element)
      ) {
        setIsDragOver(false)
      }
    },
    [setIsDragOver]
  )

  // Add mouse leave detection for when drag goes outside browser
  useEffect(() => {
    const handleMouseLeave = () => {
      setIsDragOver(false)
    }

    const handleDragLeaveDocument = (e: DragEvent) => {
      if (
        e.target === document.documentElement &&
        (e.clientX === 0 || e.clientY === 0)
      ) {
        setIsDragOver(false)
      }
    }

    document.addEventListener("dragleave", handleDragLeaveDocument)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("dragleave", handleDragLeaveDocument)
    }
  }, [setIsDragOver])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      if (e.dataTransfer.files.length > 0) {
        handleFileDrop(e.dataTransfer.files)
      }
    },
    [handleFileDrop, setIsDragOver]
  )

  // Global paste event handler
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return
      }

      event.preventDefault()
      if (!event.clipboardData) return

      const clipboardData = parsePasteItems(
        event.clipboardData.items,
        event.clipboardData
      )

      if (clipboardData.size > 0) {
        processClipboardData(clipboardData, "Global Paste")
      }
    }

    window.addEventListener("paste", onPaste)
    return () => window.removeEventListener("paste", onPaste)
  }, [processClipboardData])

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString("en-US")

    const newNodes: Node[] = []
    let currentNodeId = 2

    const pasteNode = nodes.find((node) => node.type === "pasteNode")
    const existingInfoNode = nodes.find(
      (node) => node.type === "infoNode"
    )
    const initialNodes = []
    if (pasteNode) initialNodes.push(pasteNode)
    if (existingInfoNode) initialNodes.push(existingInfoNode)

    if (!existingInfoNode) {
      const infoNode: Node = {
        id: `info-${Date.now()}`,
        type: "infoNode",
        position: { x: 500, y: 250 },
        data: {},
      }
      newNodes.push(infoNode)
      currentNodeId++
    }

    let nodeIndex = 1
    Array.from(dataMap.entries()).forEach(([type, values]) => {
      values.forEach((content) => {
        const yOffset = nodeIndex * NODE_VERTICAL_SPACING

        const newNode: Node = {
          id: `${currentNodeId}`,
          type: "contentNode",
          position: { x: 500, y: 250 + yOffset },
          data: {
            type,
            content,
            timestamp,
          },
        }

        newNodes.push(newNode)
        currentNodeId++
        nodeIndex++
      })
    })

    setNodes([...initialNodes, ...newNodes])

    const firstContentNode = newNodes.find(
      (node) => node.type === "contentNode"
    )
    if (firstContentNode) {
      setActiveNodeId(firstContentNode.id)
    } else {
      setActiveNodeId(null)
    }

    const timeoutId = setTimeout(() => {
      fitView({ duration: FIT_VIEW_DURATION })
    }, FIT_VIEW_DELAY)

    return () => clearTimeout(timeoutId)
  }, [dataMap, setNodes, setActiveNodeId, fitView])

  useEffect(() => {
    if (nodes.length === 0) {
      setNodes([
        {
          id: "1",
          type: "pasteNode",
          position: { x: 50, y: 250 },
          data: {},
        },
        {
          id: "info-initial",
          type: "infoNode",
          position: { x: 500, y: 250 },
          data: {},
        },
      ])
    }
  }, [])

  const nodeTypes = useMemo(
    () => ({
      pasteNode: PasteNode,
      contentNode: ContentNode,
      infoNode: InfoNode,
    }),
    []
  )

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AppHeader
        onNavigateUp={handleNavigateUp}
        onNavigateDown={handleNavigateDown}
        onFocusActive={handleFocusActive}
        canNavigateUp={navigableNodes.length > 1}
        canNavigateDown={navigableNodes.length > 1}
      />
      <div style={{ paddingTop: "64px", height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  )
}

export default App
