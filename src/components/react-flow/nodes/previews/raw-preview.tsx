import { RAW_PREVIEW_MAX_LENGTH } from "@/lib/constants"

interface RawPreviewProps {
  content: string
}

const RawPreview = ({ content }: RawPreviewProps) => {
  return (
    <div className="h-full overflow-y-auto rounded border bg-gray-100 p-3">
      <pre className="text-xs break-words whitespace-pre-wrap text-gray-700">
        {content.slice(0, RAW_PREVIEW_MAX_LENGTH)}
        {content.length > RAW_PREVIEW_MAX_LENGTH &&
          `\n\n... +${content.length - RAW_PREVIEW_MAX_LENGTH} more characters`}
      </pre>
    </div>
  )
}

export default RawPreview
