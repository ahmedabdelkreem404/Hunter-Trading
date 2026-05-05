import { Plus, Trash2 } from 'lucide-react'
import { ActionButton, Field, MediaPicker, SectionCard, TextArea, Toggle } from './shared/AdminUI'

const sectionNames = {
  hero: 'الهيرو',
  funded: 'الحسابات الممولة',
  vip: 'VIP',
  scalp: 'Scalp',
  offers: 'العروض',
  courses: 'الكورسات',
  testimonials: 'آراء العملاء',
  market: 'متابعة السوق',
  coach: 'المدرب',
  navigation: 'النافبار',
  footer: 'الفوتر',
}

function statsToText(stats = []) {
  return (stats || []).map((item) => `${item.value || ''}|${item.label_en || ''}|${item.label_ar || ''}`).join('\n')
}

function textToStats(text = '') {
  return String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [value = '', labelEn = '', labelAr = ''] = line.split('|')
      return { value: value.trim(), label_en: labelEn.trim(), label_ar: labelAr.trim() }
    })
}

function sortMenuItems(items = []) {
  return [...items].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
}

function MenuManager({ title, items, onChange }) {
  const safeItems = sortMenuItems(items)

  const updateItem = (index, changes) => {
    onChange(safeItems.map((item, currentIndex) => (currentIndex === index ? { ...item, ...changes } : item)))
  }

  const removeItem = (index) => {
    onChange(safeItems.filter((_, currentIndex) => currentIndex !== index))
  }

  return (
    <SectionCard
      title={title}
      action={
        <ActionButton
          onClick={() =>
            onChange([
              ...safeItems,
              { label_en: '', label_ar: '', href: '', is_visible: true, new_tab: false, sort_order: safeItems.length + 1 },
            ])
          }
          className="w-full bg-white/5 text-slate-200 sm:w-auto"
        >
          <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> إضافة رابط</span>
        </ActionButton>
      }
    >
      <div className="space-y-4">
        {safeItems.map((item, index) => (
          <div key={`${item.href}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Field label="الاسم بالإنجليزية" value={item.label_en || ''} onChange={(event) => updateItem(index, { label_en: event.target.value })} />
              <Field label="الاسم بالعربية" value={item.label_ar || ''} onChange={(event) => updateItem(index, { label_ar: event.target.value })} />
              <Field label="الرابط" value={item.href || ''} onChange={(event) => updateItem(index, { href: event.target.value })} />
              <Field label="الترتيب" type="number" value={item.sort_order || 0} onChange={(event) => updateItem(index, { sort_order: Number(event.target.value) })} />
              <Toggle label="ظاهر" checked={!!item.is_visible} onChange={(value) => updateItem(index, { is_visible: value })} />
              <Toggle label="يفتح في تب جديد" checked={!!item.new_tab} onChange={(value) => updateItem(index, { new_tab: value })} />
            </div>
            <div className="mt-4">
              <ActionButton onClick={() => removeItem(index)} className="bg-red-500/10 text-red-300">
                <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> حذف</span>
              </ActionButton>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default function WebsiteContentModule({ sections, setSections, onSave, saving, media = [] }) {
  const updateSection = (sectionKey, changes) => {
    setSections((current) => current.map((section) => (section.section_key === sectionKey ? { ...section, ...changes } : section)))
  }

  const updateSectionSettings = (sectionKey, changes) => {
    const section = sections.find((item) => item.section_key === sectionKey)
    updateSection(sectionKey, { settings: { ...(section?.settings || {}), ...changes } })
  }

  const hero = sections.find((section) => section.section_key === 'hero')
  const navigation = sections.find((section) => section.section_key === 'navigation')
  const footer = sections.find((section) => section.section_key === 'footer')
  const contentSections = sections.filter((section) => !['hero', 'coach', 'navigation', 'footer'].includes(section.section_key))

  return (
    <>
      {hero ? (
        <SectionCard
          title="الهيرو: النصوص والفيديو والإحصائيات"
          action={
            <ActionButton onClick={onSave} className="w-full bg-green-600 text-white sm:w-auto">
              {saving ? 'جاري الحفظ...' : 'حفظ محتوى الموقع'}
            </ActionButton>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="العنوان بالإنجليزية" value={hero.title_en || ''} onChange={(event) => updateSection('hero', { title_en: event.target.value })} />
            <Field label="العنوان بالعربية" value={hero.title_ar || ''} onChange={(event) => updateSection('hero', { title_ar: event.target.value })} />
            <Field label="العنوان الفرعي بالإنجليزية" value={hero.subtitle_en || ''} onChange={(event) => updateSection('hero', { subtitle_en: event.target.value })} />
            <Field label="العنوان الفرعي بالعربية" value={hero.subtitle_ar || ''} onChange={(event) => updateSection('hero', { subtitle_ar: event.target.value })} />
            <TextArea label="النص بالإنجليزية" className="md:col-span-2" value={hero.body_en || ''} onChange={(event) => updateSection('hero', { body_en: event.target.value })} />
            <TextArea label="النص بالعربية" className="md:col-span-2" value={hero.body_ar || ''} onChange={(event) => updateSection('hero', { body_ar: event.target.value })} />
            <Field label="زر رئيسي بالإنجليزية" value={hero.cta_label_en || ''} onChange={(event) => updateSection('hero', { cta_label_en: event.target.value })} />
            <Field label="زر رئيسي بالعربية" value={hero.cta_label_ar || ''} onChange={(event) => updateSection('hero', { cta_label_ar: event.target.value })} />
            <Field label="رابط الزر الرئيسي" value={hero.cta_url || ''} onChange={(event) => updateSection('hero', { cta_url: event.target.value })} />
            <Field label="زر ثانوي بالإنجليزية" value={hero.secondary_cta_label_en || ''} onChange={(event) => updateSection('hero', { secondary_cta_label_en: event.target.value })} />
            <Field label="زر ثانوي بالعربية" value={hero.secondary_cta_label_ar || ''} onChange={(event) => updateSection('hero', { secondary_cta_label_ar: event.target.value })} />
            <Field label="رابط الزر الثانوي" value={hero.secondary_cta_url || ''} onChange={(event) => updateSection('hero', { secondary_cta_url: event.target.value })} />
            <TextArea label="الإحصائيات: القيمة|الاسم بالإنجليزية|الاسم بالعربية" className="md:col-span-2" value={statsToText(hero.stats)} onChange={(event) => updateSection('hero', { stats: textToStats(event.target.value) })} />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <h3 className="mb-4 text-sm font-semibold text-white">فيديو خلفية الهيرو</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="رابط فيديو الهيرو" value={hero.settings?.hero_video_url || ''} onChange={(event) => updateSectionSettings('hero', { hero_video_url: event.target.value })} />
              <Field label="رابط فيديو الموبايل" value={hero.settings?.hero_mobile_video_url || ''} onChange={(event) => updateSectionSettings('hero', { hero_mobile_video_url: event.target.value })} />
              <MediaPicker
                label="اختيار فيديو الهيرو من المكتبة"
                media={media}
                selectedUrl={hero.settings?.hero_video_url || ''}
                onSelect={(item) => updateSectionSettings('hero', { hero_video_url: item.filepath })}
              />
              <MediaPicker
                label="اختيار فيديو الموبايل من المكتبة"
                media={media}
                selectedUrl={hero.settings?.hero_mobile_video_url || ''}
                onSelect={(item) => updateSectionSettings('hero', { hero_mobile_video_url: item.filepath })}
              />
              <Field label="رابط صورة الفيديو" value={hero.settings?.hero_video_poster_url || ''} onChange={(event) => updateSectionSettings('hero', { hero_video_poster_url: event.target.value })} />
              <Field label="رابط الصورة البديلة" value={hero.settings?.hero_fallback_image_url || ''} onChange={(event) => updateSectionSettings('hero', { hero_fallback_image_url: event.target.value })} />
              <MediaPicker
                label="اختيار صورة الفيديو من المكتبة"
                media={media}
                selectedUrl={hero.settings?.hero_video_poster_url || ''}
                onSelect={(item) => updateSectionSettings('hero', { hero_video_poster_url: item.filepath })}
              />
              <MediaPicker
                label="اختيار الصورة البديلة من المكتبة"
                media={media}
                selectedUrl={hero.settings?.hero_fallback_image_url || ''}
                onSelect={(item) => updateSectionSettings('hero', { hero_fallback_image_url: item.filepath })}
              />
              <Toggle label="تشغيل تلقائي" checked={hero.settings?.hero_video_autoplay !== false} onChange={(value) => updateSectionSettings('hero', { hero_video_autoplay: value })} />
              <Toggle label="كتم الصوت" checked={hero.settings?.hero_video_muted !== false} onChange={(value) => updateSectionSettings('hero', { hero_video_muted: value })} />
              <Toggle label="تكرار الفيديو" checked={hero.settings?.hero_video_loop !== false} onChange={(value) => updateSectionSettings('hero', { hero_video_loop: value })} />
              <Toggle label="إظهار أزرار التحكم" checked={!!hero.settings?.hero_video_controls} onChange={(value) => updateSectionSettings('hero', { hero_video_controls: value })} />
            </div>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="سكشنات الصفحة الرئيسية">
        <div className="space-y-4">
          {contentSections.map((section) => (
            <div key={section.section_key} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="mb-4 text-base font-semibold text-hunter-green">{sectionNames[section.section_key] || section.section_key}</div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="عنوان السكشن بالإنجليزية" value={section.title_en || ''} onChange={(event) => updateSection(section.section_key, { title_en: event.target.value })} />
                <Field label="عنوان السكشن بالعربية" value={section.title_ar || ''} onChange={(event) => updateSection(section.section_key, { title_ar: event.target.value })} />
                <Field label="الترتيب" type="number" value={section.sort_order || 0} onChange={(event) => updateSection(section.section_key, { sort_order: Number(event.target.value) })} />
                <Toggle label="ظاهر" checked={!!section.is_visible} onChange={(value) => updateSection(section.section_key, { is_visible: value ? 1 : 0 })} />
                <TextArea label="الوصف بالإنجليزية" className="xl:col-span-2" value={section.subtitle_en || ''} onChange={(event) => updateSection(section.section_key, { subtitle_en: event.target.value })} />
                <TextArea label="الوصف بالعربية" className="xl:col-span-2" value={section.subtitle_ar || ''} onChange={(event) => updateSection(section.section_key, { subtitle_ar: event.target.value })} />
                <Field label="نص الزر بالإنجليزية" value={section.cta_label_en || ''} onChange={(event) => updateSection(section.section_key, { cta_label_en: event.target.value })} />
                <Field label="نص الزر بالعربية" value={section.cta_label_ar || ''} onChange={(event) => updateSection(section.section_key, { cta_label_ar: event.target.value })} />
                <Field label="رابط الزر" className="md:col-span-2" value={section.cta_url || ''} onChange={(event) => updateSection(section.section_key, { cta_url: event.target.value })} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {navigation ? (
        <MenuManager
          title="روابط النافبار"
          items={navigation.settings?.menu_items || []}
          onChange={(items) => updateSection('navigation', { settings: { ...(navigation.settings || {}), menu_items: items } })}
        />
      ) : null}

      {footer ? (
        <>
          <MenuManager
            title="روابط الفوتر السريعة"
            items={footer.settings?.quick_links || []}
            onChange={(items) => updateSection('footer', { settings: { ...(footer.settings || {}), quick_links: items } })}
          />
          <MenuManager
            title="روابط الفوتر القانونية"
            items={footer.settings?.legal_links || []}
            onChange={(items) => updateSection('footer', { settings: { ...(footer.settings || {}), legal_links: items } })}
          />
        </>
      ) : null}
    </>
  )
}
