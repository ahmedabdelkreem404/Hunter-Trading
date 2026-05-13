import { ActionButton, Field, SectionCard, TextArea } from './shared/AdminUI'

function FormBlock({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 transition hover:border-hunter-green/20 hover:bg-slate-950/65 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {description ? <p className="mt-1 text-xs leading-6 text-slate-400">{description}</p> : null}
      </div>
      {children}
    </div>
  )
}

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
      <div className="space-y-4">
        <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-3 text-sm leading-7 text-slate-300">
          عدّل محتوى السكشن بالعربي من هنا. ترتيب السكشن وإظهاره أو إخفاؤه موجود في صفحة ترتيب السكشنات، والترجمة الإنجليزية في تب الترجمات.
        </div>

        <FormBlock title="النص الرئيسي" description="العنوان والوصف الذي يظهران أعلى السكشن في الموقع.">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
            <Field label="عنوان السكشن بالعربية" value={section.title_ar || ''} onChange={(event) => updateSection({ title_ar: event.target.value })} />
            <TextArea label="وصف السكشن بالعربية" value={section.subtitle_ar || ''} onChange={(event) => updateSection({ subtitle_ar: event.target.value })} />
          </div>
        </FormBlock>

        <FormBlock title="محتوى إضافي" description="استخدمه فقط لو السكشن محتاج نص توضيحي إضافي. اتركه فارغًا لو غير مستخدم.">
          <TextArea label="محتوى إضافي بالعربية" value={section.body_ar || ''} onChange={(event) => updateSection({ body_ar: event.target.value })} />
        </FormBlock>

        <FormBlock title="زر السكشن" description="نص الزر والرابط الذي ينتقل له العميل عند الضغط عليه.">
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <Field label="نص الزر بالعربية" value={section.cta_label_ar || ''} onChange={(event) => updateSection({ cta_label_ar: event.target.value })} />
            <Field label="رابط الزر" value={section.cta_url || ''} onChange={(event) => updateSection({ cta_url: event.target.value })} />
          </div>
        </FormBlock>

        <div className="hidden">
          <Field label="عنوان السكشن بالإنجليزية" value={section.title_en || ''} onChange={(event) => updateSection({ title_en: event.target.value })} />
          <TextArea label="وصف السكشن بالإنجليزية" value={section.subtitle_en || ''} onChange={(event) => updateSection({ subtitle_en: event.target.value })} />
          <TextArea label="محتوى إضافي بالإنجليزية" value={section.body_en || ''} onChange={(event) => updateSection({ body_en: event.target.value })} />
          <Field label="نص الزر بالإنجليزية" value={section.cta_label_en || ''} onChange={(event) => updateSection({ cta_label_en: event.target.value })} />
        </div>
      </div>
    </SectionCard>
  )
}
