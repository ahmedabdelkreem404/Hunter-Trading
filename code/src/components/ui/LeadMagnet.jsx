import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { X, Download, CheckCircle, Loader2 } from 'lucide-react'
import axios from 'axios'

export default function LeadMagnet({ onClose }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const isArabic = document.documentElement.dir === 'rtl'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In production, this would be:
      // await axios.post('/api/leads', formData)
      
      setStatus('success')
      
      // Close after showing success
      setTimeout(() => {
        onClose()
        // Open Telegram after closing
        window.open('https://t.me/hunter_tradeing', '_blank')
      }, 2000)
    } catch (error) {
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md bg-hunter-card rounded-2xl border border-white/10 overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
          aria-label={isArabic ? 'إغلاق النافذة' : 'Close modal'}
        >
          <X className="w-5 h-5 text-hunter-text-muted" />
        </button>

        {status === 'success' ? (
          // Success State
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-hunter-green/10 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-hunter-green" />
            </motion.div>
            <h3 className="font-heading text-2xl font-bold text-hunter-text mb-2">
              {t('lead_magnet.success')}
            </h3>
            <p className="text-hunter-text-muted">
              {isArabic ? 'سيتم تحويلك إلى تيليجرام...' : 'Redirecting you to Telegram...'}
            </p>
          </div>
        ) : (
          // Form State
          <>
            {/* Header */}
            <div className="p-8 text-center border-b border-white/10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-hunter-gradient flex items-center justify-center">
                <Download className="w-8 h-8 text-hunter-bg" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-hunter-text mb-2">
                {t('lead_magnet.title')}
              </h3>
              <p className="text-hunter-text-muted">
                {t('lead_magnet.subtitle')}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder={t('lead_magnet.name_placeholder')}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-hunter-text placeholder:text-hunter-text-muted focus:border-hunter-green focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={t('lead_magnet.email_placeholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-hunter-text placeholder:text-hunter-text-muted focus:border-hunter-green focus:outline-none transition-colors"
                />
              </div>

              {status === 'error' && (
                <p className="text-hunter-red text-sm text-center">
                  {t('lead_magnet.error')}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isArabic ? 'جارٍ المعالجة...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    {t('lead_magnet.submit')}
                  </>
                )}
              </motion.button>

              <p className="text-center text-hunter-text-muted text-xs">
                {isArabic ? 'نحترم خصوصيتك ويمكنك إلغاء الاشتراك في أي وقت.' : 'We respect your privacy. Unsubscribe at any time.'}
              </p>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
