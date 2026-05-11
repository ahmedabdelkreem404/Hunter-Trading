import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import HeroVideo from '../ui/HeroVideo'
import { sectionSettingsAPI, settingsAPI } from '../../api'
import useApiData from '../../hooks/useApiData'

const LIVE_REFRESH_INTERVAL = 0

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

const defaultStats = [
  { value: '10000+', label_en: 'Students', label_ar: 'طالب' },
  { value: '8+', label_en: 'Years', label_ar: 'سنوات خبرة' },
  { value: '87%', label_en: 'Win Rate', label_ar: 'معدل النجاح' },
]

export default function Hero({ primaryCtaId = 'vip', scrollTargetId = 'funded' }) {
  const { t, i18n } = useTranslation()
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
  const telegramLink = settings.general?.telegram_url?.value || settings.general?.free_telegram_url?.value || 'https://t.me/hunter_tradeing'

  const title = isArabic ? hero.title_ar : hero.title_en
  const subtitle = isArabic ? hero.subtitle_ar : hero.subtitle_en
  const body = isArabic ? hero.body_ar : hero.body_en
  const primaryLabel = isArabic ? hero.cta_label_ar : hero.cta_label_en
  const secondaryLabel = isArabic ? hero.secondary_cta_label_ar : hero.secondary_cta_label_en
  const primaryUrl = hero.cta_url || telegramLink
  const secondaryUrl = hero.secondary_cta_url || `#${primaryCtaId}`
  const stats = Array.isArray(hero.stats) && hero.stats.length > 0 ? hero.stats : defaultStats

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
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <HeroVideo settings={hero.settings || {}} title={title || t('hero.title')} background />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/65" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_top_right,_rgba(0,255,136,0.24),_transparent_42%),linear-gradient(90deg,_rgba(10,10,15,0.88)_0%,_rgba(10,10,15,0.66)_46%,_rgba(10,10,15,0.28)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-4 pb-16 pt-24 sm:px-6 sm:pt-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: isArabic ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center lg:mx-0 lg:text-start"
        >
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-hunter-green/30 bg-black/30 px-4 py-2 shadow-lg shadow-black/20 backdrop-blur sm:mb-6">
            <span className="h-2 w-2 rounded-full bg-hunter-green animate-pulse" />
            <span className="text-sm font-medium text-hunter-green">
              {primaryLabel || (isArabic ? 'ابدأ مع خدماتنا الآن' : 'Start with our trading services')}
            </span>
          </div>

          <h1 className="mx-auto mb-5 max-w-[22rem] font-heading text-[2.2rem] font-bold leading-[1.15] text-white drop-shadow-2xl sm:mb-6 sm:max-w-4xl sm:text-5xl lg:mx-0 lg:text-6xl xl:text-[4.5rem]">
            {title || t('hero.title')}
            <span className="mt-3 block text-[1.72rem] leading-[1.2] text-gradient sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
              {subtitle || (isArabic ? 'إدارة كاملة لكل خدمات التداول' : 'Fully managed trading services')}
            </span>
          </h1>

          <p className="mx-auto mb-7 max-w-xl text-base leading-8 text-white/85 drop-shadow-lg sm:mb-8 sm:text-lg lg:mx-0 lg:text-xl">
            {body || t('hero.subtitle')}
          </p>

          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 lg:justify-start">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrimaryClick}
              className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl text-base shadow-2xl shadow-black/30 sm:w-auto sm:text-lg"
            >
              <TelegramIcon />
              {primaryLabel || t('hero.cta_telegram')}
            </motion.button>

            <motion.a
              href={secondaryUrl}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary flex w-full items-center justify-center gap-2 rounded-2xl border-white/25 bg-black/30 text-base text-white shadow-2xl shadow-black/20 backdrop-blur hover:bg-black/45 sm:w-auto sm:text-lg"
            >
              {secondaryLabel || (isArabic ? 'اعرض الخدمات' : 'View Services')}
            </motion.a>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={`${stat.value}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.1 }}
                className="rounded-2xl border border-white/10 bg-black/25 px-2.5 py-3 text-center shadow-lg shadow-black/10 backdrop-blur sm:px-4 lg:text-start"
              >
                <div className="font-heading text-xl font-bold text-hunter-green sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs leading-5 text-white/75 sm:text-sm">
                  {isArabic ? stat.label_ar || stat.label_en : stat.label_en || stat.label_ar}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex cursor-pointer flex-col items-center gap-2"
          onClick={() => document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-sm text-white/70">{isArabic ? 'مرر للأسفل' : 'Scroll'}</span>
          <ChevronDown className="h-5 w-5 text-hunter-green" />
        </motion.div>
      </motion.div>
    </section>
  )
}
