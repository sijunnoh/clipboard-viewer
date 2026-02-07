import { memo, useState } from "react"

import {
  FileTextIcon,
  ImageIcon,
  CodeIcon,
  FileJsonIcon,
  Maximize2Icon,
  CopyIcon,
  ClockIcon,
  VideoIcon,
  AudioWaveformIcon,
  FileIcon,
  BracketsIcon,
  DownloadIcon,
  CheckIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { getPrimaryType } from "@/lib/content-type"
import { downloadContent } from "@/lib/download"
import { useClipboardDataMapStore } from "@/store/clipboard-data-map-store"

import AudioPreview from "./previews/audio-preview"
import CodePreview from "./previews/code-preview"
import HtmlPreview from "./previews/html-preview"
import ImagePreview from "./previews/image-preview"
import JsonPreview from "./previews/json-preview"
import PdfPreview from "./previews/pdf-preview"
import RawPreview from "./previews/raw-preview"
import TextPreview from "./previews/text-preview"
import VideoPreview from "./previews/video-preview"

import type { PrimaryType } from "@/lib/content-type"

interface ContentNodeProps {
  data: {
    type: string
    content: string
    timestamp: string
  }
  id: string
}

function getIcon(type: PrimaryType) {
  switch (type) {
    case "html":
      return <CodeIcon className="h-4 w-4" />
    case "image":
      return <ImageIcon className="h-4 w-4" />
    case "video":
      return <VideoIcon className="h-4 w-4" />
    case "audio":
      return <AudioWaveformIcon className="h-4 w-4" />
    case "json":
      return <FileJsonIcon className="h-4 w-4" />
    case "pdf":
      return <FileIcon className="h-4 w-4" />
    case "xml":
      return <BracketsIcon className="h-4 w-4" />
    default:
      return <FileTextIcon className="h-4 w-4" />
  }
}

interface PreviewProps {
  type: PrimaryType
  mimeType: string
  content: string
  variant?: "compact" | "detailed"
}

function Preview({ type, mimeType, content, variant = "compact" }: PreviewProps) {
  switch (type) {
    case "image":
      return <ImagePreview content={content} mimeType={mimeType} variant={variant} />
    case "video":
      return <VideoPreview content={content} mimeType={mimeType} variant={variant} />
    case "audio":
      return <AudioPreview content={content} mimeType={mimeType} variant={variant} />
    case "html":
      return <HtmlPreview content={content} variant={variant} />
    case "json":
      return <JsonPreview content={content} />
    case "pdf":
      return <PdfPreview content={content} mimeType={mimeType} variant={variant} />
    case "xml":
      return <CodePreview content={content} variant={variant} />
    case "text":
      return <TextPreview content={content} variant={variant} />
    default:
      if (mimeType.startsWith("text/")) {
        return <TextPreview content={content} variant={variant} />
      }
      return <RawPreview content={content} />
  }
}

const ContentNode = memo(({ data, id }: ContentNodeProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { copied, copy } = useCopyToClipboard()
  const { activeNodeId } = useClipboardDataMapStore()

  const isActive = activeNodeId === id
  const primaryType = getPrimaryType(data.type)
  const icon = getIcon(primaryType)

  const handleDownload = () => {
    downloadContent(data.content, data.type)
  }

  return (
    <>
      <Card
        className={`nowheel h-96 w-80 border-2 bg-white transition-all duration-300 ${
          isActive
            ? "border-blue-500 shadow-lg shadow-blue-200/50"
            : "border-gray-200 hover:border-blue-300"
        }`}
      >
        <CardHeader className="p-3 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2 text-blue-600">
              {icon}
              <span className="truncate text-xs font-medium">{data.type}</span>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className={`h-6 w-6 p-0 transition-colors ${
                  copied ? "bg-green-100 text-green-600" : ""
                }`}
                onClick={() => copy(data.content)}
                aria-label={copied ? "Copied" : "Copy to clipboard"}
                title={copied ? "Copied!" : "Copy to clipboard"}
              >
                {copied ? (
                  <CheckIcon className="h-3 w-3" />
                ) : (
                  <CopyIcon className="h-3 w-3" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={handleDownload}
                aria-label="Download file"
                title="Download file"
              >
                <DownloadIcon className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => setIsOpen(true)}
                aria-label="View details"
                title="View details"
              >
                <Maximize2Icon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 p-3 pt-0">
          <div className="h-72 overflow-y-auto">
            <Preview
              type={primaryType}
              mimeType={data.type}
              content={data.content}
            />
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <ClockIcon className="h-3 w-3" />
              <span>{data.timestamp}</span>
            </div>
            <span className="text-xs text-gray-500">
              {data.content.length} chars
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!top-[2.5%] flex h-full max-h-[95vh] w-full max-w-[95vw] !translate-y-0 flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              {icon}
              <span>Clipboard Content Details</span>
            </DialogTitle>
            <DialogDescription>
              Detailed view of clipboard content with type: {data.type}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full flex-col">
              <div className="mb-4 flex flex-shrink-0 items-center justify-between">
                <h3 className="text-sm font-semibold text-blue-600">
                  {data.type}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-xs"
                  onClick={handleDownload}
                  aria-label="Download file"
                  title="Download file"
                >
                  <DownloadIcon className="mr-1.5 h-3 w-3" />
                  Download
                </Button>
              </div>
              <div className="min-h-0 flex-1">
                <Preview
                  type={primaryType}
                  mimeType={data.type}
                  content={data.content}
                  variant="detailed"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
})

ContentNode.displayName = "ContentNode"

export default ContentNode
