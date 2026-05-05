import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Package2 } from 'lucide-react'
import { servicesAPI, settingsAPI } from '../api'
import useApiData from '../hooks/useApiData'

export default function OfferDetailsPage() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { data: offer } = useApiData(() => servicesAPI.getBySlug(slug), null, (response) => response.data ?? null)
  const { data: settings } = useApiData(settingsAPI.getPublic, {}, (response) => response.data ?? {})
  const websiteName = settings.general?.website_name?.value || 'Hunter Trading'

  if (!offer) {
    return (
      <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/offers" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
            {isArabic ? 'العودة إلى العروض' : 'Back to offers'}
          </Link>
          <div className="card mt-8 text-center">{isArabic ? 'العرض غير موجود.' : 'This offer does not exist.'}</div>
        </div>
      </div>
    )
  }

  const title = isArabic ? offer.title_ar || offer.title_en : offer.title_en || offer.title_ar
  const content = isArabic
    ? offer.full_description_ar || offer.short_description_ar || offer.full_description_en
    : offer.full_description_en || offer.short_description_en || offer.full_description_ar

  return (
    <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/offers" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
          <ArrowLeft className="h-4 w-4" />
          {isArabic ? 'العودة إلى العروض' : 'Back to offers'}
        </Link>

        <article className="mt-8 rounded-3xl border border-white/10 bg-hunter-card p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-6">
            <div className="text-sm text-hunter-green">{websiteName}</div>
            <h1 className="mt-2 font-heading text-3xl font-bold text-hunter-text">{title}</h1>
          </div>

          {(offer.cover_url || offer.thumbnail_url) ? (
            <img src={offer.cover_url || offer.thumbnail_url} alt={title} className="mb-8 h-72 w-full rounded-2xl object-cover" />
          ) : (
            <div className="mb-8 flex h-72 items-center justify-center rounded-2xl bg-white/5">
              <Package2 className="h-14 w-14 text-hunter-green/60" />
            </div>
          )}

          <div className="whitespace-pre-wrap text-lg leading-8 text-hunter-text-muted">{content}</div>

          <Link to={`/checkout/${offer.slug}`} className="btn-primary mt-8 inline-flex items-center justify-center">
            {isArabic ? offer.cta_label_ar || 'اشتر الآن' : offer.cta_label_en || 'Buy Now'}
          </Link>
        </article>
      </div>
    </div>
  )
}
