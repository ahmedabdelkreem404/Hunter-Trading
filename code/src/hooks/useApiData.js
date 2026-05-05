import { useEffect, useState } from 'react'

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
        const response = await request()
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

    return () => {
      active = false
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [refreshInterval, ...deps])

  return { data, loading }
}
