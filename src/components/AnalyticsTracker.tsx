'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAnalytics } from '../hooks/useAnalytics'

export function AnalyticsTracker() {
  const pathname = usePathname()
  const { trackPageView, isReady } = useAnalytics()

  useEffect(() => {
    if (isReady && pathname) {
      // Track page view with a small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        trackPageView(pathname, {
          timestamp: new Date().toISOString(),
          referrer: document.referrer
        })
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [pathname, trackPageView, isReady])

  return null // This component doesn't render anything
}
