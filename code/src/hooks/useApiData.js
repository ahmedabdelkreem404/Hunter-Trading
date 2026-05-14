import { useEffect, useState } from 'react'
import { PUBLIC_CONTENT_CHANGED_EVENT, invalidatePublicCache } from '../api'

export default function useApiData(
  request,
  initialValue,
  select = (value) => value,
  deps = [],
  options = {}
) {
  const refreshInterval = Number(options.refreshInterval || 0)
  const readCachedResponse = () => {
    if (typeof options.peek === 'function') {
      return options.peek()
    }

    if (typeof request.peek === 'function') {
      return request.peek()
    }

    return undefined
  }
  const getInitialState = () => {
    const cachedResponse = readCachedResponse()
    if (cachedResponse !== undefined) {
      return {
        data: select(cachedResponse),
        loading: false,
      }
    }

    return {
      data: initialValue,
      loading: true,
    }
  }
  const [state, setState] = useState(getInitialState)
  const { data, loading } = state

  useEffect(() => {
    let active = true
    let hasLoaded = !loading
    let intervalId = null

    const applyData = (value) => {
      setState({ data: value, loading: false })
    }

    const load = async () => {
      try {
        const cachedResponse = readCachedResponse()
        if (cachedResponse !== undefined && active) {
          applyData(select(cachedResponse))
          hasLoaded = true
        }

        const responsePromise = request()
        if (responsePromise?.__hunterCachedData !== undefined && active) {
          applyData(select(responsePromise.__hunterCachedData))
          hasLoaded = true
        }

        const response = await responsePromise
        if (!active) return
        applyData(select(response))
        hasLoaded = true
      } catch {
        if (!active) return
        if (!hasLoaded) {
          setState({ data: initialValue, loading: false })
        }
      } finally {
        if (active && !hasLoaded) {
          hasLoaded = true
          setState((current) => ({ ...current, loading: false }))
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
