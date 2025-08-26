import { create } from 'zustand'

interface ClipboardDataMapStore {
  dataMap: Map<string, string[]>
  isDragOver: boolean
  lastPastedType: string
  activeNodeId: string | null
  setDataMap: (dataMap: Map<string, string[]>) => void
  setIsDragOver: (isDragOver: boolean) => void
  setLastPastedType: (type: string) => void
  setActiveNodeId: (nodeId: string | null) => void
}

export const useClipboardDataMapStore = create<ClipboardDataMapStore>((set) => ({
  dataMap: new Map(),
  isDragOver: false,
  lastPastedType: "",
  activeNodeId: null,
  setDataMap: (dataMap) => set({ dataMap }),
  setIsDragOver: (isDragOver) => set({ isDragOver }),
  setLastPastedType: (lastPastedType) => set({ lastPastedType }),
  setActiveNodeId: (activeNodeId) => set({ activeNodeId }),
}))