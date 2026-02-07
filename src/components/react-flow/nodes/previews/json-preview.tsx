interface JsonPreviewProps {
  content: string
}

const JsonPreview = ({ content }: JsonPreviewProps) => {
  let formattedJson = content
  try {
    const parsed = JSON.parse(content)
    formattedJson = JSON.stringify(parsed, null, 2)
  } catch {
    // Keep original if parsing fails
  }

  return (
    <div className="h-full overflow-y-auto rounded bg-gray-900 p-3 font-mono text-xs text-green-400">
      <pre className="whitespace-pre-wrap">{formattedJson}</pre>
    </div>
  )
}

export default JsonPreview
