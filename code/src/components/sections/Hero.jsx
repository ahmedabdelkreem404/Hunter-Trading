import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import HeroVideo from '../ui/HeroVideo'
import AnimatedStatValue from '../ui/AnimatedStatValue'
import { sectionSettingsAPI, settingsAPI } from '../../api'
import useApiData from '../../hooks/useApiData'

const LIVE_REFRESH_INTERVAL = 0

function clampOverlayPercent(value, fallback = 58) {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return fallback
  return Math.min(100, Math.max(0, numericValue))
}

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

export default function Hero({ scrollTargetId = 'funded' }) {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { data: settings } = useApiData(
    settingsAPI.getPublic,
    {},
    (response) => response.data ?? {},
    [],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )
  const { data: sections } = useApiData(
    sectionSettingsAPI.getPublic,
    [],
    (response) => response.data ?? [],
    [],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )
  const hero = sections.find((section) => section.section_key === 'hero') ?? {}
  const telegramLink = settings.general?.telegram_url?.value || settings.general?.free_telegram_url?.value || ''
  const title = isArabic ? hero.title_ar : hero.title_en
  const subtitle = isArabic ? hero.subtitle_ar : hero.subtitle_en
  const body = isArabic ? hero.body_ar : hero.body_en
  const primaryLabel = isArabic ? hero.cta_label_ar : hero.cta_label_en
  const primaryUrl = hero.cta_url || telegramLink
  const stats = Array.isArray(hero.stats) ? hero.stats.filter((stat) => stat?.value || stat?.label_ar || stat?.label_en) : []
  const hasTextContent = Boolean(title || subtitle || body || primaryLabel || stats.length)
  const heroSettings = hero.settings || {}
  const desktopOverlay = clampOverlayPercent(heroSettings.hero_overlay_strength, 58) / 100
  const mobileOverlay = clampOverlayPercent(
    heroSettings.hero_mobile_overlay_strength ?? heroSettings.hero_overlay_strength,
    52
  ) / 100
  const desktopVignetteOpacity = desktopOverlay <= 0 ? 0 : Math.min(Math.max(desktopOverlay / 2, 0.08), 0.46)
  const mobileVignetteOpacity = mobileOverlay <= 0 ? 0 : Math.min(Math.max(mobileOverlay / 2, 0.04), 0.42)
  const desktopOverlayStyle = {
    background: `linear-gradient(90deg, rgba(0,0,0,${Math.min(desktopOverlay + 0.2, 0.94)}) 0%, rgba(0,0,0,${desktopOverlay}) 48%, rgba(0,0,0,${Math.max(desktopOverlay - 0.24, 0.08)}) 100%)`,
  }
  const mobileOverlayStyle = {
    background: `linear-gradient(180deg, rgba(0,0,0,${Math.min(mobileOverlay * 1.14, 0.9)}) 0%, rgba(0,0,0,${mobileOverlay}) 48%, rgba(0,0,0,${Math.min(mobileOverlay * 1.18, 0.92)}) 100%)`,
  }
  const desktopVignetteStyle = {
    background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,${desktopVignetteOpacity}) 74%, rgba(0,0,0,${Math.min(desktopVignetteOpacity + 0.18, 0.68)}) 100%)`,
  }
  const mobileVignetteStyle = {
    background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,${mobileVignetteOpacity}) 76%, rgba(0,0,0,${Math.min(mobileVignetteOpacity + 0.12, 0.56)}) 100%)`,
  }

  const handlePrimaryClick = () => {
    if (!primaryUrl) return
    if (primaryUrl.startsWith('#')) {
      document.querySelector(primaryUrl)?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (primaryUrl.startsWith('/')) {
      window.location.href = primaryUrl
      return
    }
    window.open(primaryUrl, '_blank')
  }

  return (
    <section id="home" className="hero-section relative flex min-h-[70svh] items-center overflow-hidden md:min-h-[100svh]">
      <div className="absolute inset-0 z-0">
        <HeroVideo settings={heroSettings} title={title || ''} background />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] lg:hidden" style={mobileOverlayStyle} />
      <div className="pointer-events-none absolute inset-0 z-[1] hidden lg:block" style={desktopOverlayStyle} />
      <div className="pointer-events-none absolute inset-0 z-[2] lg:hidden" style={mobileVignetteStyle} />
      <div className="pointer-events-none absolute inset-0 z-[2] hidden lg:block" style={desktopVignetteStyle} />

      <div className="relative z-10 mx-auto flex min-h-[70svh] w-full max-w-7xl items-center px-4 pb-8 pt-20 sm:px-6 sm:pb-16 sm:pt-32 md:min-h-[100svh] lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: isArabic ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hero-content mx-auto max-w-4xl text-center lg:mx-0 lg:text-start"
        >
          {primaryLabel ? (
            <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-hunter-green/30 bg-black/20 px-3 py-1.5 shadow-lg shadow-black/10 backdrop-blur sm:mb-6 sm:px-4 sm:py-2">
              <span className="h-2 w-2 rounded-full bg-hunter-green animate-pulse" />
              <span className="hero-eyebrow font-medium text-hunter-green">{primaryLabel}</span>
            </div>
          ) : null}

          {title || subtitle ? (
            <h1 className="hero-title mx-auto mb-3 max-w-[22rem] font-heading font-bold text-white drop-shadow-lg sm:mb-6 sm:max-w-4xl sm:text-5xl lg:mx-0 lg:text-6xl xl:text-[4.5rem]">
              {title}
              {subtitle ? (
                <span className="hero-subtitle mt-2 block text-gradient sm:mt-3 sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
                  {subtitle}
                </span>
              ) : null}
            </h1>
          ) : null}

          {body ? (
            <p className="hero-body mx-auto mb-5 max-w-xl text-white/88 drop-shadow-sm sm:mb-8 sm:text-lg sm:leading-8 lg:mx-0 lg:text-xl">
              {body}
            </p>
          ) : null}

          {primaryUrl && primaryLabel ? (
            <div className="mb-5 flex flex-col gap-2.5 sm:mb-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrimaryClick}
                className="btn-primary hero-cta flex w-full items-center justify-center gap-2 rounded-2xl shadow-xl shadow-black/20 sm:w-auto sm:text-lg"
              >
                <TelegramIcon />
                {primaryLabel}
              </motion.button>
            </div>
          ) : null}

          {stats.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={`${stat.value}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.1 }}
                  className="hero-stat rounded-2xl border border-white/10 bg-black/20 px-2 py-2 text-center shadow-lg shadow-black/10 backdrop-blur sm:px-4 sm:py-3 lg:text-start"
                >
                  <div className="hero-stat-value font-heading font-bold text-hunter-green sm:text-3xl">
                    <AnimatedStatValue value={stat.value} />
                  </div>
                  <div className="hero-stat-label mt-1 text-white/78 sm:text-sm">
                    {isArabic ? stat.label_ar || stat.label_en : stat.label_en || stat.label_ar}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>

      {hasTextContent && scrollTargetId ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 sm:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex cursor-pointer flex-col items-center gap-2"
            onClick={() => document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth' })}
          >
            <ChevronDown className="h-5 w-5 text-hunter-green" />
          </motion.div>
        </motion.div>
      ) : null}
    </section>
  )
}
