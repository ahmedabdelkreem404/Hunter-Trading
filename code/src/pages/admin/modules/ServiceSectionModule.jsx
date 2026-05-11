import { ActionButton, Field, SectionCard, TextArea } from './shared/AdminUI'

export default function ServiceSectionModule({ sectionKey, title, sections, setSections, onSave, saving }) {
  const section = sections.find((item) => item.section_key === sectionKey)

  if (!section) {
    return null
  }

  const updateSection = (changes) => {
    setSections((current) => current.map((item) => (item.section_key === sectionKey ? { ...item, ...changes } : item)))
  }

  return (
    <SectionCard
      title={`إعدادات سكشن ${title}`}
      action={
        <ActionButton onClick={onSave} className="w-full bg-green-600 text-white sm:w-auto">
          {saving ? 'جاري الحفظ...' : 'حفظ إعدادات السكشن'}
        </ActionButton>
      }
    >
      <p className="mb-5 text-sm leading-7 text-slate-400">
        هذه البيانات تتحكم في عنوان السكشن ووصفه وأزراره. ترتيب السكشن وإظهاره أو إخفاؤه موجودان في صفحة ترتيب السكشنات.
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="عنوان السكشن بالإنجليزية" value={section.title_en || ''} onChange={(event) => updateSection({ title_en: event.target.value })} />
        <Field label="عنوان السكشن بالعربية" value={section.title_ar || ''} onChange={(event) => updateSection({ title_ar: event.target.value })} />
        <TextArea label="وصف السكشن بالإنجليزية" className="xl:col-span-2" value={section.subtitle_en || ''} onChange={(event) => updateSection({ subtitle_en: event.target.value })} />
        <TextArea label="وصف السكشن بالعربية" className="xl:col-span-2" value={section.subtitle_ar || ''} onChange={(event) => updateSection({ subtitle_ar: event.target.value })} />
        <TextArea label="محتوى إضافي بالإنجليزية" className="xl:col-span-2" value={section.body_en || ''} onChange={(event) => updateSection({ body_en: event.target.value })} />
        <TextArea label="محتوى إضافي بالعربية" className="xl:col-span-2" value={section.body_ar || ''} onChange={(event) => updateSection({ body_ar: event.target.value })} />
        <Field label="نص الزر بالإنجليزية" value={section.cta_label_en || ''} onChange={(event) => updateSection({ cta_label_en: event.target.value })} />
        <Field label="نص الزر بالعربية" value={section.cta_label_ar || ''} onChange={(event) => updateSection({ cta_label_ar: event.target.value })} />
        <Field label="رابط الزر" className="md:col-span-2" value={section.cta_url || ''} onChange={(event) => updateSection({ cta_url: event.target.value })} />
      </div>
    </SectionCard>
  )
}
