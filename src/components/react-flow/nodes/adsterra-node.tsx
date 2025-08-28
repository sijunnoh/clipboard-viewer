import { useEffect, useRef, useState } from "react"
import { InfoIcon } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const AdsterraNode = () => {
  const adContainerRef = useRef<HTMLDivElement>(null)
  const [adId] = useState(() => `container-b3d3717e7547f7b70f897a1841f6bc59`)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (isInitialized) return

    const initializeAd = () => {
      if (!adContainerRef.current) return

      // Check if this specific ad element already has been initialized
      const hasAd = adContainerRef.current.querySelector('iframe') || 
                   adContainerRef.current.innerHTML.trim() !== ''
      if (hasAd) return

      setIsInitialized(true)
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="pl27528069.effectivecpmrate.com"]')
    
    if (existingScript) {
      // Script already loaded, initialize immediately
      setTimeout(initializeAd, 100)
      return
    }

    // Load Adsterra script
    const script = document.createElement('script')
    script.src = '//pl27528069.effectivecpmrate.com/b3d3717e7547f7b70f897a1841f6bc59/invoke.js'
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    document.head.appendChild(script)

    // Initialize ad after script loads
    script.onload = () => {
      setTimeout(initializeAd, 100)
    }

    script.onerror = () => {
      console.error('Failed to load Adsterra script')
    }

    return () => {
      // Cleanup: Remove ad content on unmount
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = ''
      }
    }
  }, [isInitialized])

  return (
    <>
      <Card className="h-96 w-80 border-2 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-md">
        <CardHeader className="p-3 pb-2">
          <div className="flex items-center gap-2 text-blue-600">
            <InfoIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Advertisement</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 p-3 pt-0">
          <div className="h-72 flex items-center justify-center w-full">
            <div className="w-full h-full flex items-center justify-center">
              <div 
                ref={adContainerRef}
                id={adId}
                style={{ 
                  display: 'block',
                  width: '300px',
                  height: '250px',
                  minWidth: '300px',
                  minHeight: '250px'
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default AdsterraNode