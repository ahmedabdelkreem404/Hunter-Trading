import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageDirectionSync() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const language = i18n.language === 'ar' ? 'ar' : 'en'
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.classList.toggle('is-rtl', language === 'ar')
    document.documentElement.classList.toggle('is-ltr', language !== 'ar')
  }, [i18n.language])

  return null
}
