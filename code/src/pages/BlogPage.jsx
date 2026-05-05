import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Package2 } from 'lucide-react'
import { servicesAPI, settingsAPI } from '../api'
import useApiData from '../hooks/useApiData'

// This file name is legacy. The route is the public Offers listing backed by services(type=offers).
export default function OffersPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { data: offers } = useApiData(() => servicesAPI.getAll('offers'), [], (response) => response.data ?? [])
  const { data: settings } = useApiData(settingsAPI.getPublic, {}, (response) => response.data ?? {})
  const websiteName = settings.general?.website_name?.value || 'Hunter Trading'

  return (
    <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm text-hunter-green">{websiteName}</div>
            <h1 className="mt-2 font-heading text-3xl font-bold text-hunter-text">{isArabic ? 'كل العروض' : 'All Offers'}</h1>
            <p className="mt-2 text-hunter-text-muted">{isArabic ? 'صفحة العروض الآن مرتبطة مباشرة بنظام الخدمات الموحد.' : 'Offers now come directly from the unified services system.'}</p>
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
                  <img src={offer.thumbnail_url || offer.cover_url} alt={offer.title_en} className="mb-6 h-48 w-full rounded-xl object-cover" />
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
        ) : (
          <div className="card text-center">{isArabic ? 'لا توجد عروض متاحة الآن.' : 'No offers are available right now.'}</div>
        )}
      </div>
    </div>
  )
}
