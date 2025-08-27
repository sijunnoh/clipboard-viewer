import { useState } from "react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useClipboardDataMapStore } from "@/store/clipboard-data-map-store"

interface ContentNodeProps {
  data: {
    type: string
    content: string
    timestamp: string
  }
  id: string
}

const ContentNode = ({ data, id }: ContentNodeProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { activeNodeId } = useClipboardDataMapStore()

  const isActive = activeNodeId === id

  // Detect content type from MIME type
  const getPrimaryType = () => {
    if (data.type === "text/html") return "html"
    if (data.type.startsWith("image/")) return "image"
    if (data.type.startsWith("video/")) return "video"
    if (data.type.startsWith("audio/")) return "audio"
    if (data.type === "application/json") return "json"
    if (data.type === "application/pdf") return "pdf"
    if (
      data.type === "application/xml" ||
      data.type === "text/xml" ||
      data.type === "application/xhtml+xml"
    )
      return "xml"
    if (data.type === "text/plain") return "text"

    return "unknown"
  }

  const getIcon = () => {
    const type = getPrimaryType()
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

  const getPreview = () => {
    const type = getPrimaryType()

    if (type === "image") {
      // Support both data URLs and blob URLs
      if (
        data.content.startsWith("data:") ||
        data.content.startsWith("blob:") ||
        data.content.startsWith("http")
      ) {
        return (
          <img
            src={data.content}
            alt="Clipboard content"
            className="max-h-60 w-full rounded object-contain"
          />
        )
      } else {
        return (
          <div className="flex h-full flex-col items-center justify-center rounded border bg-gray-50 p-4">
            <ImageIcon className="mb-2 h-12 w-12 text-gray-400" />
            <p className="text-center text-sm text-gray-600">Image File</p>
            <p className="mt-1 text-center text-xs text-gray-500">
              {data.type}
            </p>
            <p className="mt-2 text-center text-xs text-gray-400">
              {data.content.length} characters
            </p>
          </div>
        )
      }
    }

    if (type === "video") {
      // Check if it's a valid video source
      if (
        data.content.startsWith("data:") ||
        data.content.startsWith("http") ||
        data.content.startsWith("blob:")
      ) {
        return (
          <video
            src={data.content}
            controls
            preload="metadata"
            className="max-h-60 w-full rounded"
          >
            Your browser does not support the video tag.
          </video>
        )
      } else {
        // Fallback for non-playable video content
        return (
          <div className="flex h-full flex-col items-center justify-center rounded border bg-gray-50 p-4">
            <VideoIcon className="mb-2 h-12 w-12 text-gray-400" />
            <p className="text-center text-sm text-gray-600">Video File</p>
            <p className="mt-1 text-center text-xs text-gray-500">
              {data.type}
            </p>
            <p className="mt-2 text-center text-xs text-gray-400">
              {data.content.length} characters
            </p>
          </div>
        )
      }
    }

    if (type === "audio") {
      // Check if it's a valid audio source
      if (
        data.content.startsWith("data:") ||
        data.content.startsWith("http") ||
        data.content.startsWith("blob:")
      ) {
        return (
          <div className="flex h-full flex-col justify-center rounded border bg-gray-50 p-4">
            <audio
              src={data.content}
              controls
              preload="metadata"
              className="w-full"
            >
              Your browser does not support the audio tag.
            </audio>
            <p className="mt-2 text-center text-sm text-gray-600">
              Audio File - {data.type}
            </p>
          </div>
        )
      } else {
        // Fallback for non-playable audio content
        return (
          <div className="flex h-full flex-col items-center justify-center rounded border bg-gray-50 p-4">
            <AudioWaveformIcon className="mb-2 h-12 w-12 text-gray-400" />
            <p className="text-center text-sm text-gray-600">Audio File</p>
            <p className="mt-1 text-center text-xs text-gray-500">
              {data.type}
            </p>
            <p className="mt-2 text-center text-xs text-gray-400">
              {data.content.length} characters
            </p>
          </div>
        )
      }
    }

    if (type === "html") {
      return (
        <div className="h-full w-fit overflow-y-auto rounded border bg-white p-3">
          <div
            dangerouslySetInnerHTML={{ __html: data.content }}
            className="prose prose-sm max-w-none [&>*]:!m-1"
          />
        </div>
      )
    }

    if (type === "json") {
      let formattedJson = data.content
      try {
        const parsed = JSON.parse(data.content)
        formattedJson = JSON.stringify(parsed, null, 2)
      } catch (e) {
        // Keep original if parsing fails
      }

      return (
        <div className="h-full overflow-y-auto rounded bg-gray-900 p-3 font-mono text-xs text-green-400">
          <pre className="whitespace-pre-wrap">{formattedJson}</pre>
        </div>
      )
    }

    if (type === "pdf") {
      // PDF preview using embed or object
      if (
        data.content.startsWith("blob:") ||
        data.content.startsWith("data:") ||
        data.content.startsWith("http")
      ) {
        return (
          <div className="h-full rounded border bg-white">
            <embed
              src={data.content}
              type="application/pdf"
              className="h-full w-full rounded"
            />
          </div>
        )
      } else {
        return (
          <div className="flex h-full flex-col items-center justify-center rounded border bg-gray-50 p-4">
            <FileIcon className="mb-2 h-12 w-12 text-gray-400" />
            <p className="text-center text-sm text-gray-600">PDF Document</p>
            <p className="mt-1 text-center text-xs text-gray-500">
              {data.type}
            </p>
            <p className="mt-2 text-center text-xs text-gray-400">
              {data.content.length} characters
            </p>
          </div>
        )
      }
    }

    if (type === "xml") {
      return (
        <div className="h-full overflow-y-auto rounded bg-gray-900 p-3 font-mono text-xs text-green-400">
          <pre className="whitespace-pre-wrap">{data.content}</pre>
        </div>
      )
    }

    if (data.type.startsWith("text/")) {
      return (
        <div className="h-full overflow-y-auto rounded border bg-gray-50 p-3">
          <pre className="text-xs break-words whitespace-pre-wrap text-gray-800">
            {data.content}
          </pre>
        </div>
      )
    }

    // For other types, show raw content
    return (
      <div className="h-full overflow-y-auto rounded border bg-gray-100 p-3">
        <pre className="text-xs break-words whitespace-pre-wrap text-gray-700">
          {data.content.slice(0, 1000)}
          {data.content.length > 1000 &&
            `\n\n... +${data.content.length - 1000} more characters`}
        </pre>
      </div>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(data.content)
  }

  const handleDownload = async () => {
    const type = getPrimaryType()
    const fileName = `clipboard-${type}-${Date.now()}.${getFileExtension(data.type)}`

    if (
      type === "image" ||
      type === "video" ||
      type === "audio" ||
      type === "pdf"
    ) {
      if (data.content.startsWith("blob:")) {
        try {
          // For blob URLs, use the original blob directly
          const a = document.createElement("a")
          a.href = data.content
          a.download = fileName
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          return
        } catch (error) {
          console.error("Failed to download blob:", error)
          return
        }
      } else if (data.content.startsWith("data:")) {
        // For data URLs, convert directly
        const a = document.createElement("a")
        a.href = data.content
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        return
      } else if (data.content.startsWith("http")) {
        // For HTTP URLs, try direct download
        const a = document.createElement("a")
        a.href = data.content
        a.download = fileName
        a.target = "_blank"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        return
      }
    }

    // For text content, create a text blob
    const blob = new Blob([data.content], { type: data.type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFileExtension = (mimeType: string): string => {
    const extensions: Record<string, string> = {
      "text/plain": "txt",
      "text/html": "html",
      "application/json": "json",
      "application/xml": "xml",
      "text/xml": "xml",
      "application/xhtml+xml": "xml",
      "application/pdf": "pdf",
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
      "image/bmp": "bmp",
      "image/tiff": "tiff",
      "video/mp4": "mp4",
      "video/webm": "webm",
      "video/ogg": "ogv",
      "video/avi": "avi",
      "video/mov": "mov",
      "video/quicktime": "mov",
      "video/x-msvideo": "avi",
      "video/3gpp": "3gp",
      "video/x-flv": "flv",
      "audio/mp3": "mp3",
      "audio/mpeg": "mp3",
      "audio/wav": "wav",
      "audio/ogg": "ogg",
      "audio/aac": "aac",
      "audio/flac": "flac",
      "audio/x-wav": "wav",
      "audio/x-ms-wma": "wma",
    }

    // If exact match not found, try to extract from MIME type
    if (!extensions[mimeType]) {
      const parts = mimeType.split("/")
      if (parts.length === 2) {
        const [category, subtype] = parts

        // For video files, use the subtype as extension
        if (category === "video") {
          return subtype.replace(/^x-/, "")
        }

        // For audio files, use the subtype as extension
        if (category === "audio") {
          return subtype.replace(/^x-/, "").replace(/^mpeg$/, "mp3")
        }

        // For image files, use the subtype as extension
        if (category === "image") {
          return subtype.replace(/^x-/, "").replace(/jpeg/, "jpg")
        }
      }
    }

    return extensions[mimeType] || "txt"
  }

  const renderDetailedView = () => {
    const type = getPrimaryType()

    return (
      <div className="flex h-full flex-col">
        <div className="mb-4 flex flex-shrink-0 items-center justify-between">
          <h3 className="text-sm font-semibold text-blue-600">{data.type}</h3>
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-xs"
            onClick={handleDownload}
            title="Download file"
          >
            <DownloadIcon className="mr-1.5 h-3 w-3" />
            Download
          </Button>
        </div>
        <div className="min-h-0 flex-1">
          {type === "image" ? (
            <div className="flex h-full items-center justify-center">
              {data.content.startsWith("data:") ||
              data.content.startsWith("blob:") ||
              data.content.startsWith("http") ? (
                <img
                  src={data.content}
                  alt="Clipboard content"
                  className="max-h-full max-w-full rounded object-contain"
                />
              ) : (
                <div className="flex flex-col items-center rounded border bg-gray-50 p-8">
                  <ImageIcon className="mb-4 h-16 w-16 text-gray-400" />
                  <p className="text-center text-lg text-gray-600">
                    Image File
                  </p>
                  <p className="mt-2 text-center text-sm text-gray-500">
                    Cannot preview this image format
                  </p>
                  <p className="mt-2 text-center text-xs text-gray-400">
                    {data.content.length} characters
                  </p>
                </div>
              )}
            </div>
          ) : type === "video" ? (
            <div className="flex h-full items-center justify-center">
              {data.content.startsWith("data:") ||
              data.content.startsWith("http") ||
              data.content.startsWith("blob:") ? (
                <video
                  src={data.content}
                  controls
                  preload="metadata"
                  className="max-h-full max-w-full rounded"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex flex-col items-center rounded border bg-gray-50 p-8">
                  <VideoIcon className="mb-4 h-16 w-16 text-gray-400" />
                  <p className="text-center text-lg text-gray-600">
                    Video File
                  </p>
                  <p className="mt-2 text-center text-sm text-gray-500">
                    Cannot preview this video format
                  </p>
                  <p className="mt-2 text-center text-xs text-gray-400">
                    {data.content.length} characters
                  </p>
                </div>
              )}
            </div>
          ) : type === "audio" ? (
            <div className="flex h-full items-center justify-center">
              <div className="w-full max-w-2xl">
                {data.content.startsWith("data:") ||
                data.content.startsWith("http") ||
                data.content.startsWith("blob:") ? (
                  <div className="rounded border bg-gray-50 p-8 text-center">
                    <audio
                      src={data.content}
                      controls
                      preload="metadata"
                      className="w-full"
                    >
                      Your browser does not support the audio tag.
                    </audio>
                    <p className="mt-4 text-sm text-gray-600">
                      Audio File - {data.type}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center rounded border bg-gray-50 p-8">
                    <AudioWaveformIcon className="mb-4 h-16 w-16 text-gray-400" />
                    <p className="text-center text-lg text-gray-600">
                      Audio File
                    </p>
                    <p className="mt-2 text-center text-sm text-gray-500">
                      Cannot preview this audio format
                    </p>
                    <p className="mt-2 text-center text-xs text-gray-400">
                      {data.content.length} characters
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : type === "pdf" ? (
            <div className="h-full w-full">
              {data.content.startsWith("blob:") ||
              data.content.startsWith("data:") ||
              data.content.startsWith("http") ? (
                <embed
                  src={data.content}
                  type="application/pdf"
                  className="h-full w-full rounded border"
                  style={{ minHeight: "80vh" }}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center rounded border bg-gray-50 p-8">
                    <FileIcon className="mb-4 h-16 w-16 text-gray-400" />
                    <p className="text-center text-lg text-gray-600">
                      PDF Document
                    </p>
                    <p className="mt-2 text-center text-sm text-gray-500">
                      Cannot preview this PDF format
                    </p>
                    <p className="mt-2 text-center text-xs text-gray-400">
                      {data.content.length} characters
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : type === "xml" ? (
            <div className="h-full">
              <div className="h-full overflow-y-auto rounded border bg-gray-900 p-4 text-left text-green-400">
                <pre className="text-left text-sm whitespace-pre-wrap">
                  {data.content}
                </pre>
              </div>
            </div>
          ) : data.type === "text/html" ? (
            <Tabs defaultValue="preview" className="flex h-full flex-col">
              <TabsList className="grid w-full flex-shrink-0 grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="raw">Raw HTML</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4 min-h-0 flex-1">
                <div className="h-full overflow-y-auto rounded border bg-white p-4 text-left">
                  <div
                    dangerouslySetInnerHTML={{ __html: data.content }}
                    className="prose prose-sm max-w-none text-left"
                  />
                </div>
              </TabsContent>
              <TabsContent value="raw" className="mt-4 min-h-0 flex-1">
                <div className="h-full overflow-y-auto rounded border bg-gray-50 p-4 text-left">
                  <pre className="text-left text-sm whitespace-pre-wrap text-gray-800">
                    {data.content}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="h-full">
              <div className="h-full overflow-y-auto rounded border bg-gray-50 p-4 text-left">
                <pre className="text-left text-sm whitespace-pre-wrap text-gray-800">
                  {data.content}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    )
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
              {getIcon()}
              <span className="truncate text-xs font-medium">{data.type}</span>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                <CopyIcon className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={handleDownload}
                title="Download file"
              >
                <DownloadIcon className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => setIsOpen(true)}
                title="View details"
              >
                <Maximize2Icon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 p-3 pt-0">
          <div className="h-72 overflow-y-auto">{getPreview()}</div>
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
              {getIcon()}
              <span>Clipboard Content Details</span>
            </DialogTitle>
            <DialogDescription>
              Detailed view of clipboard content with type: {data.type}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">{renderDetailedView()}</div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ContentNode
