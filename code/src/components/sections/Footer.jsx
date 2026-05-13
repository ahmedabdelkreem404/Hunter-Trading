import { useTranslation } from 'react-i18next'
import { AlertTriangle, Mail, MapPin } from 'lucide-react'
import { settingsAPI } from '../../api'
import useApiData from '../../hooks/useApiData'
import SocialBrandIcon, { buildSocialLinksFromSettings, getSocialBrand, normalizeSocialUrl } from '../ui/SocialBrandIcon'

const LIVE_REFRESH_INTERVAL = 0

function normalizeLinks(items = [], fallback = [], currentLanguage = 'en') {
  if (Array.isArray(items) && items.length > 0) {
    return [...items]
      .filter((item) => item?.is_visible !== false)
      .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
      .map((item) => ({
        name: currentLanguage === 'ar'
          ? item.label_ar || item.label_en
          : item.label_en || item.label_ar,
        href: item.href || '#home',
        newTab: !!item.new_tab,
      }))
      .filter((item) => item.name && item.href)
  }

  return fallback.filter((item) => item.name && item.href)
}

export default function Footer({ homeAnchor = 'home', quickSections = [], footerSettings = {} }) {
  const { i18n } = useTranslation()
  const currentYear = new Date().getFullYear()
  const { data: settings } = useApiData(
    settingsAPI.getPublic,
    {},
    (response) => response.data ?? {},
    [],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )
  const general = settings.general ?? {}
  const currentLanguage = i18n.language
  const getSectionLabel = (section) => (
    currentLanguage === 'ar' ? section.label_ar || section.label : section.label_en || section.label
  )
  const getLocalizedSetting = (key, fallback = '') => {
    if (currentLanguage === 'ar') {
      return general[`${key}_ar`]?.value || general[key]?.value || general[`${key}_en`]?.value || fallback
    }

    return general[`${key}_en`]?.value || fallback
  }
  const defaultQuickLinks = [
    ...quickSections.filter((section) => section.id !== 'hero').map((section) => ({ name: getSectionLabel(section), href: `#${section.anchor}`, newTab: false })),
  ].slice(0, 4)
  const quickLinks = normalizeLinks(footerSettings.quick_links || [], defaultQuickLinks, currentLanguage)
  const legalFallback = [
    { name: getLocalizedSetting('privacy_policy_title', ''), href: '/privacy-policy', newTab: false },
    { name: getLocalizedSetting('terms_title', ''), href: '/terms-and-conditions', newTab: false },
    { name: getLocalizedSetting('risk_disclaimer_title', ''), href: '/risk-disclaimer', newTab: false },
  ].filter((item) => item.name)
  const legalItems = normalizeLinks(footerSettings.legal_links || [], legalFallback, currentLanguage)
  const siteLogo = general.site_logo?.value || ''
  const websiteName = general.website_name?.value || ''
  const footerDescription = getLocalizedSetting('footer_description', '')
  const riskWarningTitle = getLocalizedSetting('risk_warning_title', '')
  const riskWarningContent = getLocalizedSetting('risk_warning_content', '')
  const supportEmail = general.support_email?.value || general.contact_email?.value || ''
  const location = general.location?.value || ''
  const copyright = currentLanguage === 'ar'
    ? general.footer_copyright_ar?.value || general.footer_copyright?.value || ''
    : general.footer_copyright_en?.value || general.footer_copyright?.value || ''

  const socialLinks = buildSocialLinksFromSettings(general)

  const renderLink = (link) => (
    <a
      key={`${link.name}-${link.href}`}
      href={link.href}
      target={link.newTab ? '_blank' : undefined}
      rel={link.newTab ? 'noreferrer' : undefined}
      className="inline-flex py-1 text-xs leading-5 text-hunter-text-muted transition-colors hover:text-hunter-green sm:text-sm sm:leading-6"
    >
      {link.name}
    </a>
  )

  return (
    <footer className="border-t border-white/10 bg-hunter-bg">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-12">
          <div className="col-span-2 text-center lg:col-span-1 lg:text-start">
            <div className="mb-3 flex items-center justify-center gap-2 lg:justify-start">
              {siteLogo ? (
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/70 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
                  <img src={siteLogo} alt={websiteName} className="h-full w-full object-contain p-1.5" />
                </div>
              ) : websiteName ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hunter-gradient">
                  <span className="font-heading text-xl font-bold text-hunter-bg">{websiteName.charAt(0)}</span>
                </div>
              ) : null}
              {websiteName ? <span className="font-heading text-xl font-bold text-hunter-text">{websiteName}</span> : null}
            </div>
            {footerDescription ? (
              <p className="mx-auto mb-5 line-clamp-2 max-w-sm text-xs leading-6 text-hunter-text-muted sm:text-sm sm:leading-7 lg:mx-0 lg:line-clamp-none">{footerDescription}</p>
            ) : null}

            <div className="flex flex-wrap justify-center gap-2.5 lg:justify-start lg:gap-3">
              {socialLinks.map((social) => {
                const brand = getSocialBrand(social.platform)

                return (
                  <a
                    key={social.platform}
                    href={normalizeSocialUrl(social.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border transition hover:-translate-y-0.5 hover:shadow-lg md:h-11 md:w-11"
                    style={{
                      color: brand.color,
                      background: brand.background,
                      borderColor: brand.border,
                      boxShadow: `0 10px 24px ${brand.border}`,
                    }}
                    aria-label={social.name}
                    title={social.name}
                  >
                    <SocialBrandIcon platform={social.platform} className="h-4 w-4 md:h-5 md:w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {quickLinks.length > 0 ? (
          <div className="border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0">
            <h4 className="mb-2 font-heading text-sm font-semibold text-hunter-text sm:mb-3 sm:text-base">{footerSettings.quick_links_title || ''}</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {quickLinks.map((link) => <li key={`${link.name}-${link.href}`}>{renderLink(link)}</li>)}
            </ul>
          </div>
          ) : null}

          {legalItems.length > 0 ? (
          <div className="border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0">
            <h4 className="mb-2 font-heading text-sm font-semibold text-hunter-text sm:mb-3 sm:text-base">{footerSettings.legal_links_title || ''}</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {legalItems.map((link) => <li key={`${link.name}-${link.href}`}>{renderLink(link)}</li>)}
            </ul>
          </div>
          ) : null}

          {(supportEmail || location) ? (
          <div className="col-span-2 border-t border-white/10 pt-4 lg:col-span-1 lg:border-t-0 lg:pt-0">
            <h4 className="mb-2 font-heading text-sm font-semibold text-hunter-text sm:mb-3 sm:text-base">{footerSettings.contact_title || ''}</h4>
            <ul className="grid gap-2.5 sm:grid-cols-2 lg:block lg:space-y-3">
              {supportEmail ? (
              <li className="flex items-start gap-2.5 text-sm text-hunter-text-muted">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-hunter-green" />
                <span className="break-all leading-6">{supportEmail}</span>
              </li>
              ) : null}
              {location ? (
              <li className="flex items-start gap-2.5 text-sm text-hunter-text-muted">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-hunter-green" />
                <span className="leading-6">{location}</span>
              </li>
              ) : null}
            </ul>
          </div>
          ) : null}
        </div>
      </div>

      {riskWarningTitle || riskWarningContent ? (
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-6 lg:px-8">
          <details className="rounded-2xl border border-hunter-orange/20 bg-hunter-orange/10 p-3.5 sm:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-hunter-orange">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {riskWarningTitle}
            </summary>
            <div className="mt-3 text-xs leading-6 text-hunter-text-muted">{riskWarningContent}</div>
          </details>
          <div className="hidden items-start gap-3 rounded-2xl border border-hunter-orange/20 bg-hunter-orange/10 p-4 sm:flex sm:p-5">
            <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-hunter-orange" />
            <div className="text-sm leading-7 text-hunter-text-muted sm:text-base">
              <strong className="text-hunter-orange">{riskWarningTitle}:</strong> {riskWarningContent}
            </div>
          </div>
        </div>
      </div>
      ) : null}

      {copyright || websiteName ? (
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center sm:px-6 sm:py-5 lg:px-8">
          <p className="text-xs text-hunter-text-muted sm:text-sm">
            {copyright || `© ${currentYear} ${websiteName}`}
          </p>
        </div>
      </div>
      ) : null}
    </footer>
  )
}
