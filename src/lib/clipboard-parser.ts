/**
 * Check if a MIME type is a media type that should be handled as binary (blob URL).
 */
export function isMediaType(type: string): boolean {
  return (
    type.startsWith("image/") ||
    type.startsWith("video/") ||
    type.startsWith("audio/") ||
    type === "application/pdf"
  )
}

function addToMap(map: Map<string, string[]>, key: string, value: string) {
  const existing = map.get(key)
  if (existing) {
    existing.push(value)
  } else {
    map.set(key, [value])
  }
}

/**
 * Parse a FileList (from drag & drop) into a clipboard data map.
 */
export async function parseFiles(
  files: FileList
): Promise<Map<string, string[]>> {
  const clipboardData = new Map<string, string[]>()

  for (const file of Array.from(files)) {
    const type = file.type || "application/octet-stream"

    if (isMediaType(file.type)) {
      const objectUrl = URL.createObjectURL(file)
      addToMap(clipboardData, type, objectUrl)
    } else {
      const text = await file.text()
      addToMap(clipboardData, type, text)
    }
  }

  return clipboardData
}

/**
 * Parse DataTransferItemList (from paste events) into a clipboard data map.
 */
export function parsePasteItems(
  items: DataTransferItemList,
  dataTransfer: DataTransfer
): Map<string, string[]> {
  const clipboardData = new Map<string, string[]>()

  for (const item of items) {
    if (item.kind === "file") {
      const file = item.getAsFile()
      if (file) {
        if (isMediaType(item.type)) {
          const objectUrl = URL.createObjectURL(file)
          addToMap(clipboardData, item.type, objectUrl)
        } else {
          addToMap(
            clipboardData,
            item.type,
            `File: ${file.name || "clipboard"} (${file.size} bytes)`
          )
        }
      }
    } else {
      const data = dataTransfer.getData(item.type)
      if (data) {
        addToMap(clipboardData, item.type, data)
      }
    }
  }

  return clipboardData
}

/**
 * Parse clipboard contents from the Clipboard API (navigator.clipboard.read()).
 */
export async function parseClipboardApi(
  clipboardContents: ClipboardItems
): Promise<Map<string, string[]>> {
  const clipboardData = new Map<string, string[]>()

  for (const item of clipboardContents) {
    for (const type of item.types) {
      const blob = await item.getType(type)

      if (isMediaType(type)) {
        const objectUrl = URL.createObjectURL(blob)
        addToMap(clipboardData, type, objectUrl)
      } else {
        const text = await blob.text()
        addToMap(clipboardData, type, text)
      }
    }
  }

  return clipboardData
}
