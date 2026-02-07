import { useState, useCallback } from "react"

import { COPY_FEEDBACK_DURATION } from "@/lib/constants"

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [])

  return { copied, copy }
}
