import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CalendarClock, Newspaper, Tag, TrendingUp } from 'lucide-react'
import { marketAPI, sectionSettingsAPI, settingsAPI } from '../../api'
import useApiData from '../../hooks/useApiData'

const selectUpdates = (response) => response.data ?? []
const MARKET_REFRESH_INTERVAL = 30000

export default function MarketSection() {
  const { i18n, t } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { data: updates } = useApiData(
    marketAPI.getPublic,
    [],
    selectUpdates,
    [],
    { refreshInterval: MARKET_REFRESH_INTERVAL }
  )
  const { data: sections } = useApiData(
    sectionSettingsAPI.getPublic,
    [],
    (response) => response.data ?? [],
    [],
    { refreshInterval: MARKET_REFRESH_INTERVAL }
  )
  const { data: settings } = useApiData(
    settingsAPI.getPublic,
    {},
    (response) => response.data ?? {},
    [],
    { refreshInterval: MARKET_REFRESH_INTERVAL }
  )
  const section = sections.find((item) => item.section_key === 'market') ?? {}
  const telegramLink =
    settings.general?.telegram_url?.value ||
    settings.general?.free_telegram_url?.value ||
    'https://t.me/hunter_tradeing'

  return (
    <section id="market" className="relative bg-hunter-card py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="section-title">
            {(isArabic ? section.title_ar : section.title_en) || t('signals.title')}
          </h2>
          <p className="section-subtitle">
            {(isArabic ? section.subtitle_ar : section.subtitle_en) || 'تابع أحدث تحليلات السوق والتحديثات من مصدر واحد.'}
          </p>
        </motion.div>

        {updates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {updates.map((update, index) => {
              const title = isArabic ? update.title_ar || update.title_en : update.title_en || update.title_ar
              const summary = isArabic ? update.summary_ar || update.summary_en : update.summary_en || update.summary_ar
              const content = isArabic ? update.content_ar || update.content_en : update.content_en || update.content_ar
              const tags = Array.isArray(update.tags_json)
                ? update.tags_json
                : (() => {
                    try {
                      return update.tags_json ? JSON.parse(update.tags_json) : []
                    } catch {
                      return []
                    }
                  })()

              return (
                <motion.article
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-[1.8rem] border border-white/10 bg-hunter-bg p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                >
                  {update.image_url ? (
                    <img src={update.image_url} alt={title} className="mb-5 h-52 w-full rounded-[1.25rem] object-cover" />
                  ) : (
                    <div className="mb-5 flex h-52 items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/5">
                      <TrendingUp className="h-12 w-12 text-hunter-green" />
                    </div>
                  )}

                  <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-hunter-text-muted">
                    <span className="inline-flex items-center gap-1 rounded-full bg-hunter-green/10 px-3 py-1 text-hunter-green">
                      <Newspaper className="h-3.5 w-3.5" />
                      {update.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {update.published_at}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-hunter-text">{title}</h3>
                  {summary ? <p className="mt-3 text-sm leading-7 text-hunter-text-muted">{summary}</p> : null}
                  {content ? <p className="mt-3 text-sm leading-7 text-hunter-text">{content}</p> : null}

                  {tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-hunter-text-muted">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </motion.article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-hunter-bg p-10 text-center text-hunter-text-muted">
            لا توجد تحديثات سوق منشورة حاليًا.
          </div>
        )}

        <div className="mt-8 text-center">
          <a href={telegramLink} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2">
            {(isArabic ? section.cta_label_ar : section.cta_label_en) || 'انضم لتيليجرام'}
          </a>
        </div>
      </div>
    </section>
  )
}
