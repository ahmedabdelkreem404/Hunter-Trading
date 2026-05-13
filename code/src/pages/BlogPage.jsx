import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Package2 } from 'lucide-react'
import { sectionSettingsAPI, servicesAPI, settingsAPI } from '../api'
import useApiData from '../hooks/useApiData'
import SmartMedia from '../components/ui/SmartMedia'
import { resolveMediaType } from '../utils/media'

// This file name is legacy. The route is the public Offers listing backed by services(type=offers).
export default function OffersPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { data: offers } = useApiData(() => servicesAPI.getAll('offers'), [], (response) => response.data ?? [])
  const { data: settings } = useApiData(settingsAPI.getPublic, {}, (response) => response.data ?? {})
  const { data: sections } = useApiData(sectionSettingsAPI.getPublic, [], (response) => response.data ?? [])
  const websiteName = settings.general?.website_name?.value || ''
  const section = sections.find((item) => item.section_key === 'offers') ?? {}
  const title = (isArabic ? section.title_ar : section.title_en) || ''
  const subtitle = (isArabic ? section.subtitle_ar : section.subtitle_en) || ''

  if (offers.length === 0 && !title && !subtitle) {
    return <div className="min-h-screen bg-hunter-bg" />
  }

  return (
    <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            {websiteName ? <div className="text-sm text-hunter-green">{websiteName}</div> : null}
            {title ? <h1 className="mt-2 font-heading text-3xl font-bold text-hunter-text">{title}</h1> : null}
            {subtitle ? <p className="mt-2 text-hunter-text-muted">{subtitle}</p> : null}
          </div>
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
            {isArabic ? 'العودة إلى الرئيسية' : 'Back to home'}
          </Link>
        </div>

        {offers.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <Link key={offer.id} to={`/offers/${offer.slug}`} className="card group block">
                {(offer.thumbnail_url || offer.cover_url) ? (
                  <SmartMedia
                    src={offer.thumbnail_url || offer.cover_url}
                    type={resolveMediaType(offer.thumbnail_url || offer.cover_url, offer.card_media_type || offer.cover_media_type || 'image')}
                    alt={offer.title_en}
                    className="mb-6 h-48 w-full rounded-xl object-cover"
                    iframeClassName="mb-6 h-48 w-full rounded-xl"
                    autoPlay
                    muted
                    loop
                    controls={false}
                  />
                ) : (
                  <div className="mb-6 flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-hunter-green/10 to-hunter-blue/10">
                    <Package2 className="h-16 w-16 text-hunter-green/40" />
                  </div>
                )}
                <h2 className="font-heading text-xl font-semibold text-hunter-text group-hover:text-hunter-green transition-colors">
                  {(isArabic ? offer.title_ar : offer.title_en) || offer.title_en || offer.title_ar}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm text-hunter-text-muted">
                  {(isArabic ? offer.short_description_ar : offer.short_description_en) || offer.short_description_en || offer.short_description_ar}
                </p>
                <div className="mt-4 flex items-center gap-2 text-hunter-green transition-all group-hover:gap-3">
                  <span>{isArabic ? 'عرض التفاصيل' : 'View details'}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
