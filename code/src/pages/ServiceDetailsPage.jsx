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

function isVideoUrl(url = '') {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url)
}

function normalizeExternalUrl(url = '') {
  const trimmed = String(url).trim()
  if (!trimmed) return '#'
  if (/^(https?:|mailto:|tel:|sms:|whatsapp:|tg:|#|\/)/i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function sortedLinks(links = []) {
  return [...links].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
}

function textValue(item = {}, isArabic, arKey, enKey) {
  return isArabic ? item[arKey] || item[enKey] : item[enKey] || item[arKey]
}

function ServiceMediaViewer({ service, title }) {
  const hasCoverMedia = Boolean(service.cover_url)
  const explicitMediaUrl = hasCoverMedia ? service.cover_url : service.card_media_url || ''
  const explicitMediaType = hasCoverMedia ? service.cover_media_type : service.card_media_type
  const mediaType = explicitMediaType || (isVideoUrl(explicitMediaUrl) ? 'video' : 'image')
  const fallbackImageUrl = service.thumbnail_url || ''
  const mediaUrl = explicitMediaUrl || fallbackImageUrl
  const posterUrl = service.cover_video_poster_url || service.card_video_poster_url || service.thumbnail_url || ''

  if (mediaType === 'video' && explicitMediaUrl) {
    return (
      <video
        src={explicitMediaUrl}
        poster={posterUrl || undefined}
        className="h-full w-full object-cover"
        controls
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
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  if (mediaUrl) {
    return <img src={mediaUrl} alt={title} className="h-full w-full object-cover" />
  }

  return (
    <div className="flex h-full min-h-[260px] items-center justify-center bg-white/5 text-hunter-green">
      <Tag className="h-16 w-16" />
    </div>
  )
}

function GalleryItem({ item, title }) {
  if (item.media_type === 'video' || isVideoUrl(item.media_url)) {
    return <video src={item.media_url} className="h-56 w-full rounded-2xl object-cover" controls playsInline preload="metadata" />
  }

  if (item.media_type === 'embed') {
    return <iframe src={item.media_url} title={title} className="h-56 w-full rounded-2xl" loading="lazy" allowFullScreen />
  }

  return <img src={item.media_url} alt={title} className="h-56 w-full rounded-2xl object-cover" loading="lazy" />
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
  if (/فتح|open/i.test(raw)) return raw
  return isArabic ? `فتح حساب في ${raw}` : `Open account in ${raw}`
}

function ScalpPlatformButtons({ links, isArabic, id }) {
  const displayLinks = links.length > 0
    ? sortedLinks(links)
    : [
        { label_en: 'GTC', label_ar: 'GTC', url: '', sort_order: 1 },
        { label_en: 'Valtex', label_ar: 'Valtex', url: '', sort_order: 2 },
      ]

  return (
    <div id={id} className="grid grid-cols-2 gap-3 sm:gap-4">
      {displayLinks.map((link, index) => {
        const hasUrl = Boolean(String(link.url || '').trim())
        const label = platformButtonLabel(link, isArabic, index)
        const Wrapper = hasUrl ? 'a' : 'div'
        const wrapperProps = hasUrl
          ? {
              href: normalizeExternalUrl(link.url),
              target: link.new_tab === false ? undefined : '_blank',
              rel: link.new_tab === false ? undefined : 'noreferrer',
            }
          : {}

        return (
          <Wrapper
            key={`${link.url}-${index}`}
            {...wrapperProps}
            className={`inline-flex min-h-[3.6rem] min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-3 text-center text-sm font-bold text-white shadow-[0_12px_30px_rgba(160,45,255,0.28)] transition sm:text-base ${
              hasUrl
                ? 'bg-gradient-to-l from-blue-500 via-violet-500 to-fuchsia-600 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(160,45,255,0.4)]'
                : 'border border-dashed border-white/15 bg-white/5 text-slate-400'
            }`}
          >
            <ArrowLeft className="h-4 w-4 shrink-0 rtl:rotate-180" />
            <span className="min-w-0 leading-snug">
              {hasUrl ? label : `${label.replace(/^فتح حساب في\s+/u, '').replace(/^Open account in\s+/i, '')} ${isArabic ? '- أضف الرابط' : '- Add link'}`}
            </span>
          </Wrapper>
        )
      })}
    </div>
  )
}

function ScalpFeatureGrid({ features, isArabic }) {
  const icons = [Zap, Gauge, Headphones, ShieldCheck]
  const fallback = [
    { label_ar: 'فروق أسعار منخفضة من 0.3 نقطة', label_en: 'Low spreads from 0.3 points' },
    { label_ar: 'تنفيذ سريع أقل من 50 مللي ثانية', label_en: 'Fast execution under 50ms' },
    { label_ar: 'دعم عملاء على مدار الساعة', label_en: '24/7 customer support' },
    { label_ar: 'وسيط مرخص وآمن', label_en: 'Licensed and secure broker' },
  ]
  const items = features.length > 0 ? features : fallback

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
  const fallback = [
    { title_ar: 'اختر المنصة التي تفضلها', title_en: 'Choose your preferred platform' },
    { title_ar: 'سجل بياناتك', title_en: 'Register your details' },
    { title_ar: 'قم بالإيداع في حسابك', title_en: 'Fund your account' },
    { title_ar: 'تواصل معي بعد التسجيل للانضمام لقناة السكالب', title_en: 'Contact me after registration to join the scalp channel' },
  ]
  const items = steps.length > 0 ? steps : fallback

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
  const gallery = Array.isArray(service.media) ? service.media.filter((item) => item.media_url) : []
  const importantLinks = Array.isArray(service.important_links) ? service.important_links.filter((item) => item.url) : []
  const hasMainMedia = Boolean(service.cover_url || service.card_media_url || service.thumbnail_url)
  const hasExtraExplanation = hasMainMedia || gallery.length > 0 || Boolean(content.termsContent)

  return (
    <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {isArabic ? 'العودة للرئيسية' : 'Back to home'}
        </Link>

        <section className="mt-12 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center" dir="ltr">
          <div className="order-2 lg:order-1" dir={isArabic ? 'rtl' : 'ltr'}>
            <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">{isArabic ? 'كيف تبدأ' : 'How to start'}</h2>
            <div className="mt-6">
              <ScalpSteps steps={steps} isArabic={isArabic} />
            </div>
            {content.riskWarning ? (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-hunter-text-muted">
                <ShieldAlert className="h-5 w-5 shrink-0 text-fuchsia-500" />
                <span>{content.riskWarning}</span>
              </div>
            ) : null}
          </div>

          <div className="order-1 lg:order-2" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="mx-auto max-w-2xl text-center lg:text-right">
              <div className="mb-4 inline-flex rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-1 text-sm font-semibold text-fuchsia-300">
                Scalp
              </div>
              <h1 className="font-heading text-4xl font-bold sm:text-5xl">{content.title || 'Scalp'}</h1>
              {content.subtitle || content.description ? (
                <p className="mt-5 text-lg leading-9 text-hunter-text-muted">
                  {content.subtitle || content.description}
                </p>
              ) : null}
            </div>

            <div className="mt-8">
              <ScalpFeatureGrid features={features} isArabic={isArabic} />
            </div>

            <div className="mx-auto mt-8 max-w-xl">
              <ScalpPlatformButtons links={importantLinks} isArabic={isArabic} id="platform-links" />
            </div>
          </div>
        </section>

        {hasMainMedia ? (
          <section className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-hunter-card shadow-2xl shadow-black/20">
            <div className="aspect-video min-h-[260px]">
              <ServiceMediaViewer service={service} title={content.title} />
            </div>
          </section>
        ) : null}

        {content.termsContent ? (
          <section className="mt-8 rounded-[2rem] border border-white/10 bg-hunter-card p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold">{content.termsTitle || (isArabic ? 'الشروط والتنبيهات' : 'Terms and notes')}</h2>
            <p className="mt-4 whitespace-pre-wrap leading-8 text-hunter-text-muted">{content.termsContent}</p>
          </section>
        ) : null}

        {gallery.length > 0 ? (
          <section className="mt-8 rounded-[2rem] border border-white/10 bg-hunter-card p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold">{isArabic ? 'شرح إضافي' : 'Extra explanation'}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {gallery.map((item) => <GalleryItem key={item.id || item.media_url} item={item} title={content.title} />)}
            </div>
          </section>
        ) : null}

        {hasExtraExplanation ? (
          <section className="mt-8 rounded-[2rem] border border-white/10 bg-hunter-card p-6 text-center sm:p-8">
          <h2 className="font-heading text-2xl font-bold">{isArabic ? 'اختار المنصة المناسبة' : 'Choose your platform'}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-hunter-text-muted">
            {isArabic
              ? 'السكالب لا يتم دفعه من الموقع. اقرأ الشرح ثم افتح حسابك من رابط الريفيرال المناسب.'
              : 'Scalp is not paid through the website. Review the explanation, then open your account from the right referral link.'}
          </p>
            <div className="mx-auto mt-6 max-w-xl">
              <ScalpPlatformButtons links={importantLinks} isArabic={isArabic} />
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
  const importantLinks = Array.isArray(service.important_links) ? service.important_links.filter((item) => item.url) : []
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
