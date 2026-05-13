const directVideoPattern = /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i
const imagePattern = /\.(jpg|jpeg|png|webp|gif|avif)(?:[?#].*)?$/i

function cleanUrl(value = '') {
  return String(value || '').trim()
}

function pathWithoutQuery(value = '') {
  return cleanUrl(value).split(/[?#]/)[0]
}

export function isDirectVideoUrl(url = '') {
  return directVideoPattern.test(pathWithoutQuery(url))
}

export function isImageUrl(url = '') {
  return imagePattern.test(pathWithoutQuery(url))
}

export function getSafePosterUrl(...candidates) {
  return candidates.map(cleanUrl).find((candidate) => candidate && isImageUrl(candidate)) || ''
}

export function getYouTubeId(url = '') {
  const value = cleanUrl(url)
  if (!value) return ''

  try {
    const parsed = new URL(value)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] || ''
    }

    if (['youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(host)) {
      const watchId = parsed.searchParams.get('v')
      if (watchId) return watchId

      const parts = parsed.pathname.split('/').filter(Boolean)
      if (['shorts', 'embed', 'live'].includes(parts[0])) {
        return parts[1] || ''
      }
    }
  } catch {
    const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/))([^?&#/]+)/i)
    return match?.[1] || ''
  }

  return ''
}

export function getYouTubeEmbedUrl(url = '', { autoplay = false, muted = true, loop = false, controls = true } = {}) {
  const id = getYouTubeId(url)
  if (!id) return ''

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    controls: controls ? '1' : '0',
  })

  if (autoplay) params.set('autoplay', '1')
  if (muted) params.set('mute', '1')
  if (loop) {
    params.set('loop', '1')
    params.set('playlist', id)
  }

  return `https://www.youtube.com/embed/${id}?${params.toString()}`
}

export function getVimeoEmbedUrl(url = '') {
  const value = cleanUrl(url)
  if (!value) return ''

  try {
    const parsed = new URL(value)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'player.vimeo.com') return value
    if (host === 'vimeo.com') {
      const id = parsed.pathname.split('/').filter(Boolean).find((part) => /^\d+$/.test(part))
      return id ? `https://player.vimeo.com/video/${id}` : ''
    }
  } catch {
    return ''
  }

  return ''
}

export function getEmbedUrl(url = '', options = {}) {
  return getYouTubeEmbedUrl(url, options) || getVimeoEmbedUrl(url) || ''
}

export function inferMediaTypeFromUrl(url = '', fallback = 'image') {
  const value = cleanUrl(url)
  if (!value) return fallback || 'image'
  if (isDirectVideoUrl(value)) return 'video'
  if (getEmbedUrl(value)) return 'embed'
  if (isImageUrl(value)) return 'image'
  return fallback || 'image'
}

export function resolveMediaType(url = '', explicitType = 'image') {
  const value = cleanUrl(url)
  const cleanType = ['image', 'video', 'embed'].includes(explicitType) ? explicitType : 'image'

  if (!value) return cleanType
  if (isDirectVideoUrl(value)) return 'video'
  if (getEmbedUrl(value)) return 'embed'
  return cleanType
}
