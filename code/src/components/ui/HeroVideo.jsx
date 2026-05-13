import { useEffect, useMemo, useState } from 'react'
import { Play } from 'lucide-react'

function isImageUrl(url = '') {
  return /\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?(#.*)?$/i.test(String(url))
}

function getYouTubeId(url = '') {
  const value = String(url || '').trim()
  if (!value) return ''

  try {
    const parsed = new URL(value)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] || ''
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (parsed.searchParams.get('v')) return parsed.searchParams.get('v') || ''

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

function getYouTubeEmbedUrl(url = '', { autoplay = true, muted = true, loop = true, controls = false } = {}) {
  const id = getYouTubeId(url)
  if (!id) return ''

  const params = new URLSearchParams({
    autoplay: autoplay && muted ? '1' : '0',
    mute: muted ? '1' : '0',
    controls: controls ? '1' : '0',
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
  })

  if (loop) {
    params.set('loop', '1')
    params.set('playlist', id)
  }

  return `https://www.youtube.com/embed/${id}?${params.toString()}`
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false))

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return isMobile
}

export default function HeroVideo({ settings = {}, title = '', background = false }) {
  const isMobile = useIsMobile()
  const [mediaFailed, setMediaFailed] = useState(false)
  const videoUrl = isMobile && settings.hero_mobile_video_url ? settings.hero_mobile_video_url : settings.hero_video_url
  const posterUrl = settings.hero_video_poster_url || settings.hero_fallback_image_url || ''
  const fallbackImage = settings.hero_fallback_image_url || posterUrl
  const videoUrlIsImage = isImageUrl(videoUrl)
  const imageUrl = videoUrlIsImage ? videoUrl : fallbackImage
  const shouldAutoplay = settings.hero_video_autoplay !== false
  const muted = settings.hero_video_muted !== false
  const loop = settings.hero_video_loop !== false
  const controls = !!settings.hero_video_controls
  const youTubeEmbedUrl = getYouTubeEmbedUrl(videoUrl, { autoplay: shouldAutoplay, muted, loop, controls })
  const shouldRenderYouTube = !!youTubeEmbedUrl && !mediaFailed
  const shouldRenderVideo = !!videoUrl && !videoUrlIsImage && !shouldRenderYouTube && !mediaFailed

  const videoKey = useMemo(() => `${videoUrl}-${posterUrl}-${isMobile ? 'mobile' : 'desktop'}-${youTubeEmbedUrl}`, [isMobile, posterUrl, videoUrl, youTubeEmbedUrl])
  useEffect(() => {
    setMediaFailed(false)
  }, [videoKey])

  const wrapperClassName = background
    ? 'relative h-full w-full overflow-hidden bg-hunter-bg'
    : 'relative h-full min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-hunter-card shadow-[0_28px_70px_rgba(0,0,0,0.24)] sm:min-h-[440px] lg:min-h-[600px]'
  const backgroundMediaClassName = 'hero-background-media absolute inset-0 h-full w-full object-cover object-center'
  const framedMediaClassName = 'absolute inset-0 h-full w-full object-cover object-center'

  return (
    <div className={wrapperClassName}>
      {shouldRenderYouTube ? (
        <iframe
          key={videoKey}
          src={youTubeEmbedUrl}
          title={title || 'Hero background video'}
          className={background ? 'hero-background-embed' : 'absolute inset-0 h-full w-full border-0'}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          aria-label={title}
        />
      ) : shouldRenderVideo ? (
        <video
          key={videoKey}
          className={background ? backgroundMediaClassName : framedMediaClassName}
          src={videoUrl}
          poster={posterUrl || undefined}
          autoPlay={shouldAutoplay && muted}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          preload="metadata"
          aria-label={title}
          onError={() => setMediaFailed(true)}
        />
      ) : imageUrl ? (
        <img src={imageUrl} alt={title} className={background ? backgroundMediaClassName : framedMediaClassName} loading="eager" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06),_transparent_42%),linear-gradient(135deg,_rgba(12,12,18,1),_rgba(4,4,8,1))]">
          <div className={background ? 'hidden' : 'flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/10 text-hunter-green backdrop-blur'}>
            <Play className="h-9 w-9" />
          </div>
        </div>
      )}

      {!background ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-hunter-bg/55 via-transparent to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-1 w-3/4 -translate-x-1/2 bg-hunter-green/30 blur-xl" />
        </>
      ) : null}
    </div>
  )
}
