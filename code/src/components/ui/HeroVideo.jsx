import { useEffect, useMemo, useState } from 'react'
import { Play } from 'lucide-react'

function isImageUrl(url = '') {
  return /\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?(#.*)?$/i.test(String(url))
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

export default function HeroVideo({ settings = {}, title = 'Hunter Trading', background = false }) {
  const isMobile = useIsMobile()
  const [mediaFailed, setMediaFailed] = useState(false)
  const videoUrl = isMobile && settings.hero_mobile_video_url ? settings.hero_mobile_video_url : settings.hero_video_url
  const posterUrl = settings.hero_video_poster_url || settings.hero_fallback_image_url || ''
  const fallbackImage = settings.hero_fallback_image_url || posterUrl
  const videoUrlIsImage = isImageUrl(videoUrl)
  const shouldRenderVideo = !!videoUrl && !videoUrlIsImage && !mediaFailed
  const imageUrl = videoUrlIsImage ? videoUrl : fallbackImage
  const shouldAutoplay = settings.hero_video_autoplay !== false
  const muted = settings.hero_video_muted !== false
  const loop = settings.hero_video_loop !== false
  const controls = !!settings.hero_video_controls

  const videoKey = useMemo(() => `${videoUrl}-${posterUrl}-${isMobile ? 'mobile' : 'desktop'}`, [isMobile, posterUrl, videoUrl])
  useEffect(() => {
    setMediaFailed(false)
  }, [videoKey])

  const wrapperClassName = background
    ? 'relative h-full w-full overflow-hidden bg-hunter-bg'
    : 'relative h-full min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-hunter-card shadow-[0_28px_70px_rgba(0,0,0,0.24)] sm:min-h-[440px] lg:min-h-[600px]'

  return (
    <div className={wrapperClassName}>
      {shouldRenderVideo ? (
        <video
          key={videoKey}
          className="absolute inset-0 h-full w-full object-cover"
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
        <img src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(0,255,136,0.16),_transparent_40%),linear-gradient(135deg,_rgba(0,102,255,0.18),_rgba(18,18,26,1))]">
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
