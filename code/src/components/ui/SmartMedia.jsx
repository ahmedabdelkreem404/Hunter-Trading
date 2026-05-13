import { useEffect, useState } from 'react'
import { getEmbedUrl, getSafePosterUrl, resolveMediaType } from '../../utils/media'

export default function SmartMedia({
  src,
  type = 'image',
  alt = '',
  poster = '',
  className = '',
  imageClassName = '',
  videoClassName = '',
  iframeClassName = '',
  controls = true,
  muted = false,
  autoPlay = false,
  loop = false,
  playsInline = true,
  loading = 'lazy',
  fallback = null,
  showPosterBeforePlay = false,
}) {
  const [failed, setFailed] = useState(false)
  const [started, setStarted] = useState(false)
  const mediaUrl = String(src || '').trim()

  useEffect(() => {
    setFailed(false)
    setStarted(false)
  }, [mediaUrl, poster])

  if (!mediaUrl || failed) return fallback

  const mediaType = resolveMediaType(mediaUrl, type)
  const safePoster = getSafePosterUrl(poster)
  const baseClassName = className || 'h-full w-full object-cover'
  const shouldGateWithPoster = showPosterBeforePlay && safePoster && ['video', 'embed'].includes(mediaType) && !started

  if (shouldGateWithPoster) {
    return (
      <button
        type="button"
        className={`group relative block overflow-hidden ${baseClassName}`}
        onClick={() => setStarted(true)}
        aria-label={alt || 'Play media'}
      >
        <img src={safePoster} alt={alt} className="h-full w-full object-cover" loading={loading} />
        <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/15" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white shadow-2xl backdrop-blur transition group-hover:scale-105">
            <span className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-current" />
          </span>
        </span>
      </button>
    )
  }

  if (mediaType === 'video') {
    return (
      <video
        src={mediaUrl}
        poster={safePoster || undefined}
        className={videoClassName || baseClassName}
        controls={controls}
        muted={muted}
        autoPlay={started || (autoPlay && muted)}
        loop={loop}
        playsInline={playsInline}
        preload="metadata"
        onError={() => setFailed(true)}
      />
    )
  }

  if (mediaType === 'embed') {
    return (
      <iframe
        src={getEmbedUrl(mediaUrl, { autoplay: started || autoPlay, muted, loop, controls }) || mediaUrl}
        title={alt}
        className={iframeClassName || baseClassName}
        loading={loading}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return (
    <img
      src={mediaUrl}
      alt={alt}
      className={imageClassName || baseClassName}
      loading={loading}
      onError={() => setFailed(true)}
    />
  )
}
