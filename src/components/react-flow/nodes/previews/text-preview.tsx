interface TextPreviewProps {
  content: string
  variant?: "compact" | "detailed"
}

const TextPreview = ({ content, variant = "compact" }: TextPreviewProps) => {
  const padding = variant === "detailed" ? "p-4" : "p-3"
  const textSize = variant === "detailed" ? "text-sm" : "text-xs"

  return (
    <div
      className={`h-full overflow-y-auto rounded border bg-gray-50 ${padding} text-left`}
    >
      <pre
        className={`${textSize} break-words whitespace-pre-wrap text-gray-800 text-left`}
      >
        {content}
      </pre>
    </div>
  )
}

export default TextPreview
