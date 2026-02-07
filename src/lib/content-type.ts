import { MIME_EXTENSIONS } from "./constants"

export type PrimaryType =
  | "html"
  | "image"
  | "video"
  | "audio"
  | "json"
  | "pdf"
  | "xml"
  | "text"
  | "unknown"

export function getPrimaryType(mimeType: string): PrimaryType {
  if (mimeType === "text/html") return "html"
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType.startsWith("audio/")) return "audio"
  if (mimeType === "application/json") return "json"
  if (mimeType === "application/pdf") return "pdf"
  if (
    mimeType === "application/xml" ||
    mimeType === "text/xml" ||
    mimeType === "application/xhtml+xml"
  )
    return "xml"
  if (mimeType === "text/plain") return "text"
  return "unknown"
}

export function isPlayableSource(content: string): boolean {
  return (
    content.startsWith("data:") ||
    content.startsWith("blob:") ||
    content.startsWith("http")
  )
}

export function getFileExtension(mimeType: string): string {
  if (MIME_EXTENSIONS[mimeType]) {
    return MIME_EXTENSIONS[mimeType]
  }

  const parts = mimeType.split("/")
  if (parts.length === 2) {
    const [category, subtype] = parts

    if (category === "video") {
      return subtype.replace(/^x-/, "")
    }
    if (category === "audio") {
      return subtype.replace(/^x-/, "").replace(/^mpeg$/, "mp3")
    }
    if (category === "image") {
      return subtype.replace(/^x-/, "").replace(/jpeg/, "jpg")
    }
  }

  return "txt"
}
