interface CodePreviewProps {
  content: string
  variant?: "compact" | "detailed"
}

const CodePreview = ({ content, variant = "compact" }: CodePreviewProps) => {
  const padding = variant === "detailed" ? "p-4" : "p-3"
  const textSize = variant === "detailed" ? "text-sm" : "text-xs"

  return (
    <div
      className={`h-full overflow-y-auto rounded bg-gray-900 ${padding} font-mono ${textSize} text-green-400`}
    >
      <pre className="whitespace-pre-wrap text-left">{content}</pre>
    </div>
  )
}

export default CodePreview
