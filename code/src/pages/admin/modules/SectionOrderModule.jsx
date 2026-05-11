import { ArrowDown, ArrowUp } from 'lucide-react'
import { ActionButton, SectionCard, Toggle } from './shared/AdminUI'

const sectionLabels = {
  hero: 'الرئيسية / الهيرو',
  funded: 'الحسابات الممولة',
  vip: 'VIP',
  scalp: 'السكالب',
  courses: 'الدورات',
  offers: 'العروض',
  testimonials: 'آراء العملاء',
  market: 'متابعة السوق',
  coach: 'المدرب',
}

const orderedSectionKeys = ['hero', 'funded', 'vip', 'scalp', 'courses', 'offers', 'coach', 'testimonials', 'market']

function sortSections(sections = []) {
  return [...sections].sort((a, b) => {
    const aIndex = orderedSectionKeys.indexOf(a.section_key)
    const bIndex = orderedSectionKeys.indexOf(b.section_key)
    const safeAIndex = aIndex === -1 ? 999 : aIndex
    const safeBIndex = bIndex === -1 ? 999 : bIndex
    return Number(a.sort_order || safeAIndex) - Number(b.sort_order || safeBIndex)
  })
}

function normalizePageOrder(pageSections) {
  return pageSections.map((section, index) => ({ ...section, sort_order: index + 1 }))
}

function mergeSections(allSections, orderedPageSections) {
  const updatesByKey = Object.fromEntries(orderedPageSections.map((section) => [section.section_key, section]))
  return allSections.map((section) => updatesByKey[section.section_key] || section)
}

export default function SectionOrderModule({ sections, setSections, onSave, onAutoSave, saving }) {
  const pageSections = sortSections(sections.filter((section) => orderedSectionKeys.includes(section.section_key)))

  const commitSections = (nextSections) => {
    setSections(nextSections)
    onAutoSave?.(nextSections)
  }

  const moveSection = (sectionKey, direction) => {
    const currentPageSections = sortSections(sections.filter((section) => orderedSectionKeys.includes(section.section_key)))
    const currentIndex = currentPageSections.findIndex((section) => section.section_key === sectionKey)
    const targetIndex = currentIndex + direction

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= currentPageSections.length) {
      return
    }

    const nextPageSections = [...currentPageSections]
    const currentSection = nextPageSections[currentIndex]
    nextPageSections[currentIndex] = nextPageSections[targetIndex]
    nextPageSections[targetIndex] = currentSection
    commitSections(mergeSections(sections, normalizePageOrder(nextPageSections)))
  }

  const toggleSection = (sectionKey, value) => {
    const nextSections = sections.map((section) =>
      section.section_key === sectionKey ? { ...section, is_visible: value ? 1 : 0 } : section
    )
    commitSections(nextSections)
  }

  return (
    <SectionCard
      title="ترتيب وظهور سكشنات الموقع"
      action={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="rounded-xl border border-hunter-green/20 bg-hunter-green/10 px-4 py-3 text-center text-sm font-semibold text-hunter-green">
            {saving ? 'جاري الحفظ التلقائي...' : 'الحفظ تلقائي'}
          </div>
          <ActionButton onClick={onSave} className="w-full bg-white/5 text-slate-200 sm:w-auto">
            حفظ الآن
          </ActionButton>
        </div>
      }
    >
      <p className="mb-5 text-sm leading-7 text-slate-400">
        استخدم الأسهم لتحريك السكشن فوق أو تحت. أي تغيير هنا يتم حفظه تلقائيا ويظهر في الموقع بدون تحديث الصفحة.
      </p>

      <div className="space-y-3">
        {pageSections.map((section, index) => (
          <div key={section.section_key} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 md:grid-cols-[auto_1fr_0.8fr] md:items-center">
            <div className="flex items-center gap-2 md:flex-col">
              <button
                type="button"
                onClick={() => moveSection(section.section_key, -1)}
                disabled={index === 0 || saving}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-800 text-slate-200 transition hover:border-hunter-green/40 hover:text-hunter-green disabled:cursor-not-allowed disabled:opacity-35"
                aria-label={`رفع ${sectionLabels[section.section_key] || section.section_key}`}
                title="رفع السكشن"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => moveSection(section.section_key, 1)}
                disabled={index === pageSections.length - 1 || saving}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-800 text-slate-200 transition hover:border-hunter-green/40 hover:text-hunter-green disabled:cursor-not-allowed disabled:opacity-35"
                aria-label={`تنزيل ${sectionLabels[section.section_key] || section.section_key}`}
                title="تنزيل السكشن"
              >
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>

            <div>
              <div className="text-base font-semibold text-white">{sectionLabels[section.section_key] || section.section_key}</div>
              <div className="mt-1 text-xs text-slate-500">
                ترتيبه الحالي: {index + 1} • {section.title_ar || section.title_en || section.section_key}
              </div>
            </div>

            <Toggle
              label={section.is_visible ? 'ظاهر في الموقع' : 'مخفي من الموقع'}
              checked={!!section.is_visible}
              onChange={(value) => toggleSection(section.section_key, value)}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
