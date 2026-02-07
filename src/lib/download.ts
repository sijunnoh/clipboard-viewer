import { getPrimaryType, getFileExtension, isPlayableSource } from "./content-type"

export function downloadContent(content: string, mimeType: string) {
  const type = getPrimaryType(mimeType)
  const fileName = `clipboard-${type}-${Date.now()}.${getFileExtension(mimeType)}`

  if (
    (type === "image" || type === "video" || type === "audio" || type === "pdf") &&
    isPlayableSource(content)
  ) {
    const a = document.createElement("a")
    a.href = content
    a.download = fileName
    if (content.startsWith("http")) {
      a.target = "_blank"
    }
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    return
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
