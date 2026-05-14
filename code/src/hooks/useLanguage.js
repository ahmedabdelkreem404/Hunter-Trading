import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { readStoredLanguage, saveLanguage } from '../utils/language'

export function useLanguage() {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState(() => {
    return readStoredLanguage()
  })

  useEffect(() => {
    i18n.changeLanguage(language)
    saveLanguage(language)
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language, i18n])

  const toggleLanguage = () => {
    setLanguage(prev => {
      const nextLanguage = prev === 'en' ? 'ar' : 'en'
      saveLanguage(nextLanguage, { manual: true })
      return nextLanguage
    })
  }

  return { language, setLanguage, toggleLanguage }
}
