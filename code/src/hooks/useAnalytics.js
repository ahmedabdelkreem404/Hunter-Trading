import { useEffect } from 'react'
import { analyticsAPI } from '../api'

export function useAnalytics() {
  useEffect(() => {
    // Track page view
    analyticsAPI.track({
      event_type: 'page_view',
      page: window.location.pathname,
      referrer: document.referrer,
    })
  }, [])

  const trackEvent = (eventType, data = {}) => {
    analyticsAPI.track({
      event_type: eventType,
      ...data,
    })
  }

  return { trackEvent }
}
