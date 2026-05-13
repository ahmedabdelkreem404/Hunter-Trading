import { useEffect, useState } from 'react'
import { PUBLIC_CONTENT_CHANGED_EVENT, invalidatePublicCache } from '../api'

export default function useApiData(
  request,
  initialValue,
  select = (value) => value,
  deps = [],
  options = {}
) {
  const [data, setData] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const refreshInterval = Number(options.refreshInterval || 0)

  useEffect(() => {
    let active = true
    let hasLoaded = false
    let intervalId = null

    const load = async () => {
      try {
        const responsePromise = request()
        if (responsePromise?.__hunterCachedData !== undefined && active) {
          setData(select(responsePromise.__hunterCachedData))
          if (!hasLoaded) {
            hasLoaded = true
            setLoading(false)
          }
        }

        const response = await responsePromise
        if (!active) return
        setData(select(response))
      } catch {
        if (!active) return
        if (!hasLoaded) {
          setData(initialValue)
        }
      } finally {
        if (active && !hasLoaded) {
          hasLoaded = true
          setLoading(false)
        }
      }
    }

    load()

    if (refreshInterval > 0) {
      intervalId = window.setInterval(load, refreshInterval)
    }

    const handlePublicContentChanged = () => {
      invalidatePublicCache()
      load()
    }

    window.addEventListener(PUBLIC_CONTENT_CHANGED_EVENT, handlePublicContentChanged)

    const handleStorage = (event) => {
      if (event.key === PUBLIC_CONTENT_CHANGED_EVENT) {
        invalidatePublicCache()
        load()
      }
    }

    window.addEventListener('storage', handleStorage)

    let channel = null
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(PUBLIC_CONTENT_CHANGED_EVENT)
      channel.onmessage = () => {
        invalidatePublicCache()
        load()
      }
    }

    return () => {
      active = false
      if (intervalId) {
        window.clearInterval(intervalId)
      }
      window.removeEventListener(PUBLIC_CONTENT_CHANGED_EVENT, handlePublicContentChanged)
      window.removeEventListener('storage', handleStorage)
      channel?.close()
    }
  }, [refreshInterval, ...deps])

  return { data, loading }
}
