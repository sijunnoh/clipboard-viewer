import { useState } from "react"

import {
  InfoIcon,
  MailIcon,
  BugIcon,
  LightbulbIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const InfoNode = () => {
  const [copied, setCopied] = useState(false)

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
      <Card className="h-96 w-80 border-2 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-md">
        <CardHeader className="p-3 pb-2">
          <div className="flex items-center gap-2 text-blue-600">
            <InfoIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Information</span>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0 h-80 flex flex-col">
          <div className="space-y-4 flex-1">
            {/* Main Message */}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800">
                    About Clipboard Viewer
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This tool was created to help you visualize and manage your clipboard data. 
                    It supports multiple formats including text, HTML, images, JSON, and more.
                  </p>
                </div>
              </div>
            </div>
            {/* Feedback Section */}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-start gap-3">
                <MailIcon className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Feedback & Support
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <BugIcon className="h-3 w-3 text-red-400" />
                      <span>Bug reports</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <LightbulbIcon className="h-3 w-3 text-yellow-400" />
                      <span>Feature suggestions</span>
                    </div>
                  </div>
                  <div className="mt-2 p-2 bg-gray-50 rounded border flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-700 font-mono break-all flex-1">
                      sijun.noh@mech2cs.com
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-6 w-6 p-0 flex-shrink-0 transition-colors ${
                        copied ? "bg-green-100 text-green-600" : ""
                      }`}
                      onClick={handleCopyEmail}
                      title={copied ? "Copied!" : "Copy email address"}
                    >
                      {copied ? (
                        <CheckIcon className="h-3 w-3" />
                      ) : (
                        <CopyIcon className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </>
  )
}

export default InfoNode