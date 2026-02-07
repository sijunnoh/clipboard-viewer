import { FileIcon } from "lucide-react"

import { isPlayableSource } from "@/lib/content-type"

import MediaFallback from "./media-fallback"

interface PdfPreviewProps {
  content: string
  mimeType: string
  variant?: "compact" | "detailed"
}

const PdfPreview = ({
  content,
  mimeType,
  variant = "compact",
}: PdfPreviewProps) => {
  if (!isPlayableSource(content)) {
    return (
      <MediaFallback
        icon={<FileIcon className="h-full w-full" />}
        label="PDF Document"
        mimeType={mimeType}
        size={content.length}
        variant={variant}
      />
    )
  }

  if (variant === "detailed") {
    return (
      <div className="h-full w-full">
        <embed
          src={content}
          type="application/pdf"
          className="h-full w-full rounded border"
          style={{ minHeight: "80vh" }}
        />
      </div>
    )
  }

  return (
    <div className="h-full rounded border bg-white">
      <embed
        src={content}
        type="application/pdf"
        className="h-full w-full rounded"
      />
    </div>
  )
}

export default PdfPreview
