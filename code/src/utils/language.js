export const DEFAULT_LANGUAGE = 'ar'
export const LANGUAGE_STORAGE_KEY = 'language'
export const LANGUAGE_MANUAL_STORAGE_KEY = 'hunter:language-manual'

export function normalizeLanguage(language) {
  return language === 'en' ? 'en' : DEFAULT_LANGUAGE
}

export function readStoredLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return storedLanguage ? normalizeLanguage(storedLanguage) : DEFAULT_LANGUAGE
}

export function hasManualLanguageSelection() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(LANGUAGE_MANUAL_STORAGE_KEY) === '1'
}

export function saveLanguage(language, { manual = false } = {}) {
  if (typeof window === 'undefined') return

  const normalizedLanguage = normalizeLanguage(language)
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage)

  if (manual) {
    window.localStorage.setItem(LANGUAGE_MANUAL_STORAGE_KEY, '1')
  }
}

export function applyConfiguredDefaultLanguage(i18n, configuredLanguage) {
  if (!i18n || hasManualLanguageSelection()) return

  const nextLanguage = normalizeLanguage(configuredLanguage)
  if (normalizeLanguage(i18n.language) !== nextLanguage) {
    i18n.changeLanguage(nextLanguage)
  }
  saveLanguage(nextLanguage)
}
