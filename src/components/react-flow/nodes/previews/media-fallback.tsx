import type { ReactNode } from "react"

interface MediaFallbackProps {
  icon: ReactNode
  label: string
  mimeType: string
  size: number
  variant?: "compact" | "detailed"
}

const MediaFallback = ({
  icon,
  label,
  mimeType,
  size,
  variant = "compact",
}: MediaFallbackProps) => {
  const iconSize = variant === "detailed" ? "mb-4 h-16 w-16" : "mb-2 h-12 w-12"
  const labelSize = variant === "detailed" ? "text-lg" : "text-sm"
  const padding = variant === "detailed" ? "p-8" : "p-4"

  return (
    <div
      className={`flex h-full flex-col items-center justify-center rounded border bg-gray-50 ${padding}`}
    >
      <div className={`${iconSize} text-gray-400`}>{icon}</div>
      <p className={`text-center ${labelSize} text-gray-600`}>{label}</p>
      {variant === "detailed" && (
        <p className="mt-2 text-center text-sm text-gray-500">
          Cannot preview this format
        </p>
      )}
      <p className="mt-1 text-center text-xs text-gray-500">{mimeType}</p>
      <p className="mt-2 text-center text-xs text-gray-400">
        {size} characters
      </p>
    </div>
  )
}

export default MediaFallback
