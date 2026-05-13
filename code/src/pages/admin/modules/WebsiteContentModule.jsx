import { Plus, Trash2 } from 'lucide-react'
import { ActionButton, AdminBlock, Field, MediaPicker, SectionCard, TextArea, Toggle, confirmDelete } from './shared/AdminUI'

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

function sortMenuItems(items = []) {
  return [...items].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
}

function normalizeStats(stats = []) {
  return Array.isArray(stats) && stats.length > 0 ? stats : [{ value: '', label_ar: '', label_en: '' }]
}

function HeroStatsManager({ stats = [], onChange }) {
  const safeStats = normalizeStats(stats)

  const updateStat = (index, changes) => {
    onChange(safeStats.map((item, currentIndex) => (currentIndex === index ? { ...item, ...changes } : item)))
  }

  const addStat = () => {
    onChange([...safeStats, { value: '', label_ar: '', label_en: '' }])
  }

  const removeStat = async (index) => {
    if (!(await confirmDelete('هل تريد حذف هذه الإحصائية؟'))) return
    onChange(safeStats.filter((_, currentIndex) => currentIndex !== index))
  }

  return (
    <div className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950/45 p-3 transition hover:border-cyan-300/20 hover:bg-slate-950/65 sm:p-4">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-black text-white">إحصائيات الهيرو</h3>
          <p className="mt-1 text-xs leading-6 text-slate-400">اكتب الرقم في خانة مستقلة، والنص العربي في خانة مستقلة. الترجمة الإنجليزية تظهر في تبويب الترجمات.</p>
        </div>
        <ActionButton type="button" onClick={addStat} className="w-full border border-cyan-300/25 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15 sm:w-auto">
          <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> إضافة إحصائية</span>
        </ActionButton>
      </div>

      <div className="space-y-3">
        {safeStats.map((stat, index) => (
          <div key={index} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900/55 p-3 transition hover:border-hunter-green/25 hover:bg-slate-900/75 md:grid-cols-[minmax(8rem,0.6fr)_minmax(0,1.4fr)_auto]">
            <Field label={`الرقم ${index + 1}`} value={stat.value || ''} onChange={(event) => updateStat(index, { value: event.target.value })} />
            <Field label={`النص العربي ${index + 1}`} value={stat.label_ar || ''} onChange={(event) => updateStat(index, { label_ar: event.target.value })} />
            <div className="flex items-end">
              <ActionButton type="button" onClick={() => removeStat(index)} className="min-h-[46px] w-full bg-red-500/10 px-3 py-2 text-red-300 hover:bg-red-500/15 md:w-auto">
                <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> حذف</span>
              </ActionButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MenuManager({ title, items, onChange }) {
  const safeItems = sortMenuItems(items)

  const updateItem = (index, changes) => {
    onChange(safeItems.map((item, currentIndex) => (currentIndex === index ? { ...item, ...changes } : item)))
  }

  const removeItem = async (index) => {
    if (!(await confirmDelete('هل تريد حذف هذا الرابط؟'))) return
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
          className="w-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 sm:w-auto"
        >
          <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> إضافة رابط</span>
        </ActionButton>
      }
    >
      <div className="space-y-3">
        {safeItems.map((item, index) => (
          <div key={`${item.href}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/45 p-3 transition hover:border-hunter-green/25 hover:bg-slate-950/65 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-bold text-slate-400">
                رابط #{index + 1}
              </span>
              <ActionButton onClick={() => removeItem(index)} className="min-h-9 bg-red-500/10 px-3 py-2 text-red-300 hover:bg-red-500/15">
                <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> حذف</span>
              </ActionButton>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_7rem]">
              <Field label="الاسم بالإنجليزية" value={item.label_en || ''} onChange={(event) => updateItem(index, { label_en: event.target.value })} />
              <Field label="الاسم بالعربية" value={item.label_ar || ''} onChange={(event) => updateItem(index, { label_ar: event.target.value })} />
              <Field label="الرابط" value={item.href || ''} onChange={(event) => updateItem(index, { href: event.target.value })} />
              <Field label="الترتيب" type="number" value={item.sort_order || 0} onChange={(event) => updateItem(index, { sort_order: Number(event.target.value) })} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Toggle label="ظاهر" checked={!!item.is_visible} onChange={(value) => updateItem(index, { is_visible: value })} />
              <Toggle label="يفتح في تب جديد" checked={!!item.new_tab} onChange={(value) => updateItem(index, { new_tab: value })} />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default function WebsiteContentModule({ sections, setSections, onSave, saving, media = [], contentSectionKeys = null, onUploadMedia }) {
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
  const uploadHeroMedia = (settingKey) => async (file) => {
    if (!file || typeof onUploadMedia !== 'function') return
    const uploaded = await onUploadMedia(file)
    const url = uploaded?.url || uploaded?.filepath || ''
    if (url) {
      updateSectionSettings('hero', { [settingKey]: url })
    }
  }
  const contentSections = sections.filter((section) => {
    if (Array.isArray(contentSectionKeys)) {
      return contentSectionKeys.includes(section.section_key)
    }

    return !['hero', 'coach', 'navigation', 'footer'].includes(section.section_key)
  })

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
          <div className="space-y-4">
            <AdminBlock title="نصوص الهيرو" description="النص الرئيسي والأزرار والإحصائيات التي تظهر فوق خلفية الفيديو.">
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
                <HeroStatsManager stats={hero.stats} onChange={(stats) => updateSection('hero', { stats })} />
              </div>
            </AdminBlock>

            <AdminBlock title="فيديو خلفية الهيرو" description="هذه الخلفية تغطي سكشن الهيرو بالكامل في الموقع.">
              <div className="grid gap-4 md:grid-cols-2">
              <Field label="رابط فيديو الهيرو" value={hero.settings?.hero_video_url || ''} onChange={(event) => updateSectionSettings('hero', { hero_video_url: event.target.value })} />
              <Field label="رابط فيديو الموبايل" value={hero.settings?.hero_mobile_video_url || ''} onChange={(event) => updateSectionSettings('hero', { hero_mobile_video_url: event.target.value })} />
              <MediaPicker
                label="اختيار فيديو الهيرو من المكتبة"
                media={media}
                selectedUrl={hero.settings?.hero_video_url || ''}
                onSelect={(item) => updateSectionSettings('hero', { hero_video_url: item.filepath })}
                onUpload={uploadHeroMedia('hero_video_url')}
                uploadLabel="رفع فيديو أو صورة من الجهاز"
              />
              <MediaPicker
                label="اختيار فيديو الموبايل من المكتبة"
                media={media}
                selectedUrl={hero.settings?.hero_mobile_video_url || ''}
                onSelect={(item) => updateSectionSettings('hero', { hero_mobile_video_url: item.filepath })}
                onUpload={uploadHeroMedia('hero_mobile_video_url')}
                uploadLabel="رفع فيديو أو صورة للموبايل"
              />
              <Field label="رابط صورة الفيديو" value={hero.settings?.hero_video_poster_url || ''} onChange={(event) => updateSectionSettings('hero', { hero_video_poster_url: event.target.value })} />
              <Field label="رابط الصورة البديلة" value={hero.settings?.hero_fallback_image_url || ''} onChange={(event) => updateSectionSettings('hero', { hero_fallback_image_url: event.target.value })} />
              <MediaPicker
                label="اختيار صورة الفيديو من المكتبة"
                media={media}
                selectedUrl={hero.settings?.hero_video_poster_url || ''}
                onSelect={(item) => updateSectionSettings('hero', { hero_video_poster_url: item.filepath })}
                onUpload={uploadHeroMedia('hero_video_poster_url')}
                uploadLabel="رفع صورة الفيديو من الجهاز"
                accept="image/*"
              />
              <MediaPicker
                label="اختيار الصورة البديلة من المكتبة"
                media={media}
                selectedUrl={hero.settings?.hero_fallback_image_url || ''}
                onSelect={(item) => updateSectionSettings('hero', { hero_fallback_image_url: item.filepath })}
                onUpload={uploadHeroMedia('hero_fallback_image_url')}
                uploadLabel="رفع الصورة البديلة من الجهاز"
                accept="image/*"
              />
              <Toggle label="تشغيل تلقائي" checked={hero.settings?.hero_video_autoplay !== false} onChange={(value) => updateSectionSettings('hero', { hero_video_autoplay: value })} />
              <Toggle label="كتم الصوت" checked={hero.settings?.hero_video_muted !== false} onChange={(value) => updateSectionSettings('hero', { hero_video_muted: value })} />
              <Toggle label="تكرار الفيديو" checked={hero.settings?.hero_video_loop !== false} onChange={(value) => updateSectionSettings('hero', { hero_video_loop: value })} />
              <Toggle label="إظهار أزرار التحكم" checked={!!hero.settings?.hero_video_controls} onChange={(value) => updateSectionSettings('hero', { hero_video_controls: value })} />
              <Field
                label="درجة شادو خلفية الهيرو (0 - 100)"
                type="number"
                min="0"
                max="100"
                value={hero.settings?.hero_overlay_strength ?? 58}
                onChange={(event) => updateSectionSettings('hero', { hero_overlay_strength: Number(event.target.value) })}
              />
              <Field
                label="درجة شادو الهيرو على الموبايل (0 - 100)"
                type="number"
                min="0"
                max="100"
                value={hero.settings?.hero_mobile_overlay_strength ?? hero.settings?.hero_overlay_strength ?? 52}
                onChange={(event) => updateSectionSettings('hero', { hero_mobile_overlay_strength: Number(event.target.value) })}
              />
              </div>
            </AdminBlock>
          </div>
        </SectionCard>
      ) : null}

      {contentSections.length > 0 ? (
        <SectionCard title="سكشنات الصفحة الرئيسية">
          <div className="space-y-4">
            {contentSections.map((section) => (
              <div key={section.section_key} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-cyan-300/20 hover:bg-slate-950/60">
                <div className="mb-4">
                  <div className="text-base font-black text-hunter-green">{sectionNames[section.section_key] || section.section_key}</div>
                  <p className="mt-1 text-xs leading-6 text-slate-400">نصوص السكشن وأزراره الظاهرة في الصفحة الرئيسية.</p>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Field label="عنوان السكشن بالإنجليزية" value={section.title_en || ''} onChange={(event) => updateSection(section.section_key, { title_en: event.target.value })} />
                  <Field label="عنوان السكشن بالعربية" value={section.title_ar || ''} onChange={(event) => updateSection(section.section_key, { title_ar: event.target.value })} />
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
      ) : null}

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
