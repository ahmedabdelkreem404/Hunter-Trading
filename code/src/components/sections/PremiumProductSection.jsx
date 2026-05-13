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
  Package2,
  ShieldCheck,
} from 'lucide-react'
import { sectionSettingsAPI, servicesAPI } from '../../api'
import useApiData from '../../hooks/useApiData'
import SmartMedia from '../ui/SmartMedia'
import { getSafePosterUrl, resolveMediaType } from '../../utils/media'

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

function hasText(value) {
  return String(value || '').trim().length > 0
}

function localizedValue(item = {}, isArabic, arKey, enKey) {
  return isArabic ? item[arKey] || item[enKey] : item[enKey] || item[arKey]
}

function sortByOrder(list = []) {
  return [...list].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
}

function getVisibleImportantLinks(product = {}, isArabic) {
  if (!Array.isArray(product.important_links)) return []

  return sortByOrder(product.important_links)
    .filter((link) => link && link.is_visible !== false && hasText(link.url))
    .map((link) => ({
      ...link,
      label: localizedValue(link, isArabic, 'label_ar', 'label_en') || link.url,
    }))
    .filter((link) => hasText(link.label))
}

function getCardDetailItems(product = {}, isArabic) {
  const steps = Array.isArray(product.steps) ? sortByOrder(product.steps) : []
  const faqs = Array.isArray(product.faqs) ? sortByOrder(product.faqs) : []
  const mediaItems = Array.isArray(product.media) ? product.media.filter((item) => hasText(item.media_url)) : []
  const brokerName = product.broker_name
  const termsTitle = localizedValue(product, isArabic, 'terms_title_ar', 'terms_title_en')
  const firstStep = steps.map((step) => localizedValue(step, isArabic, 'title_ar', 'title_en')).find(hasText)
  const firstFaq = faqs.map((faq) => localizedValue(faq, isArabic, 'question_ar', 'question_en')).find(hasText)
  const items = [
    brokerName,
    firstStep,
    termsTitle,
    firstFaq,
    mediaItems.length ? (isArabic ? `${mediaItems.length} وسائط` : `${mediaItems.length} media`) : '',
  ]

  return items.map((item) => String(item || '').trim()).filter(Boolean)
}

function formatTimeLeft(targetDate, isArabic, compact = false) {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (Number.isNaN(diff) || diff <= 0) {
    return ''
  }

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (compact) {
    if (isArabic) {
      if (days > 0) return `${days}ي ${hours}س`
      return `${hours}س ${minutes}د`
    }

    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h ${minutes}m`
  }

  if (isArabic) {
    return `${days ? `${days}ي ` : ''}${hours}س ${minutes}د ${seconds}ث`
  }

  return `${days ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`
}

function TopChip({ icon: Icon, children, className = '' }) {
  if (!children) {
    return null
  }

  return (
    <div
      className={`service-card-chip max-w-full min-w-0 items-center gap-[0.45em] rounded-full border px-[0.8em] py-[0.35em] font-semibold sm:px-3 sm:py-1 sm:text-xs ${className || 'inline-flex'}`}
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

function asBool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback
  return value === true || value === 1 || value === '1'
}

function ProductCardMedia({ product, title, compact = false }) {
  const explicitMediaUrl = product.card_media_url || ''
  const galleryMediaUrl = Array.isArray(product.media)
    ? product.media.find((item) => hasText(item.media_url))?.media_url || ''
    : ''
  const fallbackImageUrl = product.thumbnail_url || product.cover_url || galleryMediaUrl || ''
  const mediaUrl = explicitMediaUrl || fallbackImageUrl
  const mediaType = resolveMediaType(mediaUrl, explicitMediaUrl ? product.card_media_type || 'image' : product.cover_media_type || product.card_media_type || 'image')
  const posterUrl = getSafePosterUrl(product.card_video_poster_url, product.thumbnail_url, product.cover_video_poster_url, galleryMediaUrl)
  const mediaClassName = 'aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:aspect-[16/10]'

  if (mediaUrl) {
    return (
      <SmartMedia
        src={mediaUrl}
        type={mediaType}
        alt={title}
        poster={posterUrl}
        className={mediaClassName}
        iframeClassName="aspect-[4/3] w-full sm:aspect-[16/10]"
        autoPlay
        muted
        loop={asBool(product.card_video_loop, true)}
        controls={asBool(product.card_video_controls, false)}
      />
    )
  }

  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center sm:aspect-[16/10]">
      <Package2 className="h-9 w-9 text-hunter-text sm:h-14 sm:w-14" />
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
    return label || ''
  }

  const normalized = String(label || '').trim().toLowerCase()
  const directActionLabels = ['buy now', 'checkout', 'choose platform', 'اشتر الآن', 'اختار المنصة', 'اختر المنصة']
  if (label && !directActionLabels.includes(normalized)) {
    return label
  }

  return label || ''
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

function CardSecondaryLink({ link, isArabic }) {
  const href = normalizeSectionUrl(link.url)
  if (!href) return null

  const external = /^(https?:|mailto:|tel:|sms:|whatsapp:|tg:)/i.test(href)
  const content = (
    <>
      <span className="min-w-0 truncate">{link.label}</span>
      <ArrowRight className={`h-[1em] w-[1em] shrink-0 ${isArabic ? 'rotate-180' : ''}`} />
    </>
  )
  const className = "service-card-secondary-link inline-flex min-w-0 items-center justify-center gap-[0.4em] rounded-lg border border-white/10 bg-white/[0.045] px-[0.75em] py-[0.55em] font-semibold text-hunter-text-muted transition hover:border-[color:var(--product-accent)] hover:text-hunter-text sm:rounded-xl"

  if (external) {
    return (
      <a href={href} target={link.new_tab === false ? undefined : '_blank'} rel={link.new_tab === false ? undefined : 'noreferrer'} className={className}>
        {content}
      </a>
    )
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  )
}

function normalizeSectionUrl(url = '') {
  const trimmed = String(url || '').trim()
  if (!trimmed) return ''
  if (/^(https?:|mailto:|tel:|sms:|whatsapp:|tg:|#|\/)/i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function SectionCta({ href, children, isArabic }) {
  const normalizedHref = normalizeSectionUrl(href)
  if (!normalizedHref || !children) return null

  const isExternal = /^(https?:|mailto:|tel:|sms:|whatsapp:|tg:)/i.test(normalizedHref)
  const className = "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-hunter-bg shadow-lg transition hover:-translate-y-0.5 sm:px-6 sm:text-base"
  const style = {
    background: 'linear-gradient(180deg, var(--product-accent) 0%, var(--product-accent-strong) 100%)',
    boxShadow: '0 14px 34px color-mix(in srgb, var(--product-accent) 18%, transparent)',
  }
  const content = (
    <>
      <span>{children}</span>
      <ArrowRight className={`h-4 w-4 shrink-0 ${isArabic ? 'rotate-180' : ''}`} />
    </>
  )

  if (isExternal) {
    return (
      <a href={normalizedHref} target="_blank" rel="noreferrer" className={className} style={style}>
        {content}
      </a>
    )
  }

  return (
    <a href={normalizedHref} className={className} style={style}>
      {content}
    </a>
  )
}

function OfferCountdown({ value, isArabic }) {
  const [isCompact, setIsCompact] = useState(() => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false))
  const [label, setLabel] = useState(() => formatTimeLeft(value, isArabic, isCompact))

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setIsCompact(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    setLabel(formatTimeLeft(value, isArabic, isCompact))
    const timer = window.setInterval(() => setLabel(formatTimeLeft(value, isArabic, isCompact)), isCompact ? 60000 : 1000)
    return () => window.clearInterval(timer)
  }, [isArabic, isCompact, value])

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
  const resolvedTitle = (isArabic ? section.title_ar || section.title_en : section.title_en || section.title_ar) || title || ''
  const resolvedSubtitle = (isArabic ? section.subtitle_ar || section.subtitle_en : section.subtitle_en || section.subtitle_ar) || subtitle || ''
  const resolvedBody = (isArabic ? section.body_ar || section.body_en : section.body_en || section.body_ar) || ''
  const resolvedSectionCtaLabel = (isArabic ? section.cta_label_ar || section.cta_label_en : section.cta_label_en || section.cta_label_ar) || ''
  const resolvedSectionCtaUrl = section.cta_url || ''
  const resolvedBadgeLabel = badgeLabel || resolvedTitle
  const hasSectionExtraContent = Boolean(resolvedBody || (resolvedSectionCtaLabel && resolvedSectionCtaUrl))

  const visibleProducts = useMemo(() => {
    if (!showExpandToggle || showAll) return products
    return products.slice(0, 3)
  }, [products, showAll, showExpandToggle])
  const gridClassName = 'service-product-grid'

  if (products.length === 0 && !resolvedTitle && !resolvedSubtitle && !resolvedBody && !resolvedSectionCtaLabel) {
    return null
  }

  return (
    <section
      id={sectionId}
      className="relative overflow-hidden border-y border-white/[0.04] bg-hunter-card py-10 sm:py-14 md:py-24 xl:py-28"
      style={{
        '--product-accent': meta.accent,
        '--product-accent-strong': meta.accentStrong,
      }}
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--product-accent) 42%, transparent), transparent)' }}
        />
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
          className={`mx-auto max-w-3xl text-center ${hasSectionExtraContent ? 'mb-5 sm:mb-6' : 'mb-8 sm:mb-10 md:mb-12'}`}
        >
          {resolvedBadgeLabel ? (
            <div className="mb-4 flex justify-center">
              <TopChip icon={Icon}>{resolvedBadgeLabel}</TopChip>
            </div>
          ) : null}
          {resolvedTitle ? <h2 className="section-title">{resolvedTitle}</h2> : null}
          {resolvedSubtitle ? <p className="section-subtitle">{resolvedSubtitle}</p> : null}
        </motion.div>

        {hasSectionExtraContent ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mx-auto mb-8 flex max-w-3xl flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-4 text-center shadow-[0_18px_50px_rgba(0,0,0,0.14)] backdrop-blur-sm sm:mb-10 sm:p-5 md:mb-12"
          >
            {resolvedBody ? (
              <p className="max-w-2xl whitespace-pre-line text-sm leading-8 text-hunter-text-muted sm:text-base sm:leading-9">
                {resolvedBody}
              </p>
            ) : null}
            {resolvedSectionCtaLabel && resolvedSectionCtaUrl ? (
              <SectionCta href={resolvedSectionCtaUrl} isArabic={isArabic}>
                {resolvedSectionCtaLabel}
              </SectionCta>
            ) : null}
          </motion.div>
        ) : null}

        {products.length > 0 ? (
          <>
            <div className={gridClassName}>
              {visibleProducts.map((product, index) => {
                const features = getFeatures(product, isArabic)
                const ribbonText = isArabic ? product.badge_text_ar || product.badge_text_en : product.badge_text_en || product.badge_text_ar
                const productTitle = isArabic ? product.title_ar || product.title_en : product.title_en || product.title_ar
                const productDescription = isArabic
                  ? product.short_description_ar || product.subtitle_ar || product.short_description_en || product.subtitle_en
                  : product.short_description_en || product.subtitle_en || product.short_description_ar || product.subtitle_ar
                const isScalp = category === 'scalp' || product.type === 'scalp'
                const action = resolveCardAction(product, isScalp)

                const compactScalp = isScalp
                const ctaLabel = getCardCtaLabel(product, isScalp, isArabic)
                const visibleFeatures = features.slice(0, compactScalp ? 2 : 3)
                const detailItems = getCardDetailItems(product, isArabic).slice(0, 3)
                const secondaryLinks = isScalp ? [] : getVisibleImportantLinks(product, isArabic).slice(0, 2)
                const singleCard = visibleProducts.length === 1
                const showMobileRibbon = Boolean(ribbonText && !isOffers)
                const comparePrice = Number(product.compare_price || 0)
                const currentPrice = Number(product.price || 0)
                const showComparePrice = comparePrice > 0 && comparePrice > currentPrice

                return (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className={`service-product-card group relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-hunter-bg p-[4.5%] shadow-[0_18px_44px_rgba(0,0,0,0.18)] sm:h-full sm:rounded-[2rem] sm:p-4 sm:shadow-[0_24px_60px_rgba(0,0,0,0.16)] ${
                      singleCard ? 'service-product-card-single mx-auto w-full' : ''
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
                        {showMobileRibbon ? (
                          <div
                            className="service-card-ribbon absolute right-[7%] top-[5%] z-20 max-w-[50%] truncate rounded-full border border-white/10 px-[0.75em] py-[0.25em] text-center font-bold text-hunter-text shadow-lg backdrop-blur-sm sm:hidden"
                            style={{
                              background: 'linear-gradient(180deg, color-mix(in srgb, var(--product-accent) 82%, var(--bg-secondary) 18%) 0%, color-mix(in srgb, var(--product-accent-strong) 82%, var(--bg-secondary) 18%) 100%)',
                            }}
                          >
                            {ribbonText}
                          </div>
                        ) : null}
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

                    <div className={`service-product-card-shell relative z-10 flex min-w-0 flex-col rounded-2xl border p-[6%] sm:h-full sm:rounded-[1.65rem] sm:p-5 ${showMobileRibbon ? 'pt-[20%] sm:pt-5' : ''}`}>
                      <div className={`mb-[7%] flex min-w-0 flex-wrap items-center gap-[4%] sm:mb-4 sm:gap-3 ${isOffers ? 'justify-center sm:justify-between' : 'justify-center'}`}>
                        {isOffers ? (
                          <>
                            {product.offer_ends_at ? <OfferCountdown value={product.offer_ends_at} isArabic={isArabic} /> : <TopChip icon={Icon}>{resolvedBadgeLabel}</TopChip>}
                            <TopChip icon={Icon} className="hidden sm:inline-flex">{resolvedBadgeLabel}</TopChip>
                          </>
                        ) : (
                          <TopChip icon={Icon}>{resolvedBadgeLabel}</TopChip>
                        )}
                      </div>

                      <div
                        className="service-product-card-media relative mb-[8%] overflow-hidden rounded-xl border shadow-[0_10px_26px_rgba(0,0,0,0.18)] sm:mb-5 sm:rounded-[1.3rem]"
                      >
                        <ProductCardMedia product={product} title={productTitle} compact />
                      </div>

                      <div className={centerCardContent ? 'text-center' : 'text-center sm:text-start'}>
                        <h3 className="service-card-title break-words font-heading font-bold sm:text-2xl">{productTitle}</h3>
                        {productDescription ? (
                          <p className="service-card-description mx-auto mt-[5%] line-clamp-2 max-w-md whitespace-pre-line text-hunter-text-muted sm:mt-3 sm:min-h-[3.4rem] sm:mx-0">
                            {productDescription}
                          </p>
                        ) : null}
                        {isScalp ? (
                          <div className="service-card-feature mt-[6%] inline-flex rounded-full border border-white/10 bg-white/5 px-[0.85em] py-[0.45em] font-semibold text-hunter-text-muted sm:mt-3 sm:px-3 sm:py-1 sm:text-xs">
                            {ribbonText}
                          </div>
                        ) : (
                          <div className="mt-[6%] sm:mt-3">
                            {showComparePrice ? (
                              <div className="service-card-compare-price font-semibold text-hunter-text-muted line-through">
                                {formatMoney(product.compare_price, product.currency)}
                              </div>
                            ) : null}
                            <div className="service-card-price font-heading font-bold sm:text-4xl" style={{ color: 'var(--product-accent)' }}>
                              {formatMoney(product.price, product.currency)}
                            </div>
                          </div>
                        )}
                      </div>

                      {visibleFeatures.length > 0 ? (
                        <div className={`mt-[9%] space-y-[0.55em] sm:mt-5 sm:space-y-3 ${centerCardContent ? 'mx-auto max-w-md' : ''}`}>
                          {visibleFeatures.map((feature, featureIndex) => (
                            <div
                              key={`${product.id}-feature-${featureIndex}`}
                              className={`service-card-feature ${featureIndex > 1 ? 'hidden sm:flex' : 'flex'} items-start gap-[0.45em] rounded-lg border border-white/10 bg-white/[0.03] px-[0.75em] py-[0.55em] text-hunter-text-muted sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm sm:leading-6 ${centerCardContent ? 'justify-center text-center' : ''}`}
                            >
                              <CheckCircle2 className="mt-[0.2em] h-[1.05em] w-[1.05em] shrink-0 sm:h-4 sm:w-4" style={{ color: 'var(--product-accent)' }} />
                              <span className="line-clamp-2">{feature}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {detailItems.length > 0 ? (
                        <div className={`mt-[7%] grid gap-[0.45em] sm:mt-4 sm:gap-2 ${centerCardContent ? 'mx-auto max-w-md' : ''}`}>
                          {detailItems.map((item, itemIndex) => (
                            <div
                              key={`${product.id}-detail-${itemIndex}`}
                              className="service-card-meta flex min-w-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.025] px-[0.75em] py-[0.5em] text-center font-semibold text-hunter-text-muted sm:rounded-xl"
                            >
                              <span className="line-clamp-1">{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {secondaryLinks.length > 0 ? (
                        <div className="mt-[7%] grid min-w-0 gap-[0.45em] sm:mt-4 sm:gap-2">
                          {secondaryLinks.map((link, linkIndex) => (
                            <CardSecondaryLink key={`${product.id}-link-${linkIndex}-${link.url}`} link={link} isArabic={isArabic} />
                          ))}
                        </div>
                      ) : null}

                      <div className={`flex min-w-0 pt-[10%] sm:mt-auto sm:pt-6 ${isScalp ? 'justify-center' : 'gap-[5%] sm:gap-3'}`}>
                        {ctaLabel ? (
                        <CardAction
                          action={action}
                          className={`service-card-cta inline-flex min-w-0 items-center justify-center gap-[0.45em] rounded-xl px-[7%] py-[6%] text-center font-semibold text-hunter-bg transition hover:-translate-y-0.5 sm:min-h-12 sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base ${
                            isScalp ? 'w-full max-w-[14rem] flex-none' : 'flex-1'
                          }`}
                          style={{
                            background: 'linear-gradient(180deg, var(--product-accent) 0%, var(--product-accent-strong) 100%)',
                            boxShadow: '0 10px 22px color-mix(in srgb, var(--product-accent) 14%, transparent)',
                          }}
                        >
                          <span className="min-w-0 truncate whitespace-nowrap leading-tight">{ctaLabel}</span>
                          <ArrowRight className="hidden h-[1em] w-[1em] shrink-0 rtl:rotate-180 min-[390px]:block sm:block sm:h-4 sm:w-4" />
                        </CardAction>
                        ) : null}
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>

            {showExpandToggle && products.length > 3 && (showAll ? collapseLabel : expandLabel) ? (
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
        ) : null}
      </div>
    </section>
  )
}
