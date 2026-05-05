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
import { sectionSettingsAPI, settingsAPI } from './api'
import useApiData from './hooks/useApiData'
import { buildHomepageSectionsFromSettings, getVisibleHomepageSections, parseHomepageLayout } from './utils/sectionLayout'

const LIVE_REFRESH_INTERVAL = 10000

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
  const [isLoading, setIsLoading] = useState(true)
  const { data: settings } = useApiData(
    settingsAPI.getPublic,
    {},
    (response) => response.data ?? {},
    [],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )
  const { data: sectionSettings } = useApiData(
    sectionSettingsAPI.getPublic,
    [],
    (response) => response.data ?? [],
    [],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )
  const generalSettings = settings.general ?? {}
  const homepageLayoutValue =
    settings.layout?.homepage_sections?.value ??
    settings.general?.homepage_sections?.value

  const fallbackVisibleSections = getVisibleHomepageSections(parseHomepageLayout(homepageLayoutValue))
  const managedSections = buildHomepageSectionsFromSettings(sectionSettings)
  const visibleSections = managedSections.length > 0
    ? managedSections.filter((section) => section.enabled)
    : fallbackVisibleSections
  const navigationSection = sectionSettings.find((section) => section.section_key === 'navigation') ?? null
  const footerSection = sectionSettings.find((section) => section.section_key === 'footer') ?? null
  const firstVisibleAnchor = visibleSections[0]?.anchor ?? 'home'
  const navSections = visibleSections.filter((section) => section.showInNav)
  const heroPrimaryCtaId = visibleSections.find((section) => section.id === 'vip')?.anchor
    ?? visibleSections.find((section) => section.id === 'market')?.anchor
    ?? visibleSections.find((section) => section.id !== 'hero')?.anchor
    ?? firstVisibleAnchor
  const heroScrollTargetId = visibleSections.find((section) => section.id !== 'hero')?.anchor ?? firstVisibleAnchor

  useEffect(() => {
    // Check if user has seen lead magnet
    const hasSeenLeadMagnet = localStorage.getItem('leadMagnetSeen')
    if (!hasSeenLeadMagnet) {
      const timer = setTimeout(() => setShowLeadMagnet(true), 30000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    // Exit intent detection
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        const hasSeenLeadMagnet = localStorage.getItem('leadMagnetSeen')
        if (!hasSeenLeadMagnet) {
          setShowLeadMagnet(true)
        }
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  const handleLeadMagnetClose = () => {
    setShowLeadMagnet(false)
    localStorage.setItem('leadMagnetSeen', 'true')
  }

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
    setTimeout(() => setIsLoading(false), 1000)
  }, [i18n.language])

  useEffect(() => {
    const root = document.documentElement
    const sharedThemeVars = {
      '--accent-primary': generalSettings.primary_color?.value || '#00ff88',
      '--accent-primary-strong': generalSettings.primary_color_strong?.value || '#00cc6a',
      '--accent-blue': generalSettings.accent_blue?.value || '#0066ff',
      '--accent-orange': generalSettings.accent_orange?.value || '#ff6b35',
      '--accent-orange-strong': generalSettings.accent_orange_strong?.value || '#ff8c42',
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
    const websiteName = generalSettings.website_name?.value || 'Hunter Trading'
    document.title = websiteName
  }, [generalSettings.website_name?.value])

  if (isLoading) {
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
      <Navbar
        onLanguageChange={changeLanguage}
        currentLanguage={i18n.language}
        navSections={navSections}
        homeAnchor={firstVisibleAnchor}
        navigationSettings={navigationSection?.settings || {}}
      />
      
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
      
      <Footer homeAnchor={firstVisibleAnchor} quickSections={navSections} footerSettings={footerSection?.settings || {}} />
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
