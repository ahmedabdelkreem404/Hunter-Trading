import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/sections/Navbar'
import Hero from './components/sections/Hero'
import Funded from './components/sections/Funded'
import Vip from './components/sections/Vip'
import Coach from './components/sections/Coach'
import Testimonials from './components/sections/Testimonials'
import MarketSection from './components/sections/Signals'
import ScalpSection from './components/sections/Affiliate'
import Courses from './components/sections/Courses'
import OffersSection from './components/sections/Blog'
import Footer from './components/sections/Footer'
import LeadMagnet from './components/ui/LeadMagnet'
import TelegramFloating from './components/ui/TelegramFloating'
import ScrollToTop from './components/ui/ScrollToTop'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { PUBLIC_CONTENT_CHANGED_EVENT, invalidatePublicCache, sectionSettingsAPI, settingsAPI } from './api'
import useApiData from './hooks/useApiData'
import { buildHomepageSectionsFromSettings } from './utils/sectionLayout'
import { applyConfiguredDefaultLanguage, saveLanguage } from './utils/language'

const LIVE_REFRESH_INTERVAL = 0
const SECTION_REFRESH_INTERVAL = 0

const sectionComponents = {
  hero: Hero,
  funded: Funded,
  vip: Vip,
  coach: Coach,
  testimonials: Testimonials,
  market: MarketSection,
  scalp: ScalpSection,
  courses: Courses,
  offers: OffersSection,
}

function AppContent() {
  const { i18n } = useTranslation()
  const { isDarkMode } = useTheme()
  const [showLeadMagnet, setShowLeadMagnet] = useState(false)
  const [contentRevision, setContentRevision] = useState(0)
  const { data: settings, loading: settingsLoading } = useApiData(
    settingsAPI.getPublic,
    {},
    (response) => response.data ?? {},
    [contentRevision],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )
  const { data: sectionSettings, loading: sectionsLoading } = useApiData(
    sectionSettingsAPI.getPublic,
    [],
    (response) => response.data ?? [],
    [contentRevision],
    { refreshInterval: SECTION_REFRESH_INTERVAL }
  )
  const generalSettings = settings.general ?? {}
  const managedSections = buildHomepageSectionsFromSettings(sectionSettings)
  const visibleSections = managedSections.filter((section) => section.enabled)
  const navigationSection = sectionSettings.find((section) => section.section_key === 'navigation') ?? null
  const footerSection = sectionSettings.find((section) => section.section_key === 'footer') ?? null
  const firstVisibleAnchor = visibleSections[0]?.anchor ?? 'home'
  const navSections = visibleSections.filter((section) => section.showInNav)
  const navigationMenuItems = navigationSection?.settings?.menu_items ?? []
  const leadMagnetEnabled = ['1', 'true', 'yes', 'on'].includes(String(generalSettings.lead_magnet_enabled?.value || '').toLowerCase())
  const footerSettings = footerSection?.settings || {}
  const hasPublicShell = Boolean(
    generalSettings.website_name?.value ||
    generalSettings.site_logo?.value ||
    navSections.length ||
    navigationMenuItems.length ||
    Object.keys(footerSettings).length
  )
  const heroPrimaryCtaId = visibleSections.find((section) => section.id === 'vip')?.anchor
    ?? visibleSections.find((section) => section.id === 'market')?.anchor
    ?? visibleSections.find((section) => section.id !== 'hero')?.anchor
    ?? firstVisibleAnchor
  const heroScrollTargetId = visibleSections.find((section) => section.id !== 'hero')?.anchor ?? firstVisibleAnchor

  useEffect(() => {
    const refreshContent = () => {
      invalidatePublicCache('/sections')
      invalidatePublicCache('/settings/public')
      setContentRevision((current) => current + 1)
    }

    window.addEventListener(PUBLIC_CONTENT_CHANGED_EVENT, refreshContent)

    const handleStorage = (event) => {
      if (event.key === PUBLIC_CONTENT_CHANGED_EVENT) {
        refreshContent()
      }
    }

    window.addEventListener('storage', handleStorage)

    let channel = null
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(PUBLIC_CONTENT_CHANGED_EVENT)
      channel.onmessage = refreshContent
    }

    return () => {
      window.removeEventListener(PUBLIC_CONTENT_CHANGED_EVENT, refreshContent)
      window.removeEventListener('storage', handleStorage)
      channel?.close()
    }
  }, [])

  useEffect(() => {
    // Check if user has seen lead magnet
    const hasSeenLeadMagnet = localStorage.getItem('leadMagnetSeen')
    if (leadMagnetEnabled && !hasSeenLeadMagnet) {
      const timer = setTimeout(() => setShowLeadMagnet(true), 30000)
      return () => clearTimeout(timer)
    }
  }, [leadMagnetEnabled])

  useEffect(() => {
    // Exit intent detection
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        const hasSeenLeadMagnet = localStorage.getItem('leadMagnetSeen')
        if (leadMagnetEnabled && !hasSeenLeadMagnet) {
          setShowLeadMagnet(true)
        }
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [leadMagnetEnabled])

  const handleLeadMagnetClose = () => {
    setShowLeadMagnet(false)
    localStorage.setItem('leadMagnetSeen', 'true')
  }

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    saveLanguage(lang, { manual: true })
  }

  useEffect(() => {
    applyConfiguredDefaultLanguage(i18n, generalSettings.default_language?.value || 'ar')
  }, [generalSettings.default_language?.value, i18n])

  useEffect(() => {
    const root = document.documentElement
    const sharedThemeVars = {
      '--accent-primary': generalSettings.primary_color?.value || '#00ff88',
      '--accent-primary-strong': generalSettings.primary_color_strong?.value || '#00cc6a',
      '--accent-blue': generalSettings.accent_blue?.value || '#0066ff',
      '--accent-orange': generalSettings.accent_orange?.value || '#ff6b35',
      '--accent-orange-strong': generalSettings.accent_orange_strong?.value || '#ff8c42',
      '--product-card-shell-bg': generalSettings.product_card_shell_bg?.value || (isDarkMode ? '#0a0a0f' : '#f8fafc'),
      '--product-card-surface-bg': generalSettings.product_card_surface_bg?.value || (isDarkMode ? '#12121a' : '#ffffff'),
      '--product-card-border-color': generalSettings.product_card_border_color?.value || (isDarkMode ? '#2a2a36' : '#d7deea'),
      '--product-card-title-color': generalSettings.product_card_title_color?.value || (isDarkMode ? '#ffffff' : '#0f172a'),
      '--product-card-body-color': generalSettings.product_card_body_color?.value || (isDarkMode ? '#9ca3af' : '#5b6b82'),
      '--product-card-button-text-color': generalSettings.product_card_button_text_color?.value || '#050509',
    }
    const surfaceThemeVars = isDarkMode
      ? {
          '--bg-primary': generalSettings.background_dark?.value || '#0a0a0f',
          '--bg-secondary': generalSettings.card_dark?.value || '#12121a',
          '--text-primary': generalSettings.text_dark?.value || '#ffffff',
          '--text-secondary': generalSettings.text_muted_dark?.value || '#8a8a9a',
        }
      : {
          '--bg-primary': '#f4f7fb',
          '--bg-secondary': '#ffffff',
          '--text-primary': '#0f172a',
          '--text-secondary': '#5b6b82',
        }
    const themeVars = { ...sharedThemeVars, ...surfaceThemeVars }

    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    root.style.colorScheme = isDarkMode ? 'dark' : 'light'
  }, [generalSettings, isDarkMode])

  useEffect(() => {
    const websiteName = generalSettings.website_name?.value || ''
    if (websiteName) {
      document.title = websiteName
    }
  }, [generalSettings.website_name?.value])

  if (settingsLoading || sectionsLoading) {
    return (
      <div className="fixed inset-0 bg-hunter-bg flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-hunter-green border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hunter-bg transition-colors duration-300">
      {hasPublicShell ? (
        <Navbar
          onLanguageChange={changeLanguage}
          currentLanguage={i18n.language}
          navSections={navSections}
          homeAnchor={firstVisibleAnchor}
          navigationSettings={navigationSection?.settings || {}}
        />
      ) : null}
      
      <main>
        {visibleSections.map((section) => {
          const SectionComponent = sectionComponents[section.id]

          if (!SectionComponent) {
            return null
          }

          if (section.id === 'hero') {
            return (
              <SectionComponent
                key={section.id}
                primaryCtaId={heroPrimaryCtaId}
                scrollTargetId={heroScrollTargetId}
              />
            )
          }

          return <SectionComponent key={section.id} />
        })}
      </main>
      
      {hasPublicShell ? <Footer homeAnchor={firstVisibleAnchor} quickSections={navSections} footerSettings={footerSettings} /> : null}
      <TelegramFloating />
      <ScrollToTop />
      
      <AnimatePresence>
        {showLeadMagnet && (
          <LeadMagnet onClose={handleLeadMagnetClose} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
