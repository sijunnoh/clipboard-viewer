import { isMediaType } from "./clipboard-parser"

interface ClipboardExportEntry {
  mimeType: string
  contents: string[]
}

interface ClipboardExportData {
  version: 1
  exportedAt: string
  entries: ClipboardExportEntry[]
}

export interface ExportSummary {
  textTypes: string[]
  skippedTypes: string[]
}

/**
 * Summarize what will be exported vs skipped.
 */
export function getExportSummary(
  dataMap: Map<string, string[]>
): ExportSummary {
  const textTypes: string[] = []
  const skippedTypes: string[] = []

  for (const mimeType of dataMap.keys()) {
    if (isMediaType(mimeType)) {
      skippedTypes.push(mimeType)
    } else {
      textTypes.push(mimeType)
    }
  }

  return { textTypes, skippedTypes }
}

/**
 * Export dataMap to a JSON string.
 * Media types (image, video, audio, pdf) are excluded.
 */
export function exportDataMapToJson(dataMap: Map<string, string[]>): string {
  const entries: ClipboardExportEntry[] = []

  for (const [mimeType, contents] of dataMap.entries()) {
    if (isMediaType(mimeType)) continue
    entries.push({ mimeType, contents })
  }

  const exportData: ClipboardExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    entries,
  }

  return JSON.stringify(exportData, null, 2)
}

/**
 * Download a JSON string as a file.
 */
export function downloadExportedJson(jsonString: string) {
  const blob = new Blob([jsonString], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `clipboard-export-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Import a JSON string and convert it back to a dataMap.
 */
export function importJsonToDataMap(jsonString: string): Map<string, string[]> {
  const data: ClipboardExportData = JSON.parse(jsonString)

  if (data.version !== 1) {
    throw new Error(`Unsupported export version: ${data.version}`)
  }

  const dataMap = new Map<string, string[]>()

  for (const entry of data.entries) {
    dataMap.set(entry.mimeType, entry.contents)
  }

  return dataMap
}
