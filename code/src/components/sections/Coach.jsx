import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Award, Users, TrendingUp } from 'lucide-react'
import { coachAPI, sectionSettingsAPI, settingsAPI } from '../../api'
import { useTheme } from '../../contexts/ThemeContext'
import useApiData from '../../hooks/useApiData'
import AnimatedStatValue from '../ui/AnimatedStatValue'
import SocialBrandIcon, { buildSocialLinksFromSettings, getSocialBrand, normalizeSocialUrl } from '../ui/SocialBrandIcon'

const LIVE_REFRESH_INTERVAL = 0

const emptyProfile = {
  name_en: '',
  name_ar: '',
  title_en: '',
  title_ar: '',
  bio_intro: '',
  bio_success: '',
  bio_en: '',
  bio_ar: '',
  image_url: null,
  experience_years: '',
  students_count: '',
  profit_shared: '',
  social_links: [],
}

const selectCoach = (response) => {
  if (!response.data) {
    return emptyProfile
  }

  return {
    ...emptyProfile,
    ...response.data,
    bio_intro: response.data.bio_intro || '',
    bio_success: response.data.bio_success || '',
    students_count: response.data.students_count ? `${Number(response.data.students_count).toLocaleString()}+` : '',
    social_links: Array.isArray(response.data.social_links) ? response.data.social_links : [],
  }
}

function splitTextBlocks(...values) {
  return values
    .flatMap((value) => String(value || '').split(/\n\s*\n/g))
    .map((value) => value.trim())
    .filter(Boolean)
}

export default function Coach() {
  const { t, i18n } = useTranslation()
  const { isDarkMode } = useTheme()
  const isInView = true
  const { data: coachProfile } = useApiData(
    coachAPI.getProfile,
    emptyProfile,
    selectCoach,
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

  const isArabic = i18n.language === 'ar'
  const coachName = isArabic ? coachProfile.name_ar : coachProfile.name_en
  const coachTitle = isArabic ? coachProfile.title_ar : coachProfile.title_en
  const coachSection = sections.find((section) => section.section_key === 'coach') ?? {}
  const socialLinks = buildSocialLinksFromSettings(publicSettings.general ?? {})
  const primaryBio = (isArabic ? coachProfile.bio_ar : coachProfile.bio_en) || coachProfile.bio_intro || ''
  const secondaryBio = coachProfile.bio_success &&
    coachProfile.bio_success !== primaryBio &&
    coachProfile.bio_success !== coachProfile.bio_intro
    ? coachProfile.bio_success
    : ''
  const bioParagraphs = splitTextBlocks(primaryBio, secondaryBio)

  const coachStats = [
    { icon: Award, value: coachProfile.experience_years, label: t('coach.experience'), suffix: '+' },
    { icon: Users, value: coachProfile.students_count, label: t('coach.students'), suffix: '' },
    { icon: TrendingUp, value: coachProfile.profit_shared, label: t('coach.profit_shared'), suffix: '' },
  ].filter((stat) => stat.value !== '' && stat.value !== null && stat.value !== undefined)
  const sectionTitle = (isArabic ? coachSection.title_ar : coachSection.title_en) || ''
  const hasCoachContent = Boolean(sectionTitle || coachName || coachTitle || bioParagraphs.length || coachProfile.image_url || coachStats.length || socialLinks.length)

  if (!hasCoachContent) {
    return null
  }

  return (
    <section id="coach" className="relative overflow-hidden bg-hunter-card py-10 sm:py-12 md:py-20 xl:py-28">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-hunter-green blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-hunter-blue blur-3xl sm:h-96 sm:w-96" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center sm:mb-10 md:mb-14"
        >
          {sectionTitle ? <h2 className="section-title">{sectionTitle}</h2> : null}
        </motion.div>

        <div className="grid items-center gap-5 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative mx-auto w-full max-w-[21rem] sm:max-w-[26rem] lg:max-w-[34rem] [perspective:2200px]">
              <div className="absolute inset-5 rounded-[2rem] bg-hunter-gradient opacity-20 blur-[60px] sm:inset-14 sm:rounded-[3rem] sm:blur-[120px]" />
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-hunter-green/20 blur-3xl sm:-left-10 sm:-top-10 sm:h-40 sm:w-40" />
              <div className="absolute top-1/3 -right-4 h-28 w-28 rounded-full bg-hunter-blue/20 blur-3xl sm:-right-8 sm:h-44 sm:w-44" />
              <div className="absolute -bottom-6 left-1/2 h-20 w-36 -translate-x-1/2 rounded-full bg-black/35 blur-3xl sm:-bottom-8 sm:h-32 sm:w-52" />

              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="relative"
              >
                <div className={`relative overflow-hidden rounded-[1.75rem] shadow-[0_28px_70px_rgba(0,0,0,0.18)] sm:rounded-[2.5rem] sm:shadow-[0_45px_120px_rgba(0,0,0,0.18)] ${
                  isDarkMode
                    ? 'bg-[linear-gradient(160deg,rgba(18,26,34,0.98),rgba(9,14,22,0.94))]'
                    : 'bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(240,246,255,0.95))] ring-1 ring-slate-200/80'
                }`}>
                  <div className={`absolute inset-0 ${
                    isDarkMode
                      ? 'bg-[radial-gradient(circle_at_top,rgba(35,210,153,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(35,101,255,0.14),transparent_34%)]'
                      : 'bg-[radial-gradient(circle_at_top,rgba(35,210,153,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(35,101,255,0.10),transparent_34%)]'
                  }`} />
                  <div className={`absolute inset-x-0 top-0 h-24 ${
                    isDarkMode ? 'bg-gradient-to-b from-white/8 to-transparent' : 'bg-gradient-to-b from-white/80 to-transparent'
                  }`} />
                  <div className="relative p-2.5 sm:p-6 lg:p-7">
                    {coachProfile.image_url ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                        transition={{ duration: 0.85, delay: 0.12 }}
                        className={`relative aspect-[4/5] overflow-hidden rounded-[1.35rem] sm:aspect-[4/5] sm:rounded-[2rem] lg:aspect-auto ${isDarkMode ? 'shadow-[0_22px_60px_rgba(0,0,0,0.3)] sm:shadow-[0_30px_90px_rgba(0,0,0,0.34)]' : 'shadow-[0_18px_40px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/80 sm:shadow-[0_24px_60px_rgba(15,23,42,0.16)]'}`}
                      >
                        <div className={`absolute inset-0 z-10 ${
                          isDarkMode
                            ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_18%,transparent_60%,rgba(4,7,11,0.34)_100%)]'
                            : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_16%,transparent_65%,rgba(148,163,184,0.18)_100%)]'
                        }`} />
                        <img
                          src={coachProfile.image_url}
                          alt={coachName}
                          className="h-full w-full bg-hunter-bg/60 object-cover object-center sm:h-full lg:h-[34rem]"
                        />
                      </motion.div>
                    ) : (
                      <div className="flex aspect-[4/5] items-center justify-center rounded-[1.35rem] bg-hunter-gradient sm:aspect-[4/5] sm:rounded-[2rem] lg:h-[34rem] lg:aspect-auto">
                        <span className="font-heading text-6xl font-bold text-hunter-bg sm:text-8xl">
                          {coachName ? coachName.charAt(0) : ''}
                        </span>
                      </div>
                    )}

                    <div className="pt-3 text-center sm:pt-6">
                      {coachName ? <h3 className="font-heading text-2xl font-bold text-hunter-text sm:text-4xl lg:text-5xl">{coachName}</h3> : null}
                      {coachTitle ? <p className="mt-2 text-sm text-hunter-text-muted sm:mt-3 sm:text-lg lg:text-xl">{coachTitle}</p> : null}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5 text-center lg:text-start"
          >
            {bioParagraphs.length > 0 ? (
              <div className="mx-auto max-w-2xl space-y-4 lg:mx-0">
                {bioParagraphs.map((paragraph, index) => {
                  const isEmphasized = index === 0 || index === bioParagraphs.length - 1

                  return (
                    <p
                      key={`${paragraph.slice(0, 20)}-${index}`}
                      className={`text-sm leading-7 sm:text-base sm:leading-8 ${
                        isEmphasized
                          ? 'font-semibold text-hunter-text'
                          : 'text-hunter-text-muted'
                      }`}
                    >
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            ) : null}

            <div className="grid grid-cols-3 gap-2 pt-4 sm:gap-4 sm:pt-6">
              {coachStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-center sm:p-4"
                >
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-hunter-green/10 sm:mb-3 sm:h-12 sm:w-12">
                    <stat.icon className="h-4 w-4 text-hunter-green sm:h-6 sm:w-6" />
                  </div>
                  <div className="mb-1 truncate font-heading text-base font-bold text-hunter-green sm:text-2xl md:text-3xl">
                    <AnimatedStatValue value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] leading-4 text-hunter-text-muted sm:text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {socialLinks.length > 0 && (
              <div className="pt-4 sm:pt-6">
                <div className="mx-auto flex w-full max-w-sm flex-wrap justify-center gap-2 lg:mx-0 lg:max-w-none lg:justify-start lg:gap-3">
                  {socialLinks.map((link, index) => {
                    const platform = link.platform || link.label || link.name || link.url
                    const brand = getSocialBrand(platform)

                    return (
                      <motion.a
                        key={link.id ?? `${link.platform}-${index}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.75 + index * 0.08 }}
                        href={normalizeSocialUrl(link.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white/5 text-sm font-medium text-hunter-text transition hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-lg sm:h-auto sm:w-auto sm:gap-3 sm:px-4 sm:py-3"
                        style={{ borderColor: brand.border }}
                        aria-label={link.label || link.name || brand.label || link.platform}
                        title={link.label || link.name || brand.label || link.platform}
                      >
                        <span
                          className="inline-flex h-full w-full items-center justify-center rounded-xl border sm:h-10 sm:w-10"
                          style={{
                            color: brand.color,
                            background: brand.background,
                            borderColor: brand.border,
                          }}
                        >
                          <SocialBrandIcon platform={platform} className="h-5 w-5" />
                        </span>
                        <span className="hidden sm:inline">{link.label || link.name || brand.label || link.platform}</span>
                      </motion.a>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
