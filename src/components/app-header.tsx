import { useState } from "react"

import {
  HelpCircleIcon,
  RotateCcwIcon,
  ClipboardPasteIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  TargetIcon,
  MailIcon,
  BugIcon,
  LightbulbIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react"

import { useClipboardDataMapStore } from "@/store/clipboard-data-map-store"

import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { ScrollArea } from "./ui/scroll-area"

interface AppHeaderProps {
  onNavigateUp: () => void
  onNavigateDown: () => void
  onFocusActive: () => void
  canNavigateUp: boolean
  canNavigateDown: boolean
}

const AppHeader = ({
  onNavigateUp,
  onNavigateDown,
  onFocusActive,
  canNavigateUp,
  canNavigateDown,
}: AppHeaderProps) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { dataMap, setDataMap, setActiveNodeId } = useClipboardDataMapStore()

  const hasContent = dataMap.size > 0

  const handleReset = () => {
    setDataMap(new Map())
    setActiveNodeId(null)
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("sijun.noh@mech2cs.com")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy email:", err)
    }
  }

  return (
    <>
      <header
        className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
              <ClipboardPasteIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="hidden text-lg font-bold text-gray-800 sm:block">
                Clipboard Viewer
              </h1>
              <p className="hidden text-xs text-gray-500 sm:block">
                Visualize your clipboard data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasContent && (
              <>
                <div className="flex items-center rounded-md border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateUp}
                    disabled={!canNavigateUp}
                    className="h-8 w-8 rounded-r-none p-0"
                    title="Navigate to previous node"
                  >
                    <ChevronUpIcon className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onFocusActive}
                    className="h-8 w-8 rounded-none border-r border-l p-0"
                    title="Focus on active node"
                  >
                    <TargetIcon className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateDown}
                    disabled={!canNavigateDown}
                    className="h-8 w-8 rounded-l-none p-0"
                    title="Navigate to next node"
                  >
                    <ChevronDownIcon className="size-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 w-8 p-0"
                  title="Reset all content"
                >
                  <RotateCcwIcon className="size-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHelpOpen(true)}
              className="h-8 w-8 p-0"
              title="Help"
            >
              <HelpCircleIcon className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="flex h-[90vh] max-h-[90vh] max-w-2xl flex-col overflow-y-scroll p-0">
          <DialogHeader className="flex-shrink-0 border-b p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <ClipboardPasteIcon className="h-5 w-5" />
              Features & Usage
            </DialogTitle>
            <DialogDescription className="sr-only">
              Learn how to effectively use the Clipboard Viewer and its
              features.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea>
            <div className="px-6 pt-4 pb-6">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-blue-700">
                    🚀 How to Use
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-3">
                      <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                        Ctrl/Cmd+V
                      </span>
                      <span>Paste clipboard content anywhere on screen</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                        Drag & Drop
                      </span>
                      <span>Drop files directly onto the interface</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                        Click Button
                      </span>
                      <span>
                        Use "Use Clipboard API" button in the paste node
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-green-700">
                    ✨ Key Features
                  </h3>
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-500">📋</span>
                        <div>
                          <div className="font-medium">
                            Multi-format Support
                          </div>
                          <div className="text-gray-600">
                            Text, HTML, Images, JSON, and more
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500">🔍</span>
                        <div>
                          <div className="font-medium">Data Type Detection</div>
                          <div className="text-gray-600">
                            Automatic MIME type recognition
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-500">💻</span>
                        <div>
                          <div className="font-medium">Desktop Optimized</div>
                          <div className="text-gray-600">
                            Best experience on desktop browsers
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-orange-500">🔎</span>
                        <div>
                          <div className="font-medium">Zoom Preview</div>
                          <div className="text-gray-600">
                            Click zoom icon for detailed view
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-red-500">📄</span>
                        <div>
                          <div className="font-medium">HTML Rendering</div>
                          <div className="text-gray-600">
                            See both code and preview
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-teal-500">🎯</span>
                        <div>
                          <div className="font-medium">Drag Feedback</div>
                          <div className="text-gray-600">
                            Visual cues during file drops
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-amber-700">
                    💡 Tips
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div>
                      • Each data type creates a separate node for easy
                      comparison
                    </div>
                    <div>
                      • Copy content back to clipboard using the copy button
                    </div>
                    <div>• Use the reset button to clear all content nodes</div>
                    <div>• Global shortcuts work from anywhere in the app</div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-purple-700 flex items-center gap-2">
                    <MailIcon className="h-4 w-4" />
                    Feedback & Support
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BugIcon className="h-4 w-4 text-red-400" />
                        <span>Bug reports</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <LightbulbIcon className="h-4 w-4 text-yellow-400" />
                        <span>Feature suggestions</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border flex items-center justify-between gap-2">
                      <p className="text-sm text-gray-700 font-mono break-all flex-1">
                        sijun.noh@mech2cs.com
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`h-8 w-8 p-0 flex-shrink-0 transition-colors ${
                          copied ? "bg-green-100 text-green-600" : ""
                        }`}
                        onClick={handleCopyEmail}
                        title={copied ? "Copied!" : "Copy email address"}
                      >
                        {copied ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AppHeader
