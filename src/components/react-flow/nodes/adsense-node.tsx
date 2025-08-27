import { useEffect, useRef, useState } from "react"
import { InfoIcon } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

const AdsenseNode = () => {
  const adRef = useRef<HTMLModElement>(null)
  const [adId] = useState(() => `adsense-${Date.now()}-${Math.random()}`)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (isInitialized) return

    const initializeAd = () => {
      if (!adRef.current) return

      // Check if this specific ad element already has been initialized
      const hasAd = adRef.current.querySelector('iframe') || adRef.current.innerHTML.trim() !== ''
      if (hasAd) return

      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        setIsInitialized(true)
      } catch (e) {
        console.error('AdSense error:', e)
      }
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="adsbygoogle"]')
    
    if (existingScript) {
      // Script already loaded, initialize immediately
      setTimeout(initializeAd, 100)
      return
    }

    // Load AdSense script
    const script = document.createElement('script')
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4036526799304599'
    script.async = true
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)

    // Initialize ad after script loads
    script.onload = () => {
      setTimeout(initializeAd, 100)
    }

    script.onerror = () => {
      console.error('Failed to load AdSense script')
    }

    return () => {
      // Cleanup: Remove ad content on unmount
      if (adRef.current) {
        adRef.current.innerHTML = ''
      }
    }
  }, [isInitialized])

  return (
    <>
      <Card className="h-96 w-80 border-2 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-md">
        <CardHeader className="p-3 pb-2">
          <div className="flex items-center gap-2 text-blue-600">
            <InfoIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Information</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 p-3 pt-0">
          <div className="h-72 flex items-center justify-center w-full">
            <div className="w-full h-full flex items-center justify-center">
              <ins 
                ref={adRef}
                className="adsbygoogle"
                key={adId}
                style={{ 
                  display: 'block',
                  width: '300px',
                  height: '250px',
                  minWidth: '300px',
                  minHeight: '250px'
                }}
                data-ad-client="ca-pub-4036526799304599"
                data-ad-slot="9964401105"
                data-ad-format="rectangle"
                data-full-width-responsive="false"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default AdsenseNode