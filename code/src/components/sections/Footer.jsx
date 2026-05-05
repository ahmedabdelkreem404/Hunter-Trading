import { useTranslation } from 'react-i18next'
import { AlertTriangle, Mail, MapPin } from 'lucide-react'
import { settingsAPI } from '../../api'
import useApiData from '../../hooks/useApiData'

const LIVE_REFRESH_INTERVAL = 0

const socialIcons = {
  Telegram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
}

function normalizeLinks(items = [], fallback = [], currentLanguage = 'en') {
  if (Array.isArray(items) && items.length > 0) {
    return [...items]
      .filter((item) => item?.is_visible !== false)
      .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
      .map((item) => ({
        name: currentLanguage === 'ar' ? item.label_ar || item.label_en : item.label_en || item.label_ar,
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
  const defaultQuickLinks = [
    { name: currentLanguage === 'ar' ? 'الرئيسية' : 'Home', href: `#${homeAnchor}`, newTab: false },
    ...quickSections.filter((section) => section.id !== 'hero').map((section) => ({ name: section.label, href: `#${section.anchor}`, newTab: false })),
  ].slice(0, 4)
  const quickLinks = normalizeLinks(footerSettings.quick_links || [], defaultQuickLinks, currentLanguage)
  const legalFallback = [
    { name: general.privacy_policy_title?.value || t('footer.privacy'), href: '/privacy-policy', newTab: false },
    { name: general.terms_title?.value || t('footer.terms'), href: '/terms-and-conditions', newTab: false },
    { name: general.risk_disclaimer_title?.value || t('footer.disclaimer'), href: '/risk-disclaimer', newTab: false },
  ]
  const legalItems = normalizeLinks(footerSettings.legal_links || [], legalFallback, currentLanguage)
  const siteLogo = general.site_logo?.value || ''
  const footerDescription = general.footer_description?.value || t('footer.description')
  const riskWarningTitle = general.risk_warning_title?.value || t('footer.disclaimer')
  const riskWarningContent = general.risk_warning_content?.value || ''

  const socialLinks = [
    { name: 'Telegram', url: general.telegram_url?.value || '' },
    { name: 'Instagram', url: general.instagram_url?.value || '' },
    { name: 'YouTube', url: general.youtube_url?.value || '' },
    { name: 'TikTok', url: general.tiktok_url?.value || '' },
    { name: 'Facebook', url: general.facebook_url?.value || '' },
    { name: 'X', url: general.twitter_url?.value || '' },
    { name: 'WhatsApp', url: general.whatsapp_url?.value || '' },
  ].filter((item) => item.url)

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
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-hunter-text-muted transition-colors hover:bg-hunter-green hover:text-hunter-bg dark:bg-white/5"
                  aria-label={social.name}
                >
                  {socialIcons[social.name] || <span className="text-xs font-bold">{social.name.slice(0, 1)}</span>}
                </a>
              ))}
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
