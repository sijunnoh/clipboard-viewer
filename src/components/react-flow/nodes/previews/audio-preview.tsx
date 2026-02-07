import { AudioWaveformIcon } from "lucide-react"

import { isPlayableSource } from "@/lib/content-type"

import MediaFallback from "./media-fallback"

interface AudioPreviewProps {
  content: string
  mimeType: string
  variant?: "compact" | "detailed"
}

const AudioPreview = ({
  content,
  mimeType,
  variant = "compact",
}: AudioPreviewProps) => {
  if (!isPlayableSource(content)) {
    return (
      <MediaFallback
        icon={<AudioWaveformIcon className="h-full w-full" />}
        label="Audio File"
        mimeType={mimeType}
        size={content.length}
        variant={variant}
      />
    )
  }

  if (variant === "detailed") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-full max-w-2xl rounded border bg-gray-50 p-8 text-center">
          <audio src={content} controls preload="metadata" className="w-full">
            Your browser does not support the audio tag.
          </audio>
          <p className="mt-4 text-sm text-gray-600">Audio File - {mimeType}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col justify-center rounded border bg-gray-50 p-4">
      <audio src={content} controls preload="metadata" className="w-full">
        Your browser does not support the audio tag.
      </audio>
      <p className="mt-2 text-center text-sm text-gray-600">
        Audio File - {mimeType}
      </p>
    </div>
  )
}

export default AudioPreview
