import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Gauge,
  Headphones,
  Link2,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Zap,
} from 'lucide-react'
import { servicesAPI, settingsAPI } from '../api'
import useApiData from '../hooks/useApiData'
import SmartMedia from '../components/ui/SmartMedia'
import { getSafePosterUrl, resolveMediaType } from '../utils/media'

function normalizeExternalUrl(url = '') {
  const trimmed = String(url).trim()
  if (!trimmed) return '#'
  if (/^(https?:|mailto:|tel:|sms:|whatsapp:|tg:|#|\/)/i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function sortedLinks(links = []) {
  return [...links].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
}

function visibleLinks(links = []) {
  return sortedLinks(links).filter((link) => link && link.is_visible !== false && String(link.url || '').trim())
}

function textValue(item = {}, isArabic, arKey, enKey) {
  return isArabic ? item[arKey] || item[enKey] : item[enKey] || item[arKey]
}

function asBool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback
  return value === true || value === 1 || value === '1'
}

function ServiceMediaViewer({ service, title, fit = 'cover' }) {
  const hasCoverMedia = Boolean(service.cover_url)
  const explicitMediaUrl = hasCoverMedia ? service.cover_url : service.card_media_url || ''
  const explicitMediaType = hasCoverMedia ? service.cover_media_type : service.card_media_type
  const posterUrl = getSafePosterUrl(service.cover_video_poster_url, service.card_video_poster_url, service.thumbnail_url)
  const fallbackImageUrl = service.thumbnail_url || posterUrl || ''
  const mediaUrl = explicitMediaUrl || fallbackImageUrl
  const mediaType = resolveMediaType(mediaUrl, explicitMediaType || 'image')
  const mediaAutoPlay = hasCoverMedia
    ? asBool(service.cover_video_autoplay, true)
    : asBool(service.card_video_autoplay, true)
  const mediaMuted = hasCoverMedia
    ? asBool(service.cover_video_muted, true)
    : asBool(service.card_video_muted, true)
  const mediaLoop = hasCoverMedia
    ? asBool(service.cover_video_loop, true)
    : asBool(service.card_video_loop, true)
  const mediaControls = hasCoverMedia
    ? asBool(service.cover_video_controls, false)
    : asBool(service.card_video_controls, false)

  const objectFitClassName = fit === 'contain' ? 'object-contain bg-black/20' : 'object-cover'

  if (mediaUrl) {
    const posterFallback = posterUrl ? (
      <img src={posterUrl} alt={title} className={`h-full w-full ${objectFitClassName}`} loading="lazy" />
    ) : null

    return (
      <SmartMedia
        src={mediaUrl}
        type={mediaType}
        alt={title}
        poster={posterUrl}
        className={`h-full w-full ${objectFitClassName}`}
        iframeClassName="h-full w-full"
        autoPlay={mediaAutoPlay}
        muted={mediaMuted}
        loop={mediaLoop}
        controls={mediaControls}
        fallback={posterFallback}
        showPosterBeforePlay={Boolean(posterUrl && !mediaAutoPlay)}
      />
    )
  }

  return (
    <div className="flex h-full min-h-[260px] items-center justify-center bg-white/5 text-hunter-green">
      <Tag className="h-16 w-16" />
    </div>
  )
}

function GalleryItem({ item, title }) {
  const mediaType = resolveMediaType(item.media_url, item.media_type || 'image')

  return (
    <SmartMedia
      src={item.media_url}
      type={mediaType}
      alt={title}
      className="h-56 w-full rounded-2xl object-cover"
      iframeClassName="h-56 w-full rounded-2xl"
      autoPlay
      muted
      loop
      controls={false}
    />
  )
}

function resolveFinalAction(service, general = {}) {
  const action = service.cta_action || (service.type === 'scalp' ? 'details' : 'checkout')

  if (service.type === 'scalp') {
    return { href: '#platform-links', external: false }
  }

  if (action === 'checkout') return { href: `/checkout/${service.slug}`, external: false }
  if (action === 'referral') return { href: normalizeExternalUrl(service.referral_url || service.cta_url || service.broker_url || '#'), external: true }
  if (action === 'external') return { href: normalizeExternalUrl(service.cta_url || service.referral_url || '#'), external: true }
  if (action === 'whatsapp') return { href: normalizeExternalUrl(service.cta_url || general.whatsapp_url?.value || '#'), external: true }
  if (action === 'telegram') return { href: normalizeExternalUrl(service.cta_url || general.telegram_url?.value || general.free_telegram_url?.value || '#'), external: true }

  return { href: `/checkout/${service.slug}`, external: false }
}

function FinalCTA({ service, general, isArabic }) {
  const action = resolveFinalAction(service, general)
  const label = isArabic
    ? service.final_cta_label_ar || service.cta_label_ar || 'متابعة'
    : service.final_cta_label_en || service.cta_label_en || 'Continue'
  const className = "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-hunter-green px-6 py-4 font-semibold text-hunter-bg transition hover:bg-hunter-green/90 sm:w-auto"

  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noreferrer" className={className}>
        <span>{label}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    )
  }

  return (
    <Link to={action.href} className={className}>
      <span>{label}</span>
      <ExternalLink className="h-4 w-4" />
    </Link>
  )
}

function platformButtonLabel(link, isArabic, index) {
  const raw = textValue(link, isArabic, 'label_ar', 'label_en') || (index === 0 ? 'GTC' : 'Valtex')
  const buttonContext = `${raw} ${link.url || ''}`.toLowerCase()
  if (/telegram|t\.me|whatsapp|wa\.me|join/i.test(buttonContext) || /تليجرام|تلجرام|واتساب|انضم/.test(raw)) {
    return raw
  }
  if (/فتح|open/i.test(raw)) return raw
  if (/^(gtc|valtex|valetex)$/i.test(String(raw).trim())) {
    return isArabic ? `فتح حساب في ${raw}` : `Open account in ${raw}`
  }
  return raw
}

function getActionButtonStyle(link = {}) {
  const text = `${link.label_en || ''} ${link.label_ar || ''} ${link.url || ''}`.toLowerCase()
  if (text.includes('telegram') || text.includes('t.me')) {
    return 'from-sky-500 via-cyan-500 to-blue-600 shadow-[0_12px_30px_rgba(14,165,233,0.25)] hover:shadow-[0_16px_38px_rgba(14,165,233,0.38)]'
  }
  if (text.includes('whatsapp') || text.includes('wa.me')) {
    return 'from-emerald-500 via-green-500 to-teal-600 shadow-[0_12px_30px_rgba(34,197,94,0.22)] hover:shadow-[0_16px_38px_rgba(34,197,94,0.35)]'
  }
  if (text.includes('valtex')) {
    return 'from-violet-500 via-blue-500 to-cyan-500 shadow-[0_12px_30px_rgba(99,102,241,0.24)] hover:shadow-[0_16px_38px_rgba(99,102,241,0.36)]'
  }
  return 'from-fuchsia-600 via-violet-500 to-blue-500 shadow-[0_12px_30px_rgba(160,45,255,0.26)] hover:shadow-[0_16px_38px_rgba(160,45,255,0.4)]'
}

function ScalpActionButtons({ links, service, isArabic, id }) {
  const displayLinks = visibleLinks(links)
  const fallbackLinks = displayLinks.length > 0
    ? displayLinks
    : service.referral_url
      ? [{
          label_en: service.final_cta_label_en || service.cta_label_en || service.broker_name || 'Open account',
          label_ar: service.final_cta_label_ar || service.cta_label_ar || service.broker_name || 'فتح الحساب',
          url: service.referral_url,
          new_tab: true,
          sort_order: 1,
        }]
      : []

  return (
    <div id={id} className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      {fallbackLinks.map((link, index) => {
        const label = platformButtonLabel(link, isArabic, index)
        const styleClassName = getActionButtonStyle(link)

        return (
          <a
            key={`${link.url}-${index}`}
            href={normalizeExternalUrl(link.url)}
            target={link.new_tab === false ? undefined : '_blank'}
            rel={link.new_tab === false ? undefined : 'noreferrer'}
            className={`inline-flex min-h-[3.65rem] min-w-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l px-4 py-3 text-center text-sm font-bold text-white transition hover:-translate-y-0.5 sm:text-base ${styleClassName}`}
          >
            <span className="min-w-0 leading-snug">{label}</span>
            <ExternalLink className="h-4 w-4 shrink-0" />
          </a>
        )
      })}
    </div>
  )
}

function ScalpFeatureGrid({ features, isArabic }) {
  const icons = [Zap, Gauge, Headphones, ShieldCheck]
  const items = features.filter((feature) => textValue(feature, isArabic, 'label_ar', 'label_en'))

  if (items.length === 0) {
    return null
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.slice(0, 4).map((feature, index) => {
        const Icon = icons[index % icons.length]
        return (
          <div key={feature.id || `${feature.label_en}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <span className="text-sm font-semibold leading-6 text-hunter-text sm:text-base">
              {textValue(feature, isArabic, 'label_ar', 'label_en')}
            </span>
            <Icon className="h-5 w-5 shrink-0 text-fuchsia-500" />
          </div>
        )
      })}
    </div>
  )
}

function ScalpSteps({ steps, isArabic }) {
  const items = steps.filter((step) => (
    textValue(step, isArabic, 'title_ar', 'title_en') ||
    textValue(step, isArabic, 'description_ar', 'description_en')
  ))

  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {items.map((step, index) => (
        <div key={step.id || index} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 to-blue-500 font-bold text-white">
            {index + 1}
          </span>
          <div className="min-w-0">
            <div className="font-semibold leading-7 text-hunter-text">{textValue(step, isArabic, 'title_ar', 'title_en')}</div>
            {textValue(step, isArabic, 'description_ar', 'description_en') ? (
              <div className="mt-1 text-sm leading-6 text-hunter-text-muted">{textValue(step, isArabic, 'description_ar', 'description_en')}</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

function ScalpDetailsLayout({ service, content, isArabic }) {
  const features = Array.isArray(service.features) ? service.features : []
  const steps = Array.isArray(service.steps) ? service.steps : []
  const faqs = Array.isArray(service.faqs) ? service.faqs : []
  const gallery = Array.isArray(service.media) ? service.media.filter((item) => item.media_url) : []
  const importantLinks = Array.isArray(service.important_links) ? service.important_links : []
  const hasFeatures = features.some((feature) => textValue(feature, isArabic, 'label_ar', 'label_en'))
  const hasSteps = steps.some((step) => (
    textValue(step, isArabic, 'title_ar', 'title_en') ||
    textValue(step, isArabic, 'description_ar', 'description_en')
  ))
  const hasPlatformLinks = visibleLinks(importantLinks).length > 0 || Boolean(service.referral_url)
  const hasMainMedia = Boolean(service.cover_url || service.card_media_url || service.thumbnail_url || service.cover_video_poster_url || service.card_video_poster_url)

  return (
    <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {isArabic ? 'العودة للرئيسية' : 'Back to home'}
        </Link>

        <section className="mx-auto mt-8 max-w-4xl text-center sm:mt-10">
          {content.title ? (
            <h1 className="font-heading text-3xl font-bold leading-tight sm:text-5xl">
              {content.title}
            </h1>
          ) : null}
          {content.subtitle || content.description ? (
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-hunter-text-muted sm:text-lg sm:leading-9">
              {content.subtitle || content.description}
            </p>
          ) : null}
        </section>

        {hasMainMedia ? (
          <section className="mx-auto mt-7 max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-hunter-card shadow-2xl shadow-black/20 sm:mt-8">
            <div className="aspect-video min-h-[190px] bg-black/20 sm:min-h-[280px]">
              <ServiceMediaViewer service={service} title={content.title} fit="contain" />
            </div>
          </section>
        ) : null}

        <section className={`mx-auto mt-7 grid max-w-5xl gap-5 ${hasSteps ? 'lg:grid-cols-[1.05fr_0.95fr]' : ''}`}>
          <div className="rounded-[2rem] border border-white/10 bg-hunter-card p-5 sm:p-7">
            <h2 className="font-heading text-2xl font-bold">{isArabic ? 'الشرح والتفاصيل' : 'Explanation and details'}</h2>
            {content.description ? (
              <p className="mt-4 whitespace-pre-wrap leading-8 text-hunter-text-muted">{content.description}</p>
            ) : null}

            {hasFeatures ? (
            <div className="mt-6">
              <ScalpFeatureGrid features={features} isArabic={isArabic} />
            </div>
            ) : null}

            {content.riskWarning ? (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-4 text-sm leading-7 text-hunter-text-muted">
                <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-fuchsia-400" />
                <span>{content.riskWarning}</span>
              </div>
            ) : null}
          </div>

          {hasSteps ? (
          <div className="rounded-[2rem] border border-white/10 bg-hunter-card p-5 sm:p-7">
            <h2 className="font-heading text-2xl font-bold">{isArabic ? 'خطوات البدء' : 'How to start'}</h2>
            <div className="mt-5">
              <ScalpSteps steps={steps} isArabic={isArabic} />
            </div>
          </div>
          ) : null}
        </section>

        {content.termsContent ? (
          <section className="mx-auto mt-7 max-w-5xl rounded-[2rem] border border-white/10 bg-hunter-card p-5 sm:p-7">
            <h2 className="font-heading text-2xl font-bold">{content.termsTitle || (isArabic ? 'الشروط والتنبيهات' : 'Terms and notes')}</h2>
            <p className="mt-4 whitespace-pre-wrap leading-8 text-hunter-text-muted">{content.termsContent}</p>
          </section>
        ) : null}

        {gallery.length > 0 ? (
          <section className="mx-auto mt-7 max-w-5xl rounded-[2rem] border border-white/10 bg-hunter-card p-5 sm:p-7">
            <h2 className="font-heading text-2xl font-bold">{isArabic ? 'معرض الوسائط' : 'Media gallery'}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <GalleryItem key={item.id || item.media_url} item={item} title={textValue(item, isArabic, 'alt_text_ar', 'alt_text_en') || content.title} />
              ))}
            </div>
          </section>
        ) : null}

        {faqs.length > 0 ? (
          <section className="mx-auto mt-7 max-w-5xl rounded-[2rem] border border-white/10 bg-hunter-card p-5 sm:p-7">
            <h2 className="font-heading text-2xl font-bold">{isArabic ? 'الأسئلة الشائعة' : 'FAQs'}</h2>
            <div className="mt-5 space-y-3">
              {faqs.map((faq) => (
                <details key={faq.id || faq.question_en || faq.question_ar} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <summary className="cursor-pointer font-semibold leading-7">
                    {textValue(faq, isArabic, 'question_ar', 'question_en')}
                  </summary>
                  {textValue(faq, isArabic, 'answer_ar', 'answer_en') ? (
                    <p className="mt-3 whitespace-pre-wrap leading-7 text-hunter-text-muted">
                      {textValue(faq, isArabic, 'answer_ar', 'answer_en')}
                    </p>
                  ) : null}
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {hasPlatformLinks ? (
        <section id="platform-links" className="mx-auto mt-7 max-w-5xl rounded-[2rem] border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 via-hunter-card to-blue-500/10 p-5 text-center sm:p-7">
          <h2 className="font-heading text-2xl font-bold">{isArabic ? 'افتح الحساب أو انضم للمتابعة' : 'Open account or join follow-up'}</h2>
          <div className="mx-auto mt-6 max-w-2xl">
            <ScalpActionButtons links={importantLinks} service={service} isArabic={isArabic} />
          </div>
        </section>
        ) : null}
      </main>
    </div>
  )
}

export default function ServiceDetailsPage() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { data: service } = useApiData(
    () => (slug ? servicesAPI.getBySlug(slug) : servicesAPI.getAll('scalp')),
    null,
    (response) => (slug ? response.data ?? null : (response.data ?? [])[0] ?? null),
    [slug]
  )
  const { data: settings } = useApiData(settingsAPI.getPublic, {}, (response) => response.data ?? {})
  const general = settings.general ?? {}

  const content = useMemo(() => {
    if (!service) return null
    const title = textValue(service, isArabic, 'title_ar', 'title_en')
    return {
      title,
      subtitle: textValue(service, isArabic, 'subtitle_ar', 'subtitle_en'),
      description: isArabic
        ? service.full_description_ar || service.short_description_ar || service.full_description_en
        : service.full_description_en || service.short_description_en || service.full_description_ar,
      termsTitle: textValue(service, isArabic, 'terms_title_ar', 'terms_title_en'),
      termsContent: textValue(service, isArabic, 'terms_content_ar', 'terms_content_en'),
      riskWarning: textValue(service, isArabic, 'risk_warning_ar', 'risk_warning_en'),
    }
  }, [isArabic, service])

  if (!service || !content) {
    return (
      <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
            <ArrowLeft className="h-4 w-4" />
            {isArabic ? 'العودة للرئيسية' : 'Back to home'}
          </Link>
        </div>
      </div>
    )
  }

  if (service.type === 'scalp') {
    return <ScalpDetailsLayout service={service} content={content} isArabic={isArabic} />
  }

  const features = Array.isArray(service.features) ? service.features : []
  const steps = Array.isArray(service.steps) ? service.steps : []
  const faqs = Array.isArray(service.faqs) ? service.faqs : []
  const gallery = Array.isArray(service.media) ? service.media.filter((item) => item.media_url) : []
  const importantLinks = Array.isArray(service.important_links) ? visibleLinks(service.important_links) : []
  const orderedImportantLinks = sortedLinks(importantLinks)

  return (
    <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {isArabic ? 'العودة للرئيسية' : 'Back to home'}
        </Link>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-hunter-card shadow-2xl shadow-black/20">
            <div className="aspect-[16/11] min-h-[280px]">
              <ServiceMediaViewer service={service} title={content.title} />
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[2rem] border border-white/10 bg-hunter-card p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-hunter-green/20 bg-hunter-green/10 px-3 py-1 text-sm font-semibold text-hunter-green">
              {service.type}
            </div>
            <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">{content.title}</h1>
            {content.subtitle ? <p className="mt-4 text-lg leading-8 text-hunter-text-muted">{content.subtitle}</p> : null}
            <div className="mt-6 flex flex-wrap items-end gap-3">
              <div className="font-heading text-4xl font-bold text-hunter-green">
                {service.currency === 'USD' ? '$' : `${service.currency || ''} `}{Number(service.price || 0).toFixed(0)}
              </div>
              {service.compare_price ? <div className="pb-1 text-xl text-hunter-text-muted line-through">${Number(service.compare_price).toFixed(0)}</div> : null}
            </div>
            <div className="mt-7">
              <FinalCTA service={service} general={general} isArabic={isArabic} />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            {content.description ? (
              <div className="rounded-[2rem] border border-white/10 bg-hunter-card p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-bold">{isArabic ? 'التفاصيل' : 'Details'}</h2>
                <p className="mt-4 whitespace-pre-wrap leading-8 text-hunter-text-muted">{content.description}</p>
              </div>
            ) : null}

            {features.length > 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-hunter-card p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-bold">{isArabic ? 'المميزات' : 'Features'}</h2>
                <div className="mt-5 grid gap-3">
                  {features.map((feature) => (
                    <div key={feature.id || feature.label_en} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-hunter-green" />
                      <span className="leading-7 text-hunter-text-muted">{textValue(feature, isArabic, 'label_ar', 'label_en')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {content.termsContent || content.riskWarning ? (
              <div className="rounded-[2rem] border border-hunter-orange/20 bg-hunter-card p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-bold">{content.termsTitle || (isArabic ? 'الشروط والتنبيهات' : 'Terms and notes')}</h2>
                {content.termsContent ? <p className="mt-4 whitespace-pre-wrap leading-8 text-hunter-text-muted">{content.termsContent}</p> : null}
                {content.riskWarning ? (
                  <div className="mt-5 flex gap-3 rounded-2xl border border-hunter-orange/20 bg-hunter-orange/10 p-4 text-hunter-text-muted">
                    <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-hunter-orange" />
                    <span className="leading-7">{content.riskWarning}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            {steps.length > 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-hunter-card p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-bold">{isArabic ? 'الخطوات' : 'Steps'}</h2>
                <div className="mt-5 space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.id || index} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm font-semibold text-hunter-green">{String(index + 1).padStart(2, '0')}</div>
                      <h3 className="mt-2 font-heading text-xl font-bold">{textValue(step, isArabic, 'title_ar', 'title_en')}</h3>
                      <p className="mt-2 leading-7 text-hunter-text-muted">{textValue(step, isArabic, 'description_ar', 'description_en')}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {importantLinks.length > 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-hunter-card p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-bold">{isArabic ? 'روابط مهمة' : 'Important links'}</h2>
                <div className="mt-5 grid gap-3">
                  {orderedImportantLinks.map((link) => (
                    <a key={`${link.url}-${link.label_en}`} href={normalizeExternalUrl(link.url)} target={link.new_tab === false ? undefined : '_blank'} rel={link.new_tab === false ? undefined : 'noreferrer'} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-hunter-text-muted transition hover:border-hunter-green hover:text-hunter-green">
                      <span>{textValue(link, isArabic, 'label_ar', 'label_en')}</span>
                      <Link2 className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {faqs.length > 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-hunter-card p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-bold">{isArabic ? 'أسئلة شائعة' : 'FAQs'}</h2>
                <div className="mt-5 space-y-3">
                  {faqs.map((faq) => (
                    <details key={faq.id || faq.question_en} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <summary className="cursor-pointer font-semibold">{textValue(faq, isArabic, 'question_ar', 'question_en')}</summary>
                      <p className="mt-3 leading-7 text-hunter-text-muted">{textValue(faq, isArabic, 'answer_ar', 'answer_en')}</p>
                    </details>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {gallery.length > 0 ? (
          <section className="mt-8 rounded-[2rem] border border-white/10 bg-hunter-card p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold">{isArabic ? 'المعرض' : 'Gallery'}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {gallery.map((item) => <GalleryItem key={item.id || item.media_url} item={item} title={content.title} />)}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
