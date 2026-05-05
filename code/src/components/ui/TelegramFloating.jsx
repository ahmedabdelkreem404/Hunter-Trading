import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { settingsAPI } from '../../api'
import useApiData from '../../hooks/useApiData'

const LIVE_REFRESH_INTERVAL = 0

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.52 0 .2 5.32.2 11.86c0 2.08.54 4.11 1.57 5.9L0 24l6.41-1.68a11.8 11.8 0 0 0 5.65 1.44h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.41-8.42zM12.07 21.8h-.01a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.8 1 1.01-3.71-.24-.38a9.83 9.83 0 0 1-1.51-5.27c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.02 6.96 2.88a9.79 9.79 0 0 1 2.89 6.98c0 5.43-4.42 9.85-9.79 9.85zm5.4-7.36c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.15-.19.29-.76.94-.93 1.13-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.43-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.19.05-.36-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.49-.49-.66-.5h-.56c-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.44 0 1.44 1.04 2.83 1.19 3.03.15.19 2.05 3.13 4.96 4.39.69.3 1.24.48 1.66.61.7.22 1.34.19 1.85.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.39-.07-.12-.27-.19-.56-.34z" />
  </svg>
)

export default function TelegramFloating() {
  const { t, i18n } = useTranslation()
  const { data: settings } = useApiData(
    settingsAPI.getPublic,
    {},
    (response) => response.data ?? {},
    [],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )
  const telegramUrl =
    settings.general?.telegram_url?.value ||
    settings.general?.free_telegram_url?.value ||
    'https://t.me/hunter_tradeing'
  const whatsappUrl = settings.general?.whatsapp_url?.value || ''
  const whatsappLabel = i18n.language === 'ar' ? 'تواصل واتساب' : 'WhatsApp'

  const handleTelegramClick = () => {
    window.open(telegramUrl, '_blank')
  }

  const handleWhatsAppClick = () => {
    if (!whatsappUrl) return
    window.open(whatsappUrl, '_blank')
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed bottom-8 right-8 z-50 flex flex-col gap-3"
    >
      <motion.button
        onClick={handleTelegramClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 4px 20px rgba(0, 136, 204, 0.4)',
            '0 4px 30px rgba(0, 136, 204, 0.6)',
            '0 4px 20px rgba(0, 136, 204, 0.4)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#0088cc] to-[#0066aa] flex items-center justify-center text-white shadow-lg overflow-hidden group"
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-[#0088cc] animate-ping opacity-20" />
        
        {/* Icon */}
        <TelegramIcon />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-3 py-2 bg-hunter-card rounded-lg text-sm text-hunter-text whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
          {t('hero.cta_telegram')}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-hunter-card" />
        </div>
      </motion.button>

      {whatsappUrl && (
        <motion.button
          onClick={handleWhatsAppClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 4px 20px rgba(37, 211, 102, 0.35)',
              '0 4px 30px rgba(37, 211, 102, 0.5)',
              '0 4px 20px rgba(37, 211, 102, 0.35)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-lg group flex items-center justify-center"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
          <WhatsAppIcon />
          <div className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-hunter-card px-3 py-2 text-sm text-hunter-text opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
            {whatsappLabel}
            <div className="absolute right-0 top-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rotate-45 bg-hunter-card" />
          </div>
        </motion.button>
      )}
    </motion.div>
  )
}
