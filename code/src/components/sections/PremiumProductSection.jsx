import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Crown,
  Flame,
  GraduationCap,
  Info,
  Package2,
  ShieldCheck,
} from 'lucide-react'
import { sectionSettingsAPI, servicesAPI } from '../../api'
import useApiData from '../../hooks/useApiData'

const selectServices = (response) => response.data ?? []
const LIVE_REFRESH_INTERVAL = 0

const categoryMeta = {
  vip: { icon: Crown, accent: 'var(--accent-primary)', accentStrong: 'var(--accent-primary-strong)' },
  funded: { icon: ShieldCheck, accent: 'var(--accent-blue)', accentStrong: 'var(--accent-primary)' },
  courses: { icon: GraduationCap, accent: 'var(--accent-primary-strong)', accentStrong: 'var(--accent-primary)' },
  offers: { icon: Flame, accent: 'var(--accent-orange)', accentStrong: 'var(--accent-orange-strong)' },
  scalp: { icon: Package2, accent: 'var(--accent-blue)', accentStrong: 'var(--accent-primary)' },
}

function formatMoney(value, currency = 'USD') {
  const symbol = currency === 'USD' ? '$' : `${currency} `
  return `${symbol}${Number(value ?? 0).toFixed(0)}`
}

function getFeatures(service, isArabic) {
  if (Array.isArray(service.features) && service.features.length > 0) {
    return service.features
      .map((feature) => (isArabic ? feature.label_ar || feature.label_en : feature.label_en || feature.label_ar))
      .filter(Boolean)
  }

  const text = isArabic
    ? service.short_description_ar || service.short_description_en
    : service.short_description_en || service.short_description_ar

  if (!text) return []
  return String(text).split(/\r?\n|•|-/).map((item) => item.trim()).filter(Boolean)
}

function formatTimeLeft(targetDate, isArabic) {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (Number.isNaN(diff) || diff <= 0) {
    return isArabic ? 'انتهى العرض' : 'Offer ended'
  }

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (isArabic) {
    return `${days ? `${days}ي ` : ''}${hours}س ${minutes}د ${seconds}ث`
  }

  return `${days ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`
}

function TopChip({ icon: Icon, children }) {
  return (
    <div
      className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold sm:px-3"
      style={{
        color: 'var(--product-accent)',
        borderColor: 'color-mix(in srgb, var(--product-accent) 28%, transparent)',
        background: 'color-mix(in srgb, var(--product-accent) 10%, transparent)',
      }}
    >
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
      <span className="truncate">{children}</span>
    </div>
  )
}

function isVideoUrl(url = '') {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url)
}

function asBool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback
  return value === true || value === 1 || value === '1'
}

function ProductCardMedia({ product, title, compact = false }) {
  const explicitMediaUrl = product.card_media_url || ''
  const mediaType = product.card_media_type || (isVideoUrl(explicitMediaUrl) ? 'video' : 'image')
  const fallbackImageUrl = product.thumbnail_url || product.cover_url || ''
  const mediaUrl = explicitMediaUrl || fallbackImageUrl
  const mediaClassName = 'aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.02]'

  if (mediaType === 'video' && explicitMediaUrl) {
    return (
      <video
        src={explicitMediaUrl}
        poster={product.card_video_poster_url || product.thumbnail_url || undefined}
        className={mediaClassName}
        autoPlay={asBool(product.card_video_autoplay, false) && asBool(product.card_video_muted, true)}
        muted={asBool(product.card_video_muted, true)}
        loop={asBool(product.card_video_loop, true)}
        playsInline
        preload="metadata"
      />
    )
  }

  if (mediaType === 'embed' && explicitMediaUrl) {
    return (
      <iframe
        src={explicitMediaUrl}
        title={title}
        className="aspect-[4/3] w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  if (mediaUrl) {
    return (
      <img
        src={mediaUrl}
        alt={title}
        className={mediaClassName}
      />
    )
  }

  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center">
      <Package2 className="h-8 w-8 text-hunter-text sm:h-14 sm:w-14" />
    </div>
  )
}

function resolveCardAction(product, isScalp) {
  if (isScalp) {
    return { href: `/services/${product.slug}`, external: false }
  }

  const action = product.cta_action || (isScalp ? 'details' : 'checkout')

  if (isScalp && !['checkout', 'external', 'whatsapp', 'telegram'].includes(action)) {
    return { href: `/services/${product.slug}`, external: false }
  }

  if (action === 'details') return { href: `/services/${product.slug}`, external: false }
  if (action === 'checkout') return { href: `/checkout/${product.slug}`, external: false }
  if (action === 'referral') return { href: product.referral_url || product.cta_url || `/services/${product.slug}`, external: !!(product.referral_url || product.cta_url) }
  if (['external', 'whatsapp', 'telegram'].includes(action)) return { href: product.cta_url || product.referral_url || `/services/${product.slug}`, external: !!(product.cta_url || product.referral_url) }

  return { href: isScalp ? `/services/${product.slug}` : `/checkout/${product.slug}`, external: false }
}

function getCardCtaLabel(product, isScalp, isArabic) {
  const label = isArabic ? product.cta_label_ar : product.cta_label_en

  if (!isScalp) {
    return label || (isArabic ? 'اشتر الآن' : 'Buy Now')
  }

  const normalized = String(label || '').trim().toLowerCase()
  const directActionLabels = ['buy now', 'checkout', 'choose platform', 'اشتر الآن', 'اختار المنصة', 'اختر المنصة']
  if (label && !directActionLabels.includes(normalized)) {
    return label
  }

  return isArabic ? 'عرض الشرح' : 'View details'
}

function CardAction({ action, children, className, style }) {
  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noreferrer" className={className} style={style}>
        {children}
      </a>
    )
  }

  return (
    <Link to={action.href} className={className} style={style}>
      {children}
    </Link>
  )
}

function OfferCountdown({ value, isArabic }) {
  const [label, setLabel] = useState(() => formatTimeLeft(value, isArabic))

  useEffect(() => {
    setLabel(formatTimeLeft(value, isArabic))
    const timer = window.setInterval(() => setLabel(formatTimeLeft(value, isArabic)), 1000)
    return () => window.clearInterval(timer)
  }, [isArabic, value])

  return <TopChip icon={Clock3}>{label}</TopChip>
}

export default function PremiumProductSection({
  sectionId,
  category,
  title,
  subtitle,
  emptyText,
  badgeLabel,
  showExpandToggle = false,
  expandLabel,
  collapseLabel,
  centerCardContent = false,
}) {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { data: products } = useApiData(
    () => servicesAPI.getAll(category),
    [],
    selectServices,
    [category],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )
  const { data: sections } = useApiData(
    sectionSettingsAPI.getPublic,
    [],
    (response) => response.data ?? [],
    [],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )
  const [showAll, setShowAll] = useState(false)
  const meta = categoryMeta[category] ?? categoryMeta.vip
  const Icon = meta.icon
  const isOffers = category === 'offers'
  const sectionKey = category === 'scalp' ? 'scalp' : category
  const section = sections.find((item) => item.section_key === sectionKey) ?? {}
  const resolvedTitle = (isArabic ? section.title_ar : section.title_en) || title
  const resolvedSubtitle = (isArabic ? section.subtitle_ar : section.subtitle_en) || subtitle

  const visibleProducts = useMemo(() => {
    if (!showExpandToggle || showAll) return products
    return products.slice(0, 3)
  }, [products, showAll, showExpandToggle])
  const gridClassName = 'grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3'

  return (
    <section
      id={sectionId}
      className="relative overflow-hidden bg-hunter-card py-20 md:py-32"
      style={{
        '--product-accent': meta.accent,
        '--product-accent-strong': meta.accentStrong,
      }}
    >
      <div className="absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'color-mix(in srgb, var(--product-accent) 6%, transparent)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-4xl text-center"
        >
          <div className="mb-4 flex justify-center">
            <TopChip icon={Icon}>{badgeLabel}</TopChip>
          </div>
          <h2 className="section-title">{resolvedTitle}</h2>
          <p className="section-subtitle">{resolvedSubtitle}</p>
        </motion.div>

        {products.length > 0 ? (
          <>
            <div className={gridClassName}>
              {visibleProducts.map((product, index) => {
                const features = getFeatures(product, isArabic)
                const ribbonText = isArabic ? product.badge_text_ar || product.badge_text_en : product.badge_text_en || product.badge_text_ar
                const productTitle = isArabic ? product.title_ar || product.title_en : product.title_en || product.title_ar
                const isScalp = category === 'scalp' || product.type === 'scalp'
                const action = resolveCardAction(product, isScalp)
                const detailsLabel = isArabic ? product.details_button_label_ar || 'التفاصيل' : product.details_button_label_en || 'Details'

                const compactScalp = isScalp
                const ctaLabel = getCardCtaLabel(product, isScalp, isArabic)
                const visibleFeatures = compactScalp ? features.slice(0, 2) : features
                const singleCard = visibleProducts.length === 1

                return (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-hunter-bg p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.16)] sm:rounded-[2rem] sm:p-4 ${
                      singleCard ? 'col-span-2 mx-auto w-full max-w-[18rem] sm:max-w-sm xl:col-span-1' : ''
                    }`}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'radial-gradient(circle at top, color-mix(in srgb, var(--product-accent) 7%, transparent), transparent 34%)',
                      }}
                    />

                    {ribbonText ? (
                      <>
                        <div
                          className="absolute right-3 top-3 z-20 max-w-[45%] truncate rounded-full border border-white/10 px-2 py-0.5 text-center text-[10px] font-bold text-hunter-text shadow-lg backdrop-blur-sm sm:hidden"
                          style={{
                            background: 'linear-gradient(180deg, color-mix(in srgb, var(--product-accent) 82%, var(--bg-secondary) 18%) 0%, color-mix(in srgb, var(--product-accent-strong) 82%, var(--bg-secondary) 18%) 100%)',
                          }}
                        >
                          {ribbonText}
                        </div>
                        <div
                          className="absolute right-[-2.55rem] top-5 z-20 hidden w-36 rotate-45 border border-white/10 px-10 py-1 text-center text-xs font-bold text-hunter-text shadow-lg backdrop-blur-sm sm:block"
                          style={{
                            background: 'linear-gradient(180deg, color-mix(in srgb, var(--product-accent) 82%, var(--bg-secondary) 18%) 0%, color-mix(in srgb, var(--product-accent-strong) 82%, var(--bg-secondary) 18%) 100%)',
                          }}
                        >
                          {ribbonText}
                        </div>
                      </>
                    ) : null}

                    <div className="relative z-10 rounded-2xl border border-white/10 bg-[color:var(--bg-secondary)]/55 p-2.5 sm:rounded-[1.65rem] sm:p-5">
                      <div className={`mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3 ${isOffers ? 'justify-between' : 'justify-center'}`}>
                        {isOffers ? (
                          <>
                            {product.offer_ends_at ? <OfferCountdown value={product.offer_ends_at} isArabic={isArabic} /> : <div />}
                            <TopChip icon={Icon}>{badgeLabel}</TopChip>
                          </>
                        ) : (
                          <TopChip icon={Icon}>{badgeLabel}</TopChip>
                        )}
                      </div>

                      <div
                        className="relative mb-4 overflow-hidden rounded-2xl border border-white/10 sm:mb-5 sm:rounded-[1.3rem]"
                        style={{
                          background: 'linear-gradient(180deg, color-mix(in srgb, var(--bg-secondary) 95%, white 5%) 0%, color-mix(in srgb, var(--bg-secondary) 98%, transparent) 100%)',
                        }}
                      >
                        <ProductCardMedia product={product} title={productTitle} compact />
                      </div>

                      <div className={centerCardContent ? 'text-center' : 'text-center sm:text-start'}>
                        <h3 className="min-h-[2.35rem] break-words font-heading text-[clamp(0.82rem,3.7vw,1rem)] font-bold leading-tight text-hunter-text sm:min-h-0 sm:text-2xl">{productTitle}</h3>
                        {isScalp ? (
                          <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-hunter-text-muted sm:mt-3">
                            {isArabic ? 'روابط ريفرال' : 'Referral links'}
                          </div>
                        ) : (
                          <div className="mt-2 font-heading text-[clamp(1.15rem,6vw,1.5rem)] font-bold sm:mt-3 sm:text-4xl" style={{ color: 'var(--product-accent)' }}>
                            {formatMoney(product.price, product.currency)}
                          </div>
                        )}
                      </div>

                      {visibleFeatures.length > 0 ? (
                        <div className={`mt-5 hidden space-y-2.5 sm:block ${centerCardContent ? 'mx-auto max-w-xs' : ''}`}>
                          {visibleFeatures.map((feature, featureIndex) => (
                            <div
                              key={`${product.id}-feature-${featureIndex}`}
                              className={`flex items-start gap-2 text-sm leading-6 text-hunter-text-muted ${centerCardContent ? 'justify-center text-center' : ''}`}
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--product-accent)' }} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-4 flex gap-2 sm:mt-6">
                        <CardAction
                          action={action}
                          className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2 text-center text-[clamp(0.68rem,3vw,0.75rem)] font-semibold leading-tight text-hunter-bg transition hover:-translate-y-0.5 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base"
                          style={{
                            background: 'linear-gradient(180deg, var(--product-accent) 0%, var(--product-accent-strong) 100%)',
                            boxShadow: '0 10px 22px color-mix(in srgb, var(--product-accent) 14%, transparent)',
                          }}
                        >
                          <span className="leading-tight sm:truncate">{ctaLabel}</span>
                          <ArrowRight className="hidden h-4 w-4 shrink-0 rtl:rotate-180 sm:block" />
                        </CardAction>

                        {isScalp ? (
                          <Link
                            to={`/services/${product.slug}`}
                            aria-label={`${detailsLabel}: ${productTitle}`}
                            title={detailsLabel}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-hunter-text transition hover:border-hunter-green hover:text-hunter-green sm:h-12 sm:w-12 sm:rounded-2xl"
                          >
                            <Info className="h-5 w-5" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>

            {showExpandToggle && products.length > 3 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-12 text-center"
              >
                <button
                  type="button"
                  onClick={() => setShowAll((current) => !current)}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-hunter-text transition hover:bg-white/10"
                >
                  {showAll ? collapseLabel : expandLabel}
                </button>
              </motion.div>
            ) : null}
          </>
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-hunter-bg p-10 text-center">
            <Package2 className="mx-auto h-12 w-12" style={{ color: 'color-mix(in srgb, var(--product-accent) 72%, transparent)' }} />
            <p className="mt-4 text-hunter-text-muted">{emptyText}</p>
          </div>
        )}
      </div>
    </section>
  )
}
