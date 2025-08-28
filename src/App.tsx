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

import AppHeader from "./components/app-header"
import AdsterraNode from "./components/react-flow/nodes/adsterra-node"
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

  // Get navigable nodes (content nodes + adsterra node, excluding paste node)
  const navigableNodes = nodes.filter(
    (node) => node.type === "contentNode" || node.type === "adaptiveInfoNode"
  )
  // Keep contentNodes for backward compatibility with existing logic
  // const contentNodes = nodes.filter((node) => node.type === "contentNode")

  // Navigation functions
  const handleNavigateUp = useCallback(() => {
    if (navigableNodes.length === 0) return

    const currentIndex = navigableNodes.findIndex(
      (node) => node.id === activeNodeId
    )
    let prevIndex

    if (currentIndex === -1) {
      // If no active node found, start from the first content node (not adsterra)
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
        duration: 500,
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
      // If no active node found, start from the first content node (not adsterra)
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
        duration: 500,
        nodes: [targetNode],
      })
    }
  }, [navigableNodes, activeNodeId, setActiveNodeId, fitView])

  const handleFocusActive = useCallback(() => {
    const activeNode = navigableNodes.find((node) => node.id === activeNodeId)
    if (activeNode) {
      fitView({
        duration: 500,
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
      const clipboardData = new Map<string, string[]>()

      for (const file of Array.from(files)) {
        const type = file.type || "application/octet-stream"

        if (!clipboardData.has(type)) {
          clipboardData.set(type, [])
        }

        if (
          file.type.startsWith("image/") ||
          file.type.startsWith("video/") ||
          file.type.startsWith("audio/") ||
          file.type === "application/pdf"
        ) {
          // Use URL.createObjectURL for media files and PDF
          const objectUrl = URL.createObjectURL(file)
          clipboardData.get(type)!.push(objectUrl)
        } else {
          // Read as text
          const text = await file.text()
          clipboardData.get(type)!.push(text)
        }
      }

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

      // Use relatedTarget to check if we're leaving to outside the browser
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

    document.addEventListener("dragleave", (e) => {
      // If dragleave happens on document and clientX/Y are 0, it's likely outside browser
      if (
        e.target === document.documentElement &&
        (e.clientX === 0 || e.clientY === 0)
      ) {
        setIsDragOver(false)
      }
    })

    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("dragleave", handleMouseLeave)
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
      // Don't interfere if user is pasting in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      event.preventDefault()
      if (!event.clipboardData) return

      const clipboardData = new Map<string, string[]>()

      for (const item of event.clipboardData.items) {
        if (!clipboardData.has(item.type)) {
          clipboardData.set(item.type, [])
        }

        if (item.kind === "file") {
          // Handle files (images, videos, audio, PDF)
          const file = item.getAsFile()
          if (file) {
            if (
              item.type.startsWith("image/") ||
              item.type.startsWith("video/") ||
              item.type.startsWith("audio/") ||
              item.type === "application/pdf"
            ) {
              const objectUrl = URL.createObjectURL(file)
              clipboardData.get(item.type)!.push(objectUrl)
            } else {
              // For other file types, show file info
              clipboardData
                .get(item.type)!
                .push(`File: ${file.name || "clipboard"} (${file.size} bytes)`)
            }
          }
        } else {
          // Handle text data
          const data = event.clipboardData.getData(item.type)
          if (data) {
            clipboardData.get(item.type)!.push(data)
          }
        }
      }

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
    let currentNodeId = 2 // Reset to initial node ID

    // Keep paste node and info node, clear all content nodes
    const pasteNode = nodes.find((node) => node.type === "pasteNode")
    const existingAdaptiveNode = nodes.find(
      (node) => node.type === "adaptiveInfoNode"
    )
    const initialNodes = []
    if (pasteNode) initialNodes.push(pasteNode)
    if (existingAdaptiveNode) initialNodes.push(existingAdaptiveNode)

    // Add adaptive node if it doesn't exist
    if (!existingAdaptiveNode) {
      const adaptiveNode: Node = {
        id: `adaptive-${Date.now()}`,
        type: "adaptiveInfoNode",
        position: { x: 500, y: 250 }, // Same y as paste-node (250) for first position
        data: {},
      }
      newNodes.push(adaptiveNode)
      currentNodeId++
    }

    // Create a separate node for each content item
    let nodeIndex = 1 // Start from index 1 since adaptive node always exists
    Array.from(dataMap.entries()).forEach(([type, values]) => {
      values.forEach((content) => {
        const yOffset = nodeIndex * 420 // Increased spacing for taller nodes

        const newNode: Node = {
          id: `${currentNodeId}`,
          type: "contentNode",
          position: { x: 500, y: 250 + yOffset }, // Position after adaptive node
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

    // Replace all nodes with paste node + adaptive node + content nodes
    setNodes([...initialNodes, ...newNodes])

    // Set first content node as active
    // Find the first content node (skip adaptive node)
    const firstContentNode = newNodes.find(
      (node) => node.type === "contentNode"
    )
    if (firstContentNode) {
      setActiveNodeId(firstContentNode.id)
    } else {
      // If no content nodes, clear active node
      setActiveNodeId(null)
    }

    setTimeout(() => {
      fitView({ duration: 500 })
    }, 50)
  }, [dataMap])

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
          id: "adaptive-initial",
          type: "adaptiveInfoNode",
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
      adaptiveInfoNode: AdsterraNode,
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
