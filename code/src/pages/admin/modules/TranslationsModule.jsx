import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { ActionButton, SectionCard } from './shared/AdminUI'
import { getAdminPaymentMethods, serializePaymentMethods } from '../../../utils/paymentMethods'

const sectionNames = {
  hero: 'الرئيسية / الهيرو',
  funded: 'الحسابات الممولة',
  vip: 'VIP',
  scalp: 'السكالب',
  offers: 'العروض',
  courses: 'الدورات',
  testimonials: 'آراء العملاء',
  market: 'متابعة السوق',
  coach: 'المدرب',
  navigation: 'النافبار',
  footer: 'الفوتر',
}

function updateListItem(list, index, changes) {
  const next = Array.isArray(list) ? [...list] : []
  while (next.length <= index) next.push({})
  next[index] = { ...next[index], ...changes }
  return next
}

function sortItems(items = []) {
  return [...items].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
}

function textPreview(value) {
  return value ? String(value) : 'لم يتم إدخال نص عربي بعد'
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064b-\u065f\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim()
}

function rowMatchesSearch(row, query) {
  const needle = normalizeSearchText(query)
  if (!needle) return true

  return [row.key, row.arabic, row.value]
    .map(normalizeSearchText)
    .some((value) => value.includes(needle))
}

function TranslationInput({ value, onChange, multiline }) {
  if (multiline) {
    return (
      <textarea
        value={value || ''}
        onChange={onChange}
        placeholder="الترجمة الإنجليزية اختيارية"
        className="translation-input"
      />
    )
  }

  return (
    <input
      value={value || ''}
      onChange={onChange}
      placeholder="الترجمة الإنجليزية اختيارية"
      className="translation-input"
    />
  )
}

function TranslationTable({ title, rows = [], searchQuery = '' }) {
  const visibleRows = rows.filter((row) => rowMatchesSearch(row, searchQuery))
  const isSearching = normalizeSearchText(searchQuery).length > 0

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold text-hunter-green sm:text-base">{title}</h3>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
          {isSearching ? `${visibleRows.length} / ${rows.length}` : rows.length} عنصر
        </span>
      </div>

      {visibleRows.length > 0 ? (
        <>
        <div className="translations-mobile-list divide-y divide-white/10">
          {visibleRows.map((row) => (
            <div key={row.id} className="space-y-3 p-3">
              <div className="break-words rounded-xl border border-hunter-green/20 bg-hunter-green/10 px-3 py-2 text-xs font-semibold leading-6 text-hunter-green">
                {row.key}
              </div>
              <div className="grid min-w-0 grid-cols-2 items-stretch gap-2">
                <div className="min-w-0">
                  <div className="mb-1 text-[11px] font-semibold text-slate-500">العربي</div>
                  <div className="min-h-[4.6rem] max-h-40 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-xs leading-6 text-slate-100">
                    {textPreview(row.arabic)}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="mb-1 text-[11px] font-semibold text-cyan-300">الإنجليزي اختياري</div>
                  <TranslationInput value={row.value} onChange={row.onChange} multiline={row.multiline} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="translations-desktop-table overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed text-right text-sm">
            <thead className="bg-slate-900/80 text-xs text-slate-400">
              <tr>
                <th className="w-[22%] px-4 py-3 font-semibold">المفتاح / المكان</th>
                <th className="w-[38%] px-4 py-3 font-semibold">النص العربي</th>
                <th className="w-[40%] px-4 py-3 font-semibold">الترجمة الإنجليزية (اختياري)</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id} className="border-t border-white/10 align-top">
                  <td className="px-4 py-3">
                    <div className="break-words rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-semibold leading-6 text-slate-300">
                      {row.key}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="min-h-[3.25rem] max-h-36 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 leading-7 text-slate-100">
                      {textPreview(row.arabic)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <TranslationInput value={row.value} onChange={row.onChange} multiline={row.multiline} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      ) : (
        <div className="p-5 text-center text-sm text-slate-500">
          {isSearching ? 'لا توجد نتيجة مطابقة لكلمة البحث في هذا الجدول.' : 'لا توجد عناصر عربية مضافة هنا حتى الآن.'}
        </div>
      )}
    </div>
  )
}

function TranslationsSearchBox({ value, onChange, totalRows, visibleRows }) {
  return (
    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block min-w-0 flex-1">
          <span className="admin-label">بحث سريع داخل كل جداول الترجمات</span>
          <Search className="pointer-events-none absolute start-4 top-[2.65rem] h-5 w-5 text-cyan-200" />
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="اكتب كلمة عربي، إنجليزي، اسم خدمة، زر، أو رابط..."
            className="admin-input pe-12 ps-12"
          />
          {value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute end-3 top-[2.52rem] rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="مسح البحث"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>
        <div className="rounded-xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-300">
          {value ? (
            <>
              النتائج: <span className="font-bold text-cyan-200">{visibleRows}</span> من <span className="font-bold text-white">{totalRows}</span>
            </>
          ) : (
            <>
              إجمالي عناصر الترجمة: <span className="font-bold text-white">{totalRows}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TranslationNotice() {
  return (
    <div className="rounded-2xl border border-hunter-green/20 bg-hunter-green/10 p-4 text-sm leading-7 text-slate-200">
      أي نص عربي تضيفه أو تعدله في أي تاب سيظهر هنا تلقائيا في جدول الترجمات. خانة الإنجليزية اختيارية ويمكن تركها فارغة.
    </div>
  )
}

export default function TranslationsModule({
  sections,
  setSections,
  onSaveSections,
  services,
  setServices,
  onSaveService,
  coach,
  setCoach,
  onSaveCoach,
  testimonials,
  setTestimonials,
  onSaveTestimonial,
  marketUpdates,
  setMarketUpdates,
  onSaveMarketUpdate,
  settings,
  setSettings,
  onSaveSettings,
  saving,
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const updateSection = (sectionKey, changes) => {
    setSections((current) => current.map((section) => (section.section_key === sectionKey ? { ...section, ...changes } : section)))
  }

  const updateSectionSettings = (sectionKey, listKey, nextList) => {
    setSections((current) =>
      current.map((section) =>
        section.section_key === sectionKey
          ? { ...section, settings: { ...(section.settings || {}), [listKey]: nextList } }
          : section
      )
    )
  }

  const updateService = (id, updater) => {
    setServices((current) =>
      current.map((service) => (
        service.id === id
          ? (typeof updater === 'function' ? updater(service) : { ...service, ...updater })
          : service
      ))
    )
  }

  const updatePaymentMethods = (updater) => {
    const methods = getAdminPaymentMethods(settings)
    const next = typeof updater === 'function' ? updater(methods) : updater
    setSettings((current) => ({ ...current, payment_methods_json: serializePaymentMethods(next) }))
  }

  const navigation = sections.find((section) => section.section_key === 'navigation')
  const footer = sections.find((section) => section.section_key === 'footer')
  const paymentMethods = getAdminPaymentMethods(settings)

  const sectionRows = sections
    .filter((section) => !['navigation', 'footer'].includes(section.section_key))
    .flatMap((section) => {
      const label = sectionNames[section.section_key] || section.section_key
      const rows = [
        {
          id: `${section.section_key}-title`,
          key: `${label} / العنوان`,
          arabic: section.title_ar,
          value: section.title_en,
          onChange: (event) => updateSection(section.section_key, { title_en: event.target.value }),
        },
        {
          id: `${section.section_key}-subtitle`,
          key: `${label} / الوصف`,
          arabic: section.subtitle_ar,
          value: section.subtitle_en,
          multiline: true,
          onChange: (event) => updateSection(section.section_key, { subtitle_en: event.target.value }),
        },
        {
          id: `${section.section_key}-body`,
          key: `${label} / المحتوى الإضافي`,
          arabic: section.body_ar,
          value: section.body_en,
          multiline: true,
          onChange: (event) => updateSection(section.section_key, { body_en: event.target.value }),
        },
        {
          id: `${section.section_key}-cta`,
          key: `${label} / نص الزر`,
          arabic: section.cta_label_ar,
          value: section.cta_label_en,
          onChange: (event) => updateSection(section.section_key, { cta_label_en: event.target.value }),
        },
      ]

      if (section.section_key === 'hero' && Array.isArray(section.stats)) {
        rows.push(
          ...section.stats.map((stat, index) => ({
            id: `${section.section_key}-stat-${index}`,
            key: `${label} / إحصائية ${index + 1}${stat.value ? ` / ${stat.value}` : ''}`,
            arabic: stat.label_ar,
            value: stat.label_en,
            onChange: (event) => updateSection('hero', { stats: updateListItem(section.stats, index, { label_en: event.target.value }) }),
          }))
        )
      }

      return rows.filter((row) => row.arabic || row.value)
    })

  const linkRows = [
    ['النافبار', navigation, 'menu_items'],
    ['الفوتر / روابط سريعة', footer, 'quick_links'],
    ['الفوتر / روابط قانونية', footer, 'legal_links'],
  ].flatMap(([title, section, listKey]) => {
    const items = sortItems(section?.settings?.[listKey] || [])
    return items.map((item, index) => ({
      id: `${section?.section_key || title}-${listKey}-${index}`,
      key: `${title} / ${item.href || `رابط ${index + 1}`}`,
      arabic: item.label_ar,
      value: item.label_en,
      onChange: (event) => updateSectionSettings(section.section_key, listKey, updateListItem(items, index, { label_en: event.target.value })),
    }))
  })

  const serviceRows = services.flatMap((service) => {
    const title = service.title_ar || service.slug || `خدمة #${service.id}`
    const rows = [
      ['العنوان', service.title_ar, service.title_en, 'title_en'],
      ['العنوان الفرعي', service.subtitle_ar, service.subtitle_en, 'subtitle_en'],
      ['الوصف المختصر', service.short_description_ar, service.short_description_en, 'short_description_en', true],
      ['الوصف الكامل', service.full_description_ar, service.full_description_en, 'full_description_en', true],
      ['الشارة', service.badge_text_ar, service.badge_text_en, 'badge_text_en'],
      ['زر الكارت', service.cta_label_ar, service.cta_label_en, 'cta_label_en'],
      ['زر التفاصيل', service.details_button_label_ar, service.details_button_label_en, 'details_button_label_en'],
      ['الزر النهائي', service.final_cta_label_ar, service.final_cta_label_en, 'final_cta_label_en'],
      ['عنوان الشروط', service.terms_title_ar, service.terms_title_en, 'terms_title_en'],
      ['محتوى الشروط', service.terms_content_ar, service.terms_content_en, 'terms_content_en', true],
      ['تحذير المخاطر', service.risk_warning_ar, service.risk_warning_en, 'risk_warning_en', true],
    ].map(([key, arabic, value, field, multiline]) => ({
      id: `service-${service.id}-${field}`,
      key: `${title} / ${key}`,
      arabic,
      value,
      multiline,
      onChange: (event) => updateService(service.id, { [field]: event.target.value }),
    }))

    if (Array.isArray(service.features)) {
      rows.push(
        ...service.features.map((feature, index) => ({
          id: `service-${service.id}-feature-${index}`,
          key: `${title} / ميزة ${index + 1}`,
          arabic: feature.label_ar,
          value: feature.label_en,
          onChange: (event) => updateService(service.id, (item) => ({ ...item, features: updateListItem(item.features, index, { label_en: event.target.value }) })),
        }))
      )
    }

    if (Array.isArray(service.steps)) {
      service.steps.forEach((step, index) => {
        rows.push(
          {
            id: `service-${service.id}-step-title-${index}`,
            key: `${title} / عنوان خطوة ${index + 1}`,
            arabic: step.title_ar,
            value: step.title_en,
            onChange: (event) => updateService(service.id, (item) => ({ ...item, steps: updateListItem(item.steps, index, { title_en: event.target.value }) })),
          },
          {
            id: `service-${service.id}-step-desc-${index}`,
            key: `${title} / وصف خطوة ${index + 1}`,
            arabic: step.description_ar,
            value: step.description_en,
            multiline: true,
            onChange: (event) => updateService(service.id, (item) => ({ ...item, steps: updateListItem(item.steps, index, { description_en: event.target.value }) })),
          }
        )
      })
    }

    if (Array.isArray(service.faqs)) {
      service.faqs.forEach((faq, index) => {
        rows.push(
          {
            id: `service-${service.id}-faq-q-${index}`,
            key: `${title} / سؤال ${index + 1}`,
            arabic: faq.question_ar,
            value: faq.question_en,
            onChange: (event) => updateService(service.id, (item) => ({ ...item, faqs: updateListItem(item.faqs, index, { question_en: event.target.value }) })),
          },
          {
            id: `service-${service.id}-faq-a-${index}`,
            key: `${title} / إجابة ${index + 1}`,
            arabic: faq.answer_ar,
            value: faq.answer_en,
            multiline: true,
            onChange: (event) => updateService(service.id, (item) => ({ ...item, faqs: updateListItem(item.faqs, index, { answer_en: event.target.value }) })),
          }
        )
      })
    }

    if (Array.isArray(service.important_links)) {
      rows.push(
        ...service.important_links.map((link, index) => ({
          id: `service-${service.id}-important-link-${index}`,
          key: `${title} / رابط مهم ${index + 1}`,
          arabic: link.label_ar,
          value: link.label_en,
          onChange: (event) => updateService(service.id, (item) => ({ ...item, important_links: updateListItem(item.important_links, index, { label_en: event.target.value }) })),
        }))
      )
    }

    if (Array.isArray(service.media)) {
      rows.push(
        ...service.media.map((mediaItem, index) => ({
          id: `service-${service.id}-media-${index}`,
          key: `${title} / وصف وسائط ${index + 1}`,
          arabic: mediaItem.alt_text_ar,
          value: mediaItem.alt_text_en,
          onChange: (event) => updateService(service.id, (item) => ({ ...item, media: updateListItem(item.media, index, { alt_text_en: event.target.value }) })),
        }))
      )
    }

    return rows.filter((row) => row.arabic || row.value)
  })

  const coachRows = [
    {
      id: 'coach-name',
      key: 'المدرب / الاسم',
      arabic: coach.name_ar,
      value: coach.name_en,
      onChange: (event) => setCoach((current) => ({ ...current, name_en: event.target.value })),
    },
    {
      id: 'coach-title',
      key: 'المدرب / اللقب',
      arabic: coach.title_ar,
      value: coach.title_en,
      onChange: (event) => setCoach((current) => ({ ...current, title_en: event.target.value })),
    },
    {
      id: 'coach-bio',
      key: 'المدرب / النبذة',
      arabic: coach.bio_ar,
      value: coach.bio_en,
      multiline: true,
      onChange: (event) => setCoach((current) => ({ ...current, bio_en: event.target.value })),
    },
  ].filter((row) => row.arabic || row.value)

  const testimonialRows = testimonials.map((testimonial) => ({
    id: `testimonial-${testimonial.id}`,
    key: `رأي عميل / ${testimonial.name || testimonial.id}`,
    arabic: testimonial.content_ar,
    value: testimonial.content_en,
    multiline: true,
    onChange: (event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, content_en: event.target.value } : item))),
  })).filter((row) => row.arabic || row.value)

  const marketRows = marketUpdates.flatMap((update) => {
    const title = update.title_ar || `تحديث #${update.id}`
    return [
      {
        id: `market-${update.id}-title`,
        key: `${title} / العنوان`,
        arabic: update.title_ar,
        value: update.title_en,
        onChange: (event) => setMarketUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, title_en: event.target.value } : item))),
      },
      {
        id: `market-${update.id}-summary`,
        key: `${title} / الملخص`,
        arabic: update.summary_ar,
        value: update.summary_en,
        multiline: true,
        onChange: (event) => setMarketUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, summary_en: event.target.value } : item))),
      },
      {
        id: `market-${update.id}-content`,
        key: `${title} / المحتوى`,
        arabic: update.content_ar,
        value: update.content_en,
        multiline: true,
        onChange: (event) => setMarketUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, content_en: event.target.value } : item))),
      },
    ]
  }).filter((row) => row.arabic || row.value)

  const settingsRows = [
    ['تعليمات الدفع', settings.payment_instructions_ar, settings.payment_instructions_en, 'payment_instructions_en', true],
    ['وصف الفوتر', settings.footer_description_ar || settings.footer_description, settings.footer_description_en, 'footer_description_en', true],
    ['عنوان سياسة الخصوصية', settings.privacy_policy_title_ar || settings.privacy_policy_title, settings.privacy_policy_title_en, 'privacy_policy_title_en'],
    ['محتوى سياسة الخصوصية', settings.privacy_policy_content_ar || settings.privacy_policy_content, settings.privacy_policy_content_en, 'privacy_policy_content_en', true],
    ['عنوان الشروط والأحكام', settings.terms_title_ar || settings.terms_title, settings.terms_title_en, 'terms_title_en'],
    ['محتوى الشروط والأحكام', settings.terms_content_ar || settings.terms_content, settings.terms_content_en, 'terms_content_en', true],
    ['عنوان تحذير المخاطر', settings.risk_disclaimer_title_ar || settings.risk_warning_title_ar || settings.risk_warning_title, settings.risk_disclaimer_title_en || settings.risk_warning_title_en, 'risk_disclaimer_title_en'],
    ['محتوى تحذير المخاطر', settings.risk_disclaimer_content_ar || settings.risk_warning_content_ar || settings.risk_warning_content, settings.risk_disclaimer_content_en || settings.risk_warning_content_en, 'risk_disclaimer_content_en', true],
  ].map(([key, arabic, value, field, multiline]) => ({
    id: `settings-${field}`,
    key: `الإعدادات / ${key}`,
    arabic,
    value,
    multiline,
    onChange: (event) => {
      if (field === 'risk_disclaimer_title_en') {
        setSettings((current) => ({ ...current, risk_disclaimer_title_en: event.target.value, risk_warning_title_en: event.target.value }))
        return
      }
      if (field === 'risk_disclaimer_content_en') {
        setSettings((current) => ({ ...current, risk_disclaimer_content_en: event.target.value, risk_warning_content_en: event.target.value }))
        return
      }
      setSettings((current) => ({ ...current, [field]: event.target.value }))
    },
  })).filter((row) => row.arabic || row.value)

  const paymentRows = paymentMethods.flatMap((method, index) => {
    const title = method.label_ar || method.label_en || `طريقة دفع ${index + 1}`
    return [
      ['اسم الطريقة', method.label_ar, method.label_en, 'label_en'],
      ['وصف الطريقة', method.helper_ar, method.helper_en, 'helper_en'],
      ['عنوان البيان الرئيسي', method.primary_label_ar, method.primary_label_en, 'primary_label_en'],
      ['عنوان البيان الإضافي', method.secondary_label_ar, method.secondary_label_en, 'secondary_label_en'],
      ['تعليمات الطريقة', method.instructions_ar, method.instructions_en, 'instructions_en', true],
    ].map(([key, arabic, value, field, multiline]) => ({
      id: `payment-${method.id}-${field}`,
      key: `${title} / ${key}`,
      arabic,
      value,
      multiline,
      onChange: (event) => updatePaymentMethods((methods) => updateListItem(methods, index, { [field]: event.target.value })),
    }))
  }).filter((row) => row.arabic || row.value)

  const translationRowGroups = [sectionRows, linkRows, serviceRows, coachRows, testimonialRows, marketRows, settingsRows, paymentRows]
  const totalTranslationRows = translationRowGroups.reduce((total, rows) => total + rows.length, 0)
  const visibleTranslationRows = useMemo(
    () => translationRowGroups.reduce((total, rows) => total + rows.filter((row) => rowMatchesSearch(row, searchQuery)).length, 0),
    [searchQuery, sectionRows, linkRows, serviceRows, coachRows, testimonialRows, marketRows, settingsRows, paymentRows]
  )

  return (
    <div className="space-y-6">
      <TranslationNotice />
      <TranslationsSearchBox
        value={searchQuery}
        onChange={setSearchQuery}
        totalRows={totalTranslationRows}
        visibleRows={visibleTranslationRows}
      />

      <SectionCard
        title="جداول الترجمات"
        action={<ActionButton onClick={onSaveSections} className="w-full bg-green-600 text-white sm:w-auto">{saving === 'sections-save' ? 'جاري الحفظ...' : 'حفظ ترجمات السكشنات'}</ActionButton>}
      >
        <div className="space-y-5">
          <TranslationTable title="الصفحة الرئيسية والسكشنات" rows={sectionRows} searchQuery={searchQuery} />
          <TranslationTable title="النافبار والفوتر" rows={linkRows} searchQuery={searchQuery} />
        </div>
      </SectionCard>

      <SectionCard title="ترجمات الخدمات والمنتجات">
        <div className="space-y-5">
          <TranslationTable title="كل الخدمات والمنتجات" rows={serviceRows} searchQuery={searchQuery} />
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <ActionButton key={service.id} onClick={() => onSaveService(services.find((item) => item.id === service.id) || service)} className="bg-green-600 text-white">
                {saving === `service-${service.id}` ? 'جاري الحفظ...' : `حفظ ${service.title_ar || service.slug || service.id}`}
              </ActionButton>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="ترجمات المدرب وآراء العملاء والسوق"
        action={<ActionButton onClick={onSaveCoach} className="w-full bg-green-600 text-white sm:w-auto">{saving === 'coach-save' ? 'جاري الحفظ...' : 'حفظ ترجمة المدرب'}</ActionButton>}
      >
        <div className="space-y-5">
          <TranslationTable title="المدرب" rows={coachRows} searchQuery={searchQuery} />
          <TranslationTable title="آراء العملاء" rows={testimonialRows} searchQuery={searchQuery} />
          <div className="flex flex-wrap gap-2">
            {testimonials.map((testimonial) => (
              <ActionButton key={testimonial.id} onClick={() => onSaveTestimonial(testimonials.find((item) => item.id === testimonial.id) || testimonial)} className="bg-green-600 text-white">
                {saving === `testimonial-${testimonial.id}` ? 'جاري الحفظ...' : `حفظ رأي ${testimonial.name || testimonial.id}`}
              </ActionButton>
            ))}
          </div>
          <TranslationTable title="متابعة السوق" rows={marketRows} searchQuery={searchQuery} />
          <div className="flex flex-wrap gap-2">
            {marketUpdates.map((update) => (
              <ActionButton key={update.id} onClick={() => onSaveMarketUpdate(marketUpdates.find((item) => item.id === update.id) || update)} className="bg-green-600 text-white">
                {saving === `market-${update.id}` ? 'جاري الحفظ...' : `حفظ ${update.title_ar || update.id}`}
              </ActionButton>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="ترجمات الدفع والقانوني"
        action={<ActionButton onClick={onSaveSettings} className="w-full bg-green-600 text-white sm:w-auto">{saving === 'settings-save' ? 'جاري الحفظ...' : 'حفظ ترجمات الإعدادات'}</ActionButton>}
      >
        <div className="space-y-5">
          <TranslationTable title="الإعدادات والقانوني والفوتر" rows={settingsRows} searchQuery={searchQuery} />
          <TranslationTable title="طرق الدفع" rows={paymentRows} searchQuery={searchQuery} />
        </div>
      </SectionCard>
    </div>
  )
}
