import { useRef, useState } from "react"

import {
  ClipboardPasteIcon,
  MousePointerClickIcon,
  SparklesIcon,
  CommandIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { parseClipboardApi, parsePasteItems } from "@/lib/clipboard-parser"
import { useClipboardDataMapStore } from "@/store/clipboard-data-map-store"

const PasteNode = () => {
  const { setDataMap, isDragOver, lastPastedType, setLastPastedType } =
    useClipboardDataMapStore()
  const [isApiLoading, setIsApiLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const onClickClipboardApiButton = async () => {
    try {
      setIsApiLoading(true)
      const clipboardContents = await navigator.clipboard.read()
      const clipboardData = await parseClipboardApi(clipboardContents)
      setDataMap(clipboardData)
      setLastPastedType("Clipboard API")
    } catch (err) {
      console.error("Failed to read clipboard:", err)
    } finally {
      setIsApiLoading(false)
    }
  }

  const onPaste = (event: React.ClipboardEvent) => {
    event.preventDefault()
    const clipboardData = parsePasteItems(
      event.clipboardData.items,
      event.clipboardData
    )

    if (clipboardData.size > 0) {
      setDataMap(clipboardData)
      setLastPastedType("Direct Paste")
    }
  }

  const onInput = () => {
    if (!inputRef.current) return

    inputRef.current.value = ""
  }

  return (
    <>
      <Card
        className={`w-96 bg-gradient-to-br shadow-xl transition-all duration-300 ${
          isDragOver
            ? "scale-105 border-4 border-dashed border-blue-400 from-blue-100 to-blue-50 shadow-2xl"
            : "border-2 border-slate-200 from-slate-50 to-white"
        }`}
      >
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-center">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg">
              <ClipboardPasteIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center text-2xl font-bold text-transparent">
            Clipboard Viewer
          </CardTitle>
          <div className="flex items-center justify-center gap-1 text-xs font-normal text-slate-500">
            <SparklesIcon className="h-3 w-3" />
            <span>Visualize Your Clipboard Data</span>
            <SparklesIcon className="h-3 w-3" />
          </div>
          <div className="space-y-3 text-center">
            <p className="text-sm font-medium text-slate-600">
              Choose your paste method:
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <CommandIcon className="h-3 w-3" />
                <span>Cmd+V</span>
              </div>
              <span className="text-slate-400">or</span>
              <div className="flex items-center gap-1">
                <span>Ctrl+V</span>
              </div>
            </div>
            <div
              className={`space-y-1 rounded-lg border p-3 transition-all duration-300 ${
                isDragOver
                  ? "border-blue-300 bg-blue-100"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              {isDragOver ? (
                <>
                  <div className="animate-pulse text-sm font-medium text-blue-800">
                    📂 Drop your files here!
                  </div>
                  <div className="text-xs text-blue-700">
                    Release to analyze clipboard content
                  </div>
                </>
              ) : (
                <div className="text-xs text-blue-600">
                  Drop files here or paste below
                </div>
              )}
            </div>
            <div className="mt-3 space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-2">
              <div className="text-xs text-amber-600">
                🔒 All data is stored securely in your browser only
              </div>
              <div className="text-xs text-amber-600">
                ⚠️ Clipboard API may have limited data access due to browser
                security policies
              </div>
              <div className="text-xs text-amber-600">
                💡 Try pasting with other methods for different results
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <Button
            onClick={onClickClipboardApiButton}
            className="h-12 w-full bg-gradient-to-r from-blue-500 to-blue-600 font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
            disabled={isApiLoading}
          >
            {isApiLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Reading clipboard...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ClipboardPasteIcon className="h-4 w-4" />
                Use Clipboard API
              </span>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 font-medium text-slate-500">
                OR
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MousePointerClickIcon className="h-3.5 w-3.5" />
              <span>Right-click and paste below:</span>
            </div>
            <Input
              ref={inputRef}
              placeholder="Right Click → Paste"
              onPaste={onPaste}
              onInput={onInput}
              inputMode="none"
              className="h-12 border-2 border-slate-200 transition-colors placeholder:text-slate-400 focus:border-blue-400"
            />
          </div>

          {lastPastedType && (
            <div className="border-t border-slate-100 pt-2">
              <p className="text-center text-xs text-slate-500">
                Last action:{" "}
                <span className="font-medium text-blue-600">
                  {lastPastedType}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
export default PasteNode
