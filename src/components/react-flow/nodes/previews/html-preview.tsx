import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface HtmlPreviewProps {
  content: string
  variant?: "compact" | "detailed"
}

const HtmlPreview = ({ content, variant = "compact" }: HtmlPreviewProps) => {
  if (variant === "detailed") {
    return (
      <Tabs defaultValue="preview" className="flex h-full flex-col">
        <TabsList className="grid w-full flex-shrink-0 grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="raw">Raw HTML</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="mt-4 min-h-0 flex-1">
          <div className="h-full overflow-y-auto rounded border bg-white p-4 text-left">
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="prose prose-sm max-w-none text-left"
            />
          </div>
        </TabsContent>
        <TabsContent value="raw" className="mt-4 min-h-0 flex-1">
          <div className="h-full overflow-y-auto rounded border bg-gray-50 p-4 text-left">
            <pre className="text-left text-sm whitespace-pre-wrap text-gray-800">
              {content}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <div className="h-full w-fit overflow-y-auto rounded border bg-white p-3">
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="prose prose-sm max-w-none [&>*]:!m-1"
      />
    </div>
  )
}

export default HtmlPreview
