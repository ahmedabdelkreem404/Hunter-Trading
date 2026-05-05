import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Globe, Menu, Moon, Sun, X } from 'lucide-react'
import { settingsAPI } from '../../api'
import useApiData from '../../hooks/useApiData'
import { useTheme } from '../../contexts/ThemeContext'

const LIVE_REFRESH_INTERVAL = 10000

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

function normalizeMenuItems(menuItems = [], fallbackLinks = [], currentLanguage = 'en') {
  if (Array.isArray(menuItems) && menuItems.length > 0) {
    return [...menuItems]
      .filter((item) => item?.is_visible !== false)
      .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
      .map((item) => ({
        name: currentLanguage === 'ar' ? item.label_ar || item.label_en : item.label_en || item.label_ar,
        href: item.href || '#home',
        newTab: !!item.new_tab,
      }))
  }

  return fallbackLinks
}

export default function Navbar({
  onLanguageChange,
  currentLanguage,
  navSections = [],
  homeAnchor = 'home',
  navigationSettings = {},
}) {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()
  const { data: settings } = useApiData(
    settingsAPI.getPublic,
    {},
    (response) => response.data ?? {},
    [],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )

  const websiteName = settings.general?.website_name?.value || 'Hunter Trading'
  const siteLogo = settings.general?.site_logo?.value || ''
  const telegramUrl = settings.general?.telegram_url?.value || settings.general?.free_telegram_url?.value || 'https://t.me/hunter_tradeing'
  const defaultLinks = navSections.map((section) => ({ name: section.label, href: `#${section.anchor}`, newTab: false }))
  const navLinks = useMemo(
    () => normalizeMenuItems(navigationSettings.menu_items || [], defaultLinks, currentLanguage),
    [navigationSettings.menu_items, defaultLinks, currentLanguage]
  )

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const renderLink = (link, className) => (
    <a
      key={`${link.name}-${link.href}`}
      href={link.href}
      target={link.newTab ? '_blank' : undefined}
      rel={link.newTab ? 'noreferrer' : undefined}
      className={className}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {link.name}
    </a>
  )

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'border-b border-white/10 bg-hunter-bg/90 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20">
          <a href={`#${homeAnchor}`} className="flex min-w-0 items-center">
            {siteLogo ? (
              <img src={siteLogo} alt={websiteName} className="h-10 w-auto max-w-[9rem] object-contain sm:h-11 sm:max-w-[11rem] lg:max-w-[13rem]" />
            ) : (
              <span className="truncate font-heading text-lg font-bold text-hunter-text sm:text-xl lg:text-2xl">{websiteName}</span>
            )}
          </a>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex xl:gap-8">
            {navLinks.map((link) => renderLink(link, 'text-sm font-medium text-hunter-text-muted transition-colors hover:text-hunter-green xl:text-base'))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onLanguageChange(currentLanguage === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 rounded-xl px-2.5 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5 sm:px-3"
              aria-label="Toggle language"
            >
              <Globe className="h-5 w-5 text-hunter-text-muted" />
              <span className="text-sm font-medium uppercase text-hunter-text-muted">{currentLanguage}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-hunter-text-muted" /> : <Moon className="h-5 w-5 text-hunter-text-muted" />}
            </button>

            <button onClick={() => window.open(telegramUrl, '_blank')} className="btn-primary hidden items-center gap-2 !px-4 !py-2 lg:flex">
              <TelegramIcon />
              <span>{t('hero.cta_telegram')}</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className="rounded-xl p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-hunter-text" /> : <Menu className="h-6 w-6 text-hunter-text" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="theme-surface mx-3 mt-2 overflow-hidden rounded-3xl lg:hidden"
        >
          <div className="space-y-3 px-4 py-4">
            {navLinks.map((link) =>
              renderLink(
                link,
                'block rounded-2xl px-3 py-3 text-hunter-text-muted transition-colors hover:bg-black/5 hover:text-hunter-green dark:hover:bg-white/5'
              )
            )}
            <button onClick={() => window.open(telegramUrl, '_blank')} className="btn-primary mt-4 flex w-full items-center justify-center gap-2">
              <TelegramIcon />
              <span>{t('hero.cta_telegram')}</span>
            </button>
          </div>
        </motion.div>
      ) : null}
    </motion.nav>
  )
}
