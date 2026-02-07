import { create } from 'zustand'

function revokeObjectUrls(dataMap: Map<string, string[]>) {
  for (const values of dataMap.values()) {
    for (const value of values) {
      if (value.startsWith("blob:")) {
        URL.revokeObjectURL(value)
      }
    }
  }
}

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

export const useClipboardDataMapStore = create<ClipboardDataMapStore>((set, get) => ({
  dataMap: new Map(),
  isDragOver: false,
  lastPastedType: "",
  activeNodeId: null,
  setDataMap: (dataMap) => {
    revokeObjectUrls(get().dataMap)
    set({ dataMap })
  },
  setIsDragOver: (isDragOver) => set({ isDragOver }),
  setLastPastedType: (lastPastedType) => set({ lastPastedType }),
  setActiveNodeId: (activeNodeId) => set({ activeNodeId }),
}))