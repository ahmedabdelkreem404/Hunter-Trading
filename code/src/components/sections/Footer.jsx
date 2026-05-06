import { useTranslation } from 'react-i18next'
import { AlertTriangle, Mail, MapPin } from 'lucide-react'
import { settingsAPI } from '../../api'
import useApiData from '../../hooks/useApiData'
import SocialBrandIcon, { buildSocialLinksFromSettings, getSocialBrand, normalizeSocialUrl } from '../ui/SocialBrandIcon'

const LIVE_REFRESH_INTERVAL = 0
const ARABIC_MENU_LABELS = {
  '#home': 'الرئيسية',
  '#funded': 'الحسابات الممولة',
  '#vip': 'VIP',
  '#scalp': 'سكالب',
  '#courses': 'الدورات',
  '#offers': 'العروض',
}

function normalizeLinks(items = [], fallback = [], currentLanguage = 'en') {
  if (Array.isArray(items) && items.length > 0) {
    return [...items]
      .filter((item) => item?.is_visible !== false)
      .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
      .map((item) => ({
        name: currentLanguage === 'ar'
          ? ARABIC_MENU_LABELS[item.href] || item.label_ar || item.label_en
          : item.label_en || item.label_ar,
        href: item.href || '#home',
        newTab: !!item.new_tab,
      }))
  }

  return fallback
}

export default function Footer({ homeAnchor = 'home', quickSections = [], footerSettings = {} }) {
  const { t, i18n } = useTranslation()
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
    { name: currentLanguage === 'ar' ? 'الرئيسية' : 'Home', href: `#${homeAnchor}`, newTab: false },
    ...quickSections.filter((section) => section.id !== 'hero').map((section) => ({ name: getSectionLabel(section), href: `#${section.anchor}`, newTab: false })),
  ].slice(0, 4)
  const quickLinks = normalizeLinks(footerSettings.quick_links || [], defaultQuickLinks, currentLanguage)
  const legalFallback = [
    { name: getLocalizedSetting('privacy_policy_title', t('footer.privacy')), href: '/privacy-policy', newTab: false },
    { name: getLocalizedSetting('terms_title', t('footer.terms')), href: '/terms-and-conditions', newTab: false },
    { name: getLocalizedSetting('risk_disclaimer_title', t('footer.disclaimer')), href: '/risk-disclaimer', newTab: false },
  ]
  const legalItems = normalizeLinks(footerSettings.legal_links || [], legalFallback, currentLanguage)
  const siteLogo = general.site_logo?.value || ''
  const footerDescription = getLocalizedSetting('footer_description', t('footer.description'))
  const riskWarningTitle = getLocalizedSetting('risk_warning_title', t('footer.disclaimer'))
  const riskWarningContent = getLocalizedSetting('risk_warning_content', '')

  const socialLinks = buildSocialLinksFromSettings(general)

  const renderLink = (link) => (
    <a
      key={`${link.name}-${link.href}`}
      href={link.href}
      target={link.newTab ? '_blank' : undefined}
      rel={link.newTab ? 'noreferrer' : undefined}
      className="text-hunter-text-muted transition-colors hover:text-hunter-green"
    >
      {link.name}
    </a>
  )

  return (
    <footer className="border-t border-white/10 bg-hunter-bg">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              {siteLogo ? (
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/70 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
                  <img src={siteLogo} alt={general.website_name?.value || 'Hunter Trading'} className="h-full w-full object-contain p-1.5" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hunter-gradient">
                  <span className="font-heading text-xl font-bold text-hunter-bg">H</span>
                </div>
              )}
              <span className="font-heading text-xl font-bold text-hunter-text">{general.website_name?.value || 'Hunter Trading'}</span>
            </div>
            <p className="mb-6 max-w-sm text-sm leading-7 text-hunter-text-muted">{footerDescription}</p>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const brand = getSocialBrand(social.platform)

                return (
                  <a
                    key={social.platform}
                    href={normalizeSocialUrl(social.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border transition hover:-translate-y-0.5 hover:shadow-lg"
                    style={{
                      color: brand.color,
                      background: brand.background,
                      borderColor: brand.border,
                      boxShadow: `0 10px 24px ${brand.border}`,
                    }}
                    aria-label={social.name}
                    title={social.name}
                  >
                    <SocialBrandIcon platform={social.platform} className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-heading font-semibold text-hunter-text">{t('footer.quick_links')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => <li key={`${link.name}-${link.href}`}>{renderLink(link)}</li>)}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading font-semibold text-hunter-text">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              {legalItems.map((link) => <li key={`${link.name}-${link.href}`}>{renderLink(link)}</li>)}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading font-semibold text-hunter-text">{currentLanguage === 'ar' ? 'التواصل' : 'Contact'}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-hunter-text-muted">
                <Mail className="mt-0.5 h-5 w-5 text-hunter-green" />
                <span className="break-all">{general.support_email?.value || 'support@huntertrading.com'}</span>
              </li>
              <li className="flex items-start gap-3 text-hunter-text-muted">
                <MapPin className="mt-0.5 h-5 w-5 text-hunter-green" />
                <span className="leading-7">{general.location?.value || 'Dubai, UAE'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-hunter-orange/20 bg-hunter-orange/10 p-4 sm:p-5">
            <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-hunter-orange" />
            <div className="text-sm leading-7 text-hunter-text-muted">
              <strong className="text-hunter-orange">{riskWarningTitle}:</strong> {riskWarningContent}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-hunter-text-muted">
            © {currentYear} {general.website_name?.value || 'Hunter Trading'}. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
