import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../sections/Navbar'
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext'
import { PUBLIC_CONTENT_CHANGED_EVENT, invalidatePublicCache, sectionSettingsAPI, settingsAPI } from '../../api'
import useApiData from '../../hooks/useApiData'
import { buildHomepageSectionsFromSettings } from '../../utils/sectionLayout'
import { applyConfiguredDefaultLanguage, saveLanguage } from '../../utils/language'

const LIVE_REFRESH_INTERVAL = 0
const SECTION_REFRESH_INTERVAL = 0

function PublicPageChrome({ children }) {
  const { i18n } = useTranslation()
  const { isDarkMode } = useTheme()
  const [contentRevision, setContentRevision] = useState(0)
  const { data: settings, loading: settingsLoading } = useApiData(
    settingsAPI.getPublic,
    {},
    (response) => response.data ?? {},
    [contentRevision],
    { refreshInterval: LIVE_REFRESH_INTERVAL },
  )
  const { data: sectionSettings, loading: sectionsLoading } = useApiData(
    sectionSettingsAPI.getPublic,
    [],
    (response) => response.data ?? [],
    [contentRevision],
    { refreshInterval: SECTION_REFRESH_INTERVAL },
  )

  const generalSettings = settings.general ?? {}
  const managedSections = buildHomepageSectionsFromSettings(sectionSettings)
  const visibleSections = managedSections.filter((section) => section.enabled)
  const navigationSection = sectionSettings.find((section) => section.section_key === 'navigation') ?? null
  const firstVisibleAnchor = visibleSections[0]?.anchor ?? 'home'
  const navSections = visibleSections.filter((section) => section.showInNav)
  const navigationMenuItems = navigationSection?.settings?.menu_items ?? []
  const hasPublicShell = Boolean(
    generalSettings.website_name?.value ||
    generalSettings.site_logo?.value ||
    navSections.length ||
    navigationMenuItems.length
  )

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

    Object.entries({ ...sharedThemeVars, ...surfaceThemeVars }).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    root.style.colorScheme = isDarkMode ? 'dark' : 'light'
  }, [generalSettings, isDarkMode])

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    saveLanguage(lang, { manual: true })
  }

  useEffect(() => {
    applyConfiguredDefaultLanguage(i18n, generalSettings.default_language?.value || 'ar')
  }, [generalSettings.default_language?.value, i18n])

  if (settingsLoading || sectionsLoading) {
    return <div className="min-h-screen bg-hunter-bg" />
  }

  return (
    <div className="min-h-screen bg-hunter-bg">
      {hasPublicShell ? (
        <Navbar
          onLanguageChange={changeLanguage}
          currentLanguage={i18n.language}
          navSections={navSections}
          homeAnchor={firstVisibleAnchor}
          navigationSettings={navigationSection?.settings || {}}
          linkBasePath="/"
        />
      ) : null}
      <div className={hasPublicShell ? 'pt-16 md:pt-20' : ''}>
        {children}
      </div>
    </div>
  )
}

export default function PublicPageLayout({ children }) {
  return (
    <ThemeProvider>
      <PublicPageChrome>{children}</PublicPageChrome>
    </ThemeProvider>
  )
}
