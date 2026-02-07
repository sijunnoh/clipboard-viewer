import { VideoIcon } from "lucide-react"

import { isPlayableSource } from "@/lib/content-type"

import MediaFallback from "./media-fallback"

interface VideoPreviewProps {
  content: string
  mimeType: string
  variant?: "compact" | "detailed"
}

const VideoPreview = ({
  content,
  mimeType,
  variant = "compact",
}: VideoPreviewProps) => {
  if (!isPlayableSource(content)) {
    return (
      <MediaFallback
        icon={<VideoIcon className="h-full w-full" />}
        label="Video File"
        mimeType={mimeType}
        size={content.length}
        variant={variant}
      />
    )
  }

  const className =
    variant === "detailed"
      ? "max-h-full max-w-full rounded"
      : "max-h-60 w-full rounded"

  if (variant === "detailed") {
    return (
      <div className="flex h-full items-center justify-center">
        <video src={content} controls preload="metadata" className={className}>
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }

  return (
    <video src={content} controls preload="metadata" className={className}>
      Your browser does not support the video tag.
    </video>
  )
}

export default VideoPreview
