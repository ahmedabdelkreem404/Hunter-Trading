import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Send, Star } from 'lucide-react'
import { sectionSettingsAPI, settingsAPI, testimonialsAPI } from '../../api'
import useApiData from '../../hooks/useApiData'

const LIVE_REFRESH_INTERVAL = 0

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <Star key={index} className={`h-4 w-4 ${index < rating ? 'fill-hunter-green text-hunter-green' : 'text-gray-600'}`} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const { i18n, t } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { data: testimonials } = useApiData(
    testimonialsAPI.getAll,
    [],
    (response) => response.data ?? [],
    [],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )
  const { data: sections } = useApiData(
    sectionSettingsAPI.getPublic,
    [],
    (response) => response.data ?? [],
    [],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )
  const { data: publicSettings } = useApiData(
    settingsAPI.getPublic,
    {},
    (response) => response.data ?? {},
    [],
    { refreshInterval: LIVE_REFRESH_INTERVAL }
  )
  const section = sections.find((item) => item.section_key === 'testimonials') ?? {}
  const telegramUrl = publicSettings.general?.telegram_url?.value || publicSettings.general?.free_telegram_url?.value || 'https://t.me/hunter_tradeing'

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const ctaLabel = isArabic ? section.cta_label_ar : section.cta_label_en
  const ctaUrl = section.cta_url || telegramUrl

  return (
    <section id="testimonials" className="relative overflow-hidden bg-hunter-card py-20 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-hunter-green/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="section-title">{(isArabic ? section.title_ar : section.title_en) || t('testimonials.title')}</h2>
          <p className="section-subtitle">{(isArabic ? section.subtitle_ar : section.subtitle_en) || t('testimonials.subtitle')}</p>
        </motion.div>

        {testimonials.length > 0 ? (
          <>
            <div className="relative">
              <div className="overflow-hidden">
                <motion.div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                      <div className="mx-auto max-w-3xl">
                        <div className="card text-center">
                          <div className="mb-6">
                            {testimonial.image_url ? (
                              <img src={testimonial.image_url} alt={testimonial.name} className="mx-auto mb-4 h-20 w-20 rounded-full border border-hunter-green/20 object-cover" />
                            ) : (
                              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-hunter-gradient">
                                <span className="text-2xl font-heading font-bold text-hunter-bg">
                                  {testimonial.name?.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                                </span>
                              </div>
                            )}
                            <h4 className="font-heading text-lg font-semibold text-hunter-text">{testimonial.name}</h4>
                            <p className="text-sm text-hunter-text-muted">{testimonial.location}</p>
                          </div>

                          <div className="mb-6 flex justify-center">
                            <StarRating rating={testimonial.rating || 5} />
                          </div>

                          <p className="mb-6 text-lg leading-relaxed text-hunter-text">
                            "{isArabic ? testimonial.content_ar || testimonial.content_en : testimonial.content_en || testimonial.content_ar}"
                          </p>

                          {testimonial.video_url ? (
                            <div className="flex justify-center">
                              <a href={testimonial.video_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-hunter-green hover:underline">
                                <Play className="h-5 w-5" />
                                <span>{isArabic ? 'شاهد الفيديو' : 'Watch Video'}</span>
                              </a>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {testimonials.length > 1 ? (
                <>
                  <button
                    onClick={() => {
                      setIsAutoPlaying(false)
                      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                    }}
                    className="absolute left-0 top-1/2 h-12 w-12 -translate-x-4 -translate-y-1/2 rounded-full border border-white/10 bg-hunter-card flex items-center justify-center transition-colors hover:border-hunter-green md:-translate-x-12"
                    aria-label={isArabic ? 'الرأي السابق' : 'Previous testimonial'}
                  >
                    <ChevronLeft className="h-6 w-6 text-hunter-text" />
                  </button>
                  <button
                    onClick={() => {
                      setIsAutoPlaying(false)
                      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
                    }}
                    className="absolute right-0 top-1/2 h-12 w-12 translate-x-4 -translate-y-1/2 rounded-full border border-white/10 bg-hunter-card flex items-center justify-center transition-colors hover:border-hunter-green md:translate-x-12"
                    aria-label={isArabic ? 'الرأي التالي' : 'Next testimonial'}
                  >
                    <ChevronRight className="h-6 w-6 text-hunter-text" />
                  </button>
                </>
              ) : null}
            </div>

            {testimonials.length > 1 ? (
              <div className="mt-8 flex justify-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false)
                      setCurrentIndex(index)
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-hunter-green' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                    aria-label={isArabic ? `اذهب إلى الرأي ${index + 1}` : `Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}

            {ctaUrl ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-6 flex justify-center"
              >
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-2xl bg-hunter-green px-6 py-3 text-sm font-semibold text-hunter-bg shadow-[0_18px_50px_rgba(35,210,153,0.28)] transition hover:-translate-y-0.5 hover:bg-hunter-green/90"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/10">
                    <Send className="h-5 w-5" />
                  </span>
                  <span>{ctaLabel || (isArabic ? 'تابع أرباح عملاءنا من هنا' : 'Follow Our Clients Profits Here')}</span>
                </a>
              </motion.div>
            ) : null}
          </>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-hunter-bg p-10 text-center text-hunter-text-muted">
            لا توجد آراء منشورة حاليًا.
          </div>
        )}
      </div>
    </section>
  )
}
