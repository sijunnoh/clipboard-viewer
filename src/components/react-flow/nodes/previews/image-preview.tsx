import { ImageIcon } from "lucide-react"

import { isPlayableSource } from "@/lib/content-type"

import MediaFallback from "./media-fallback"

interface ImagePreviewProps {
  content: string
  mimeType: string
  variant?: "compact" | "detailed"
}

const ImagePreview = ({
  content,
  mimeType,
  variant = "compact",
}: ImagePreviewProps) => {
  if (!isPlayableSource(content)) {
    return (
      <MediaFallback
        icon={<ImageIcon className="h-full w-full" />}
        label="Image File"
        mimeType={mimeType}
        size={content.length}
        variant={variant}
      />
    )
  }

  if (variant === "detailed") {
    return (
      <div className="flex h-full items-center justify-center">
        <img
          src={content}
          alt={`Clipboard image (${mimeType})`}
          className="max-h-full max-w-full rounded object-contain"
        />
      </div>
    )
  }

  return (
    <img
      src={content}
      alt={`Clipboard image (${mimeType})`}
      className="max-h-60 w-full rounded object-contain"
    />
  )
}

export default ImagePreview
