import { ActionButton, Field, SectionCard, Toggle } from './shared/AdminUI'

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

export default function SectionOrderModule({ sections, setSections, onSave, saving }) {
  const pageSections = sortSections(sections.filter((section) => orderedSectionKeys.includes(section.section_key)))

  const updateSection = (sectionKey, changes) => {
    setSections((current) => current.map((section) => (section.section_key === sectionKey ? { ...section, ...changes } : section)))
  }

  return (
    <SectionCard
      title="ترتيب وظهور سكشنات الموقع"
      action={
        <ActionButton onClick={onSave} className="w-full bg-green-600 text-white sm:w-auto">
          {saving ? 'جاري الحفظ...' : 'حفظ ترتيب وظهور السكشنات'}
        </ActionButton>
      }
    >
      <p className="mb-5 text-sm leading-7 text-slate-400">
        من هنا تتحكم في ترتيب كل سكشن داخل الصفحة الرئيسية وتحدد إذا كان ظاهر أو مخفي. تفاصيل كل سكشن ومحتواه موجودة في التبويب الخاص به.
      </p>

      <div className="space-y-3">
        {pageSections.map((section) => (
          <div key={section.section_key} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 md:grid-cols-[1.2fr_0.55fr_0.75fr] md:items-end">
            <div>
              <div className="text-base font-semibold text-white">{sectionLabels[section.section_key] || section.section_key}</div>
              <div className="mt-1 text-xs text-slate-500">
                {section.title_ar || section.title_en || section.section_key}
              </div>
            </div>
            <Field
              label="ترتيب الظهور"
              type="number"
              value={section.sort_order || 0}
              onChange={(event) => updateSection(section.section_key, { sort_order: Number(event.target.value) })}
            />
            <Toggle
              label={section.is_visible ? 'ظاهر في الموقع' : 'مخفي من الموقع'}
              checked={!!section.is_visible}
              onChange={(value) => updateSection(section.section_key, { is_visible: value ? 1 : 0 })}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
