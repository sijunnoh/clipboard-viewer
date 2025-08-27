import { useState, useEffect } from "react"
import InfoNode from "./info-node"
import AdsenseNode from "./adsense-node"


const AdaptiveInfoNode = () => {
  const [showAdsense, setShowAdsense] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAdsenseAvailability = () => {
      // Check if we're on localhost (AdSense won't work on localhost)
      const isLocalhost = window.location.hostname === "localhost" || 
                         window.location.hostname === "127.0.0.1" ||
                         window.location.hostname.startsWith("192.168") ||
                         window.location.hostname.startsWith("10.")
      
      if (isLocalhost) {
        setShowAdsense(false)
        setIsChecking(false)
        return
      }

      // Check if AdSense script is loaded
      const checkScript = () => {
        const script = document.querySelector('script[src*="adsbygoogle"]')
        if (script) {
          // Give AdSense time to initialize
          setTimeout(() => {
            // Check if AdSense is actually available
            if (window.adsbygoogle && (window.adsbygoogle as any).loaded) {
              setShowAdsense(true)
            } else {
              // Check if ad blocker is active
              const testAd = document.createElement('div')
              testAd.className = 'adsbygoogle'
              testAd.style.display = 'none'
              document.body.appendChild(testAd)
              
              setTimeout(() => {
                const isBlocked = testAd.offsetHeight === 0
                document.body.removeChild(testAd)
                setShowAdsense(!isBlocked)
                setIsChecking(false)
              }, 100)
            }
          }, 1000)
        } else {
          // No AdSense script found, show info node
          setShowAdsense(false)
          setIsChecking(false)
        }
      }

      // Wait a bit for scripts to load
      setTimeout(checkScript, 500)
    }

    checkAdsenseAvailability()

    // Also listen for AdSense load event
    const handleAdsenseLoad = () => {
      if (window.adsbygoogle && (window.adsbygoogle as any).loaded) {
        setShowAdsense(true)
        setIsChecking(false)
      }
    }

    window.addEventListener('load', handleAdsenseLoad)
    return () => window.removeEventListener('load', handleAdsenseLoad)
  }, [])

  // During check, default to InfoNode for better UX
  if (isChecking) {
    return <InfoNode />
  }

  return showAdsense ? <AdsenseNode /> : <InfoNode />
}

export default AdaptiveInfoNode