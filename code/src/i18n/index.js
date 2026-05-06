import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ar from './ar.json'

function applyLanguageDirection(language = 'en') {
  const normalizedLanguage = language === 'ar' ? 'ar' : 'en'
  document.documentElement.lang = normalizedLanguage
  document.documentElement.dir = normalizedLanguage === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.classList.toggle('is-rtl', normalizedLanguage === 'ar')
  document.documentElement.classList.toggle('is-ltr', normalizedLanguage !== 'ar')
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

i18n.on('languageChanged', applyLanguageDirection)
applyLanguageDirection(i18n.language)

export default i18n
