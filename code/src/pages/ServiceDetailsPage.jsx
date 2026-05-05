import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, CheckCircle2, ExternalLink, Link2, ShieldAlert, Tag } from 'lucide-react'
import { servicesAPI, settingsAPI } from '../api'
import useApiData from '../hooks/useApiData'

function isVideoUrl(url = '') {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url)
}

function ServiceMediaViewer({ service, title }) {
  const explicitMediaUrl = service.cover_url || service.card_media_url || ''
  const mediaType = service.cover_media_type || service.card_media_type || (isVideoUrl(explicitMediaUrl) ? 'video' : 'image')
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
  const action = service.cta_action || (service.type === 'scalp' ? 'referral' : 'checkout')

  if (action === 'checkout') return { href: `/checkout/${service.slug}`, external: false }
  if (action === 'referral') return { href: service.referral_url || service.cta_url || service.broker_url || '#', external: true }
  if (action === 'external') return { href: service.cta_url || service.referral_url || '#', external: true }
  if (action === 'whatsapp') return { href: service.cta_url || general.whatsapp_url?.value || '#', external: true }
  if (action === 'telegram') return { href: service.cta_url || general.telegram_url?.value || general.free_telegram_url?.value || '#', external: true }

  if (service.type === 'scalp') {
    return { href: service.referral_url || service.cta_url || service.broker_url || '#', external: true }
  }

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

export default function ServiceDetailsPage() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { data: service } = useApiData(() => servicesAPI.getBySlug(slug), null, (response) => response.data ?? null, [slug])
  const { data: settings } = useApiData(settingsAPI.getPublic, {}, (response) => response.data ?? {})
  const general = settings.general ?? {}

  const content = useMemo(() => {
    if (!service) return null
    const title = isArabic ? service.title_ar || service.title_en : service.title_en || service.title_ar
    return {
      title,
      subtitle: isArabic ? service.subtitle_ar || service.subtitle_en : service.subtitle_en || service.subtitle_ar,
      description: isArabic
        ? service.full_description_ar || service.short_description_ar || service.full_description_en
        : service.full_description_en || service.short_description_en || service.full_description_ar,
      termsTitle: isArabic ? service.terms_title_ar || service.terms_title_en : service.terms_title_en || service.terms_title_ar,
      termsContent: isArabic ? service.terms_content_ar || service.terms_content_en : service.terms_content_en || service.terms_content_ar,
      riskWarning: isArabic ? service.risk_warning_ar || service.risk_warning_en : service.risk_warning_en || service.risk_warning_ar,
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

  const features = Array.isArray(service.features) ? service.features : []
  const steps = Array.isArray(service.steps) ? service.steps : []
  const faqs = Array.isArray(service.faqs) ? service.faqs : []
  const gallery = Array.isArray(service.media) ? service.media.filter((item) => item.media_url) : []
  const importantLinks = Array.isArray(service.important_links) ? service.important_links.filter((item) => item.url) : []

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
            {service.broker_name || service.broker_url ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-hunter-text-muted">{isArabic ? 'الوسيط / الرابط' : 'Broker / link'}</div>
                <div className="mt-1 font-semibold">{service.broker_name || service.broker_url}</div>
              </div>
            ) : null}
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
                      <span className="leading-7 text-hunter-text-muted">{isArabic ? feature.label_ar || feature.label_en : feature.label_en || feature.label_ar}</span>
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
                      <h3 className="mt-2 font-heading text-xl font-bold">{isArabic ? step.title_ar || step.title_en : step.title_en || step.title_ar}</h3>
                      <p className="mt-2 leading-7 text-hunter-text-muted">{isArabic ? step.description_ar || step.description_en : step.description_en || step.description_ar}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {importantLinks.length > 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-hunter-card p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-bold">{isArabic ? 'روابط مهمة' : 'Important links'}</h2>
                <div className="mt-5 grid gap-3">
                  {[...importantLinks].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)).map((link) => (
                    <a key={`${link.url}-${link.label_en}`} href={link.url} target={link.new_tab === false ? undefined : '_blank'} rel={link.new_tab === false ? undefined : 'noreferrer'} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-hunter-text-muted transition hover:border-hunter-green hover:text-hunter-green">
                      <span>{isArabic ? link.label_ar || link.label_en : link.label_en || link.label_ar}</span>
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
                      <summary className="cursor-pointer font-semibold">{isArabic ? faq.question_ar || faq.question_en : faq.question_en || faq.question_ar}</summary>
                      <p className="mt-3 leading-7 text-hunter-text-muted">{isArabic ? faq.answer_ar || faq.answer_en : faq.answer_en || faq.answer_ar}</p>
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

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-hunter-card p-6 text-center sm:p-8">
          <h2 className="font-heading text-2xl font-bold">{content.title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-hunter-text-muted">
            {isArabic ? 'راجع التفاصيل والشروط قبل المتابعة.' : 'Review the details and terms before continuing.'}
          </p>
          <div className="mt-6 flex justify-center">
            <FinalCTA service={service} general={general} isArabic={isArabic} />
          </div>
        </section>
      </main>
    </div>
  )
}
