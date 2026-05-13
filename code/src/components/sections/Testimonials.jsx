import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Send, Star } from 'lucide-react'
import { sectionSettingsAPI, settingsAPI, testimonialsAPI } from '../../api'
import useApiData from '../../hooks/useApiData'

const LIVE_REFRESH_INTERVAL = 0

function StarRating({ rating }) {
  return (
    <div className="flex justify-center gap-0.5 sm:gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${index < rating ? 'fill-hunter-green text-hunter-green' : 'text-gray-600'}`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial, isArabic }) {
  const content = isArabic
    ? testimonial.content_ar || testimonial.content_en
    : testimonial.content_en || testimonial.content_ar
  const initials = testimonial.name?.split(' ').map((part) => part[0]).join('').slice(0, 2)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-[1.5rem] border border-white/10 bg-hunter-bg/85 p-4 text-center shadow-[0_14px_50px_rgba(0,0,0,0.16)] backdrop-blur sm:rounded-[1.75rem] sm:p-8">
        <div className="mb-3 sm:mb-4">
          {testimonial.image_url ? (
            <img
              src={testimonial.image_url}
              alt={testimonial.name}
              className="mx-auto mb-2.5 h-12 w-12 rounded-full border border-hunter-green/20 object-cover sm:mb-3 sm:h-16 sm:w-16"
            />
          ) : (
            <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-full bg-hunter-gradient sm:mb-3 sm:h-16 sm:w-16">
              <span className="font-heading text-lg font-bold text-hunter-bg sm:text-xl">{initials}</span>
            </div>
          )}
          <h4 className="font-heading text-base font-semibold text-hunter-text sm:text-lg">{testimonial.name}</h4>
          {testimonial.location ? (
            <p className="text-xs text-hunter-text-muted sm:text-sm">{testimonial.location}</p>
          ) : null}
        </div>

        <div className="mb-3 sm:mb-4">
          <StarRating rating={testimonial.rating || 5} />
        </div>

        <p className="mb-2 line-clamp-3 text-sm leading-6 text-hunter-text sm:mb-4 sm:line-clamp-none sm:text-base sm:leading-8">
          "{content}"
        </p>

        {testimonial.video_url ? (
          <div className="flex justify-center">
            <a
              href={testimonial.video_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-hunter-green/25 px-3 py-2 text-xs font-semibold text-hunter-green hover:bg-hunter-green/10 sm:text-sm"
            >
              <Play className="h-4 w-4" />
              <span>{isArabic ? 'شاهد الفيديو' : 'Watch Video'}</span>
            </a>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { i18n } = useTranslation()
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
  const telegramUrl = publicSettings.general?.telegram_url?.value || publicSettings.general?.free_telegram_url?.value || ''

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return undefined

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  useEffect(() => {
    if (currentIndex >= testimonials.length) {
      setCurrentIndex(0)
    }
  }, [currentIndex, testimonials.length])

  const ctaLabel = isArabic ? section.cta_label_ar : section.cta_label_en
  const ctaUrl = section.cta_url || telegramUrl
  const hasMultipleTestimonials = testimonials.length > 1
  const sectionTitle = (isArabic ? section.title_ar : section.title_en) || ''
  const sectionSubtitle = (isArabic ? section.subtitle_ar : section.subtitle_en) || ''

  if (testimonials.length === 0) {
    return null
  }

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section id="testimonials" className="relative overflow-hidden bg-hunter-card py-7 sm:py-12 md:py-20 xl:py-28">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-hunter-green/5 blur-3xl sm:h-[640px] sm:w-[640px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-5 text-center sm:mb-10 md:mb-14"
        >
          {sectionTitle ? <h2 className="section-title">{sectionTitle}</h2> : null}
          {sectionSubtitle ? <p className="section-subtitle">{sectionSubtitle}</p> : null}
        </motion.div>

        <>
            <div className="relative mx-auto max-w-3xl">
              <div className="overflow-hidden" dir="ltr">
                <motion.div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="w-full flex-shrink-0 px-0 sm:px-4" dir={isArabic ? 'rtl' : 'ltr'}>
                      <TestimonialCard testimonial={testimonial} isArabic={isArabic} />
                    </div>
                  ))}
                </motion.div>
              </div>

              {hasMultipleTestimonials ? (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-hunter-card/95 transition-colors hover:border-hunter-green sm:flex md:-translate-x-12"
                    aria-label={isArabic ? 'الرأي السابق' : 'Previous testimonial'}
                  >
                    <ChevronLeft className="h-5 w-5 text-hunter-text" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-hunter-card/95 transition-colors hover:border-hunter-green sm:flex md:translate-x-12"
                    aria-label={isArabic ? 'الرأي التالي' : 'Next testimonial'}
                  >
                    <ChevronRight className="h-5 w-5 text-hunter-text" />
                  </button>
                </>
              ) : null}
            </div>

            {hasMultipleTestimonials ? (
              <div className="mt-4 flex items-center justify-center gap-3 sm:mt-5">
                <button
                  type="button"
                  onClick={goToNext}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-hunter-text transition hover:border-hunter-green hover:text-hunter-green sm:hidden"
                  aria-label={isArabic ? 'الرأي التالي' : 'Next testimonial'}
                >
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </button>
                <div className="flex items-center justify-center gap-1.5">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsAutoPlaying(false)
                        setCurrentIndex(index)
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-7 bg-hunter-green' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                      aria-label={isArabic ? `اذهب إلى الرأي ${index + 1}` : `Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-hunter-text transition hover:border-hunter-green hover:text-hunter-green sm:hidden"
                  aria-label={isArabic ? 'الرأي السابق' : 'Previous testimonial'}
                >
                  <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                </button>
              </div>
            ) : null}

            {ctaUrl && ctaLabel ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-4 flex justify-center sm:mt-5"
              >
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full max-w-sm items-center justify-center gap-3 rounded-2xl bg-hunter-green px-5 py-3 text-sm font-semibold text-hunter-bg shadow-[0_18px_50px_rgba(35,210,153,0.28)] transition hover:-translate-y-0.5 hover:bg-hunter-green/90 sm:w-auto sm:px-6"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/10">
                    <Send className="h-4 w-4" />
                  </span>
                  <span>{ctaLabel}</span>
                </a>
              </motion.div>
            ) : null}
          </>
      </div>
    </section>
  )
}
