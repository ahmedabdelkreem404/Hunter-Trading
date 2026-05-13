import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { settingsAPI } from '../api'
import useApiData from '../hooks/useApiData'

const pageConfig = {
  '/privacy-policy': {
    titleKey: 'privacy_policy_title',
    contentKey: 'privacy_policy_content',
  },
  '/terms-and-conditions': {
    titleKey: 'terms_title',
    contentKey: 'terms_content',
  },
  '/risk-disclaimer': {
    titleKey: 'risk_disclaimer_title',
    contentKey: 'risk_disclaimer_content',
  },
}

function getLocalizedSetting(general, key, isArabic, fallback) {
  if (isArabic) {
    return general[`${key}_ar`]?.value || general[key]?.value || general[`${key}_en`]?.value || fallback
  }

  return general[`${key}_en`]?.value || fallback
}

export default function LegalPage() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { data: settings } = useApiData(settingsAPI.getPublic, {}, (response) => response.data ?? {})
  const general = settings.general ?? {}

  const page = useMemo(() => pageConfig[location.pathname] ?? pageConfig['/privacy-policy'], [location.pathname])
  const title = getLocalizedSetting(general, page.titleKey, isArabic, '')
  const content = getLocalizedSetting(general, page.contentKey, isArabic, '')
  const websiteName = general.website_name?.value || ''

  return (
    <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
          {isArabic ? 'العودة إلى الرئيسية' : 'Back to home'}
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-hunter-card p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-6">
            {websiteName ? <div className="text-sm text-hunter-green">{websiteName}</div> : null}
            {title ? <h1 className="mt-2 font-heading text-3xl font-bold text-hunter-text">{title}</h1> : null}
          </div>

          {content ? <div className="whitespace-pre-wrap leading-8 text-hunter-text-muted">{content}</div> : null}
        </div>
      </div>
    </div>
  )
}
