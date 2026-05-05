import { useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ActionButton, Field, FilePicker, MediaPicker, SectionCard, Select, TextArea, Toggle } from './shared/AdminUI'

function cloneList(list = [], factory) {
  return Array.isArray(list) && list.length > 0 ? list : [factory()]
}

function newFeature() {
  return { label_en: '', label_ar: '' }
}

function newStep() {
  return { title_en: '', title_ar: '', description_en: '', description_ar: '' }
}

function newFaq() {
  return { question_en: '', question_ar: '', answer_en: '', answer_ar: '' }
}

function newMedia() {
  return { media_url: '', media_type: 'image', alt_text_en: '', alt_text_ar: '' }
}

function newImportantLink() {
  return { label_en: '', label_ar: '', url: '', new_tab: true, sort_order: 1 }
}

function mediaTypeFromItem(item = {}) {
  const mimetype = String(item.mimetype || '')
  if (mimetype.startsWith('video/')) return 'video'
  if (/\.(mp4|webm|mov)(\?|#|$)/i.test(item.filepath || '')) return 'video'
  return 'image'
}

function asBool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback
  return value === true || value === 1 || value === '1'
}

function RelationEditor({ title, items, onChange, factory, renderRow }) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <ActionButton
          type="button"
          onClick={() => onChange([...(items || []), factory()])}
          className="bg-white/5 text-slate-200"
        >
          <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> إضافة</span>
        </ActionButton>
      </div>

      {cloneList(items, factory).map((item, index) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          {renderRow(item, index)}
          <div className="mt-3">
            <ActionButton
              type="button"
              onClick={() => onChange((items || []).filter((_, currentIndex) => currentIndex !== index))}
              className="bg-red-500/10 text-red-300"
            >
              <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> حذف</span>
            </ActionButton>
          </div>
        </div>
      ))}
    </div>
  )
}

function updateListItem(list, index, changes) {
  const next = Array.isArray(list) ? [...list] : []
  while (next.length <= index) {
    next.push({})
  }
  next[index] = { ...next[index], ...changes }
  return next
}

function ServiceAdvancedControls({ service, onChange, media = [] }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <h3 className="mb-4 text-sm font-semibold text-white">وسائط الكارت وصفحة التفاصيل</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Select label="نوع وسائط الكارت" value={service.card_media_type || 'image'} onChange={(event) => onChange({ card_media_type: event.target.value })}>
            <option value="image">صورة</option>
            <option value="video">فيديو</option>
            <option value="embed">رابط مدمج</option>
          </Select>
          <Field label="رابط وسائط الكارت" value={service.card_media_url || ''} onChange={(event) => onChange({ card_media_url: event.target.value })} />
          <Field label="صورة غلاف فيديو الكارت" value={service.card_video_poster_url || ''} onChange={(event) => onChange({ card_video_poster_url: event.target.value })} />
          <MediaPicker
            label="اختيار وسائط الكارت"
            media={media}
            selectedUrl={service.card_media_url || ''}
            onSelect={(item) => onChange({ card_media_url: item.filepath, card_media_type: mediaTypeFromItem(item) })}
          />
          <MediaPicker
            label="اختيار صورة غلاف الكارت"
            media={media}
            selectedUrl={service.card_video_poster_url || ''}
            onSelect={(item) => onChange({ card_video_poster_url: item.filepath })}
          />
          <Select label="نوع وسائط صفحة التفاصيل" value={service.cover_media_type || 'image'} onChange={(event) => onChange({ cover_media_type: event.target.value })}>
            <option value="image">صورة</option>
            <option value="video">فيديو</option>
            <option value="embed">رابط مدمج</option>
          </Select>
          <Field label="رابط وسائط التفاصيل" value={service.cover_url || ''} onChange={(event) => onChange({ cover_url: event.target.value })} />
          <Field label="صورة غلاف فيديو التفاصيل" value={service.cover_video_poster_url || ''} onChange={(event) => onChange({ cover_video_poster_url: event.target.value })} />
          <MediaPicker
            label="اختيار وسائط التفاصيل"
            media={media}
            selectedUrl={service.cover_url || ''}
            onSelect={(item) => onChange({ cover_url: item.filepath, cover_media_type: mediaTypeFromItem(item) })}
          />
          <Toggle label="تشغيل فيديو الكارت تلقائيا" checked={asBool(service.card_video_autoplay, false)} onChange={(value) => onChange({ card_video_autoplay: value })} />
          <Toggle label="كتم صوت فيديو الكارت" checked={asBool(service.card_video_muted, true)} onChange={(value) => onChange({ card_video_muted: value })} />
          <Toggle label="تكرار فيديو الكارت" checked={asBool(service.card_video_loop, true)} onChange={(value) => onChange({ card_video_loop: value })} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <h3 className="mb-4 text-sm font-semibold text-white">سلوك الزر والشروط والريفيرال</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Select label="تصرف الزر" value={service.cta_action || 'checkout'} onChange={(event) => onChange({ cta_action: event.target.value })}>
            <option value="checkout">الدفع داخل الموقع</option>
            <option value="details">صفحة التفاصيل أولا</option>
            <option value="external">رابط خارجي</option>
            <option value="referral">رابط ريفيرال</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
          </Select>
          <Field label="رابط الريفيرال" value={service.referral_url || ''} onChange={(event) => onChange({ referral_url: event.target.value })} />
          <Field label="اسم المنصة أو البروكر" value={service.broker_name || ''} onChange={(event) => onChange({ broker_name: event.target.value })} />
          <Field label="رابط المنصة أو البروكر" value={service.broker_url || ''} onChange={(event) => onChange({ broker_url: event.target.value })} />
          <Field label="نص زر التفاصيل بالإنجليزية" value={service.details_button_label_en || ''} onChange={(event) => onChange({ details_button_label_en: event.target.value })} />
          <Field label="نص زر التفاصيل بالعربية" value={service.details_button_label_ar || ''} onChange={(event) => onChange({ details_button_label_ar: event.target.value })} />
          <Field label="نص الزر النهائي بالإنجليزية" value={service.final_cta_label_en || ''} onChange={(event) => onChange({ final_cta_label_en: event.target.value })} />
          <Field label="نص الزر النهائي بالعربية" value={service.final_cta_label_ar || ''} onChange={(event) => onChange({ final_cta_label_ar: event.target.value })} />
          <Field label="عنوان الشروط بالإنجليزية" value={service.terms_title_en || ''} onChange={(event) => onChange({ terms_title_en: event.target.value })} />
          <Field label="عنوان الشروط بالعربية" value={service.terms_title_ar || ''} onChange={(event) => onChange({ terms_title_ar: event.target.value })} />
          <TextArea label="محتوى الشروط بالإنجليزية" className="xl:col-span-3" value={service.terms_content_en || ''} onChange={(event) => onChange({ terms_content_en: event.target.value })} />
          <TextArea label="محتوى الشروط بالعربية" className="xl:col-span-3" value={service.terms_content_ar || ''} onChange={(event) => onChange({ terms_content_ar: event.target.value })} />
          <TextArea label="تحذير المخاطر بالإنجليزية" className="xl:col-span-3" value={service.risk_warning_en || ''} onChange={(event) => onChange({ risk_warning_en: event.target.value })} />
          <TextArea label="تحذير المخاطر بالعربية" className="xl:col-span-3" value={service.risk_warning_ar || ''} onChange={(event) => onChange({ risk_warning_ar: event.target.value })} />
        </div>
      </div>

      <RelationEditor
        title="الروابط المهمة"
        items={service.important_links}
        onChange={(items) => onChange({ important_links: items })}
        factory={newImportantLink}
        renderRow={(item, index) => (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Field label="الاسم بالإنجليزية" value={item.label_en || ''} onChange={(event) => onChange({ important_links: updateListItem(service.important_links, index, { label_en: event.target.value }) })} />
            <Field label="الاسم بالعربية" value={item.label_ar || ''} onChange={(event) => onChange({ important_links: updateListItem(service.important_links, index, { label_ar: event.target.value }) })} />
            <Field label="الرابط" className="xl:col-span-2" value={item.url || ''} onChange={(event) => onChange({ important_links: updateListItem(service.important_links, index, { url: event.target.value }) })} />
            <Field label="الترتيب" type="number" value={item.sort_order || 0} onChange={(event) => onChange({ important_links: updateListItem(service.important_links, index, { sort_order: Number(event.target.value) }) })} />
            <Toggle label="يفتح في تب جديد" checked={item.new_tab !== false} onChange={(value) => onChange({ important_links: updateListItem(service.important_links, index, { new_tab: value }) })} />
          </div>
        )}
      />
    </div>
  )
}

export default function ServicesModule({
  services,
  setServices,
  serviceDraft,
  setServiceDraft,
  serviceImageFile,
  setServiceImageFile,
  filterType,
  setFilterType,
  onCreate,
  onUpdate,
  onDelete,
  onUploadImage,
  saving,
  media = [],
}) {
  const filteredServices = useMemo(() => {
    if (filterType === 'all') return services
    return services.filter((service) => service.type === filterType)
  }, [filterType, services])

  const typeOptions = [
    ['funded', 'الحسابات الممولة'],
    ['vip', 'VIP'],
    ['scalp', 'Scalp'],
    ['courses', 'الكورسات'],
    ['offers', 'العروض'],
  ]

  return (
    <>
      <SectionCard title="إضافة خدمة أو منتج">
        <details className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <summary className="cursor-pointer list-none rounded-xl bg-white/5 p-3 font-semibold text-white">
            فتح نموذج إضافة خدمة جديدة
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Select label="نوع الخدمة" value={serviceDraft.type} onChange={(event) => setServiceDraft((current) => ({ ...current, type: event.target.value }))}>
            {typeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
          <Field label="الرابط المختصر" value={serviceDraft.slug} onChange={(event) => setServiceDraft((current) => ({ ...current, slug: event.target.value }))} />
          <Field label="الترتيب" type="number" value={serviceDraft.sort_order} onChange={(event) => setServiceDraft((current) => ({ ...current, sort_order: Number(event.target.value) }))} />
          <Field label="العنوان بالإنجليزية" value={serviceDraft.title_en} onChange={(event) => setServiceDraft((current) => ({ ...current, title_en: event.target.value }))} />
          <Field label="العنوان بالعربية" value={serviceDraft.title_ar} onChange={(event) => setServiceDraft((current) => ({ ...current, title_ar: event.target.value }))} />
          <Field label="السعر" type="number" value={serviceDraft.price} onChange={(event) => setServiceDraft((current) => ({ ...current, price: Number(event.target.value) }))} />
          <Field label="السعر قبل الخصم" type="number" value={serviceDraft.compare_price} onChange={(event) => setServiceDraft((current) => ({ ...current, compare_price: event.target.value }))} />
          <Field label="الشارة بالإنجليزية" value={serviceDraft.badge_text_en} onChange={(event) => setServiceDraft((current) => ({ ...current, badge_text_en: event.target.value }))} />
          <Field label="الشارة بالعربية" value={serviceDraft.badge_text_ar} onChange={(event) => setServiceDraft((current) => ({ ...current, badge_text_ar: event.target.value }))} />
          <Field label="نص الزر بالإنجليزية" value={serviceDraft.cta_label_en} onChange={(event) => setServiceDraft((current) => ({ ...current, cta_label_en: event.target.value }))} />
          <Field label="نص الزر بالعربية" value={serviceDraft.cta_label_ar} onChange={(event) => setServiceDraft((current) => ({ ...current, cta_label_ar: event.target.value }))} />
          <Field label="رابط الزر أو التحويل" className="md:col-span-2 xl:col-span-3" value={serviceDraft.cta_url} onChange={(event) => setServiceDraft((current) => ({ ...current, cta_url: event.target.value }))} />
          <Field label="بداية العرض" type="datetime-local" value={serviceDraft.offer_starts_at || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, offer_starts_at: event.target.value }))} />
          <Field label="نهاية العرض" type="datetime-local" value={serviceDraft.offer_ends_at || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, offer_ends_at: event.target.value }))} />
          <FilePicker label="رفع وسائط الكارت" preview={serviceDraft.card_media_url || serviceDraft.thumbnail_url} onChange={setServiceImageFile} buttonLabel={serviceImageFile?.name || 'رفع صورة أو فيديو'} />
          <MediaPicker label="اختيار وسائط الكارت من المكتبة" media={media} selectedUrl={serviceDraft.card_media_url || serviceDraft.thumbnail_url} onSelect={(item) => setServiceDraft((current) => ({ ...current, card_media_url: item.filepath, card_media_type: mediaTypeFromItem(item), ...(mediaTypeFromItem(item) === 'image' ? { thumbnail_url: item.filepath, cover_url: item.filepath } : {}) }))} />
          <TextArea label="وصف مختصر بالإنجليزية" className="md:col-span-2 xl:col-span-3" value={serviceDraft.short_description_en} onChange={(event) => setServiceDraft((current) => ({ ...current, short_description_en: event.target.value }))} />
          <TextArea label="وصف مختصر بالعربية" className="md:col-span-2 xl:col-span-3" value={serviceDraft.short_description_ar} onChange={(event) => setServiceDraft((current) => ({ ...current, short_description_ar: event.target.value }))} />
          <TextArea label="الوصف الكامل بالإنجليزية" className="md:col-span-2 xl:col-span-3" value={serviceDraft.full_description_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, full_description_en: event.target.value }))} />
          <TextArea label="الوصف الكامل بالعربية" className="md:col-span-2 xl:col-span-3" value={serviceDraft.full_description_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, full_description_ar: event.target.value }))} />
          <Toggle label="ظاهر" checked={!!serviceDraft.is_visible} onChange={(value) => setServiceDraft((current) => ({ ...current, is_visible: value }))} />
          <Toggle label="مميز" checked={!!serviceDraft.is_featured} onChange={(value) => setServiceDraft((current) => ({ ...current, is_featured: value }))} />
          </div>

          <ServiceAdvancedControls
            service={serviceDraft}
            media={media}
            onChange={(changes) => setServiceDraft((current) => ({ ...current, ...changes }))}
          />

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <RelationEditor
            title="المميزات"
            items={serviceDraft.features}
            onChange={(items) => setServiceDraft((current) => ({ ...current, features: items }))}
            factory={newFeature}
            renderRow={(item, index) => (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={`الميزة ${index + 1} بالإنجليزية`} value={item.label_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, features: updateListItem(current.features, index, { label_en: event.target.value }) }))} />
                <Field label={`الميزة ${index + 1} بالعربية`} value={item.label_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, features: updateListItem(current.features, index, { label_ar: event.target.value }) }))} />
              </div>
            )}
          />

          <RelationEditor
            title="الخطوات"
            items={serviceDraft.steps}
            onChange={(items) => setServiceDraft((current) => ({ ...current, steps: items }))}
            factory={newStep}
            renderRow={(item, index) => (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={`عنوان الخطوة ${index + 1} بالإنجليزية`} value={item.title_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, steps: updateListItem(current.steps, index, { title_en: event.target.value }) }))} />
                <Field label={`عنوان الخطوة ${index + 1} بالعربية`} value={item.title_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, steps: updateListItem(current.steps, index, { title_ar: event.target.value }) }))} />
                <TextArea label="وصف الخطوة بالإنجليزية" className="md:col-span-2" value={item.description_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, steps: updateListItem(current.steps, index, { description_en: event.target.value }) }))} />
                <TextArea label="وصف الخطوة بالعربية" className="md:col-span-2" value={item.description_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, steps: updateListItem(current.steps, index, { description_ar: event.target.value }) }))} />
              </div>
            )}
          />

          <RelationEditor
            title="الأسئلة الشائعة"
            items={serviceDraft.faqs}
            onChange={(items) => setServiceDraft((current) => ({ ...current, faqs: items }))}
            factory={newFaq}
            renderRow={(item, index) => (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={`السؤال ${index + 1} بالإنجليزية`} value={item.question_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, faqs: updateListItem(current.faqs, index, { question_en: event.target.value }) }))} />
                <Field label={`السؤال ${index + 1} بالعربية`} value={item.question_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, faqs: updateListItem(current.faqs, index, { question_ar: event.target.value }) }))} />
                <TextArea label="الإجابة بالإنجليزية" className="md:col-span-2" value={item.answer_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, faqs: updateListItem(current.faqs, index, { answer_en: event.target.value }) }))} />
                <TextArea label="الإجابة بالعربية" className="md:col-span-2" value={item.answer_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, faqs: updateListItem(current.faqs, index, { answer_ar: event.target.value }) }))} />
              </div>
            )}
          />

          <RelationEditor
            title="معرض الوسائط"
            items={serviceDraft.media}
            onChange={(items) => setServiceDraft((current) => ({ ...current, media: items }))}
            factory={newMedia}
            renderRow={(item, index) => (
              <div className="space-y-4">
                <MediaPicker
                  label="اختيار من المكتبة"
                  media={media}
                  selectedUrl={item.media_url || ''}
                  onSelect={(selected) => setServiceDraft((current) => ({ ...current, media: updateListItem(current.media, index, { media_url: selected.filepath, media_type: mediaTypeFromItem(selected) }) }))}
                />
                <Field label="رابط الوسائط" value={item.media_url || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, media: updateListItem(current.media, index, { media_url: event.target.value }) }))} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Select label="نوع الوسائط" value={item.media_type || 'image'} onChange={(event) => setServiceDraft((current) => ({ ...current, media: updateListItem(current.media, index, { media_type: event.target.value }) }))}>
                    <option value="image">صورة</option>
                    <option value="video">فيديو</option>
                    <option value="embed">مضمّن</option>
                  </Select>
                  <Field label="وصف بديل بالإنجليزية" value={item.alt_text_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, media: updateListItem(current.media, index, { alt_text_en: event.target.value }) }))} />
                  <Field label="وصف بديل بالعربية" value={item.alt_text_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, media: updateListItem(current.media, index, { alt_text_ar: event.target.value }) }))} />
                </div>
              </div>
            )}
          />
          </div>
          <div className="mt-6">
            <ActionButton onClick={onCreate} className="w-full bg-green-600 text-white sm:w-auto">
              {saving === 'service-create' ? 'جاري الحفظ...' : 'إضافة الخدمة'}
            </ActionButton>
          </div>
        </details>
      </SectionCard>

      <SectionCard
        title="الخدمات الحالية"
        action={
          <Select label="فلترة حسب النوع" value={filterType} onChange={(event) => setFilterType(event.target.value)}>
            <option value="all">كل الخدمات</option>
            {typeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        }
      >
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <details key={service.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <summary className="flex cursor-pointer list-none flex-col gap-2 rounded-xl bg-white/5 p-3 text-white sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">{service.title_ar || service.title_en || service.slug || `#${service.id}`}</span>
                <span className="text-sm text-slate-400">{typeOptions.find(([value]) => value === service.type)?.[1] || service.type}</span>
              </summary>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Select label="نوع الخدمة" value={service.type} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, type: event.target.value } : item)))}>
                  {typeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </Select>
                <Field label="الرابط المختصر" value={service.slug || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, slug: event.target.value } : item)))} />
                <Field label="الترتيب" type="number" value={service.sort_order || 0} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, sort_order: Number(event.target.value) } : item)))} />
                <Field label="العنوان بالإنجليزية" value={service.title_en || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, title_en: event.target.value } : item)))} />
                <Field label="العنوان بالعربية" value={service.title_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, title_ar: event.target.value } : item)))} />
                <Field label="السعر" type="number" value={service.price || 0} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, price: Number(event.target.value) } : item)))} />
                <Field label="السعر قبل الخصم" type="number" value={service.compare_price || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, compare_price: event.target.value } : item)))} />
                <Field label="الشارة بالإنجليزية" value={service.badge_text_en || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, badge_text_en: event.target.value } : item)))} />
                <Field label="الشارة بالعربية" value={service.badge_text_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, badge_text_ar: event.target.value } : item)))} />
                <Field label="نص الزر بالإنجليزية" value={service.cta_label_en || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, cta_label_en: event.target.value } : item)))} />
                <Field label="نص الزر بالعربية" value={service.cta_label_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, cta_label_ar: event.target.value } : item)))} />
                <Field label="رابط الزر أو التحويل" className="md:col-span-2 xl:col-span-3" value={service.cta_url || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, cta_url: event.target.value } : item)))} />
                <Field label="بداية العرض" type="datetime-local" value={service.offer_starts_at || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, offer_starts_at: event.target.value } : item)))} />
                <Field label="نهاية العرض" type="datetime-local" value={service.offer_ends_at || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, offer_ends_at: event.target.value } : item)))} />
                <FilePicker label="رفع وسائط الكارت" preview={service.card_media_url || service.thumbnail_url || service.cover_url || ''} onChange={(file) => onUploadImage(service, file)} buttonLabel="رفع صورة أو فيديو" />
                <MediaPicker label="اختيار وسائط الكارت من المكتبة" media={media} selectedUrl={service.card_media_url || service.thumbnail_url || service.cover_url || ''} onSelect={(item) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, card_media_url: item.filepath, card_media_type: mediaTypeFromItem(item), ...(mediaTypeFromItem(item) === 'image' ? { thumbnail_url: item.filepath, cover_url: item.filepath } : {}) } : entry)))} />
                <TextArea label="وصف مختصر بالإنجليزية" className="md:col-span-2 xl:col-span-3" value={service.short_description_en || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, short_description_en: event.target.value } : item)))} />
                <TextArea label="وصف مختصر بالعربية" className="md:col-span-2 xl:col-span-3" value={service.short_description_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, short_description_ar: event.target.value } : item)))} />
                <TextArea label="الوصف الكامل بالإنجليزية" className="md:col-span-2 xl:col-span-3" value={service.full_description_en || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, full_description_en: event.target.value } : item)))} />
                <TextArea label="الوصف الكامل بالعربية" className="md:col-span-2 xl:col-span-3" value={service.full_description_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, full_description_ar: event.target.value } : item)))} />
                <Toggle label="ظاهر" checked={!!service.is_visible} onChange={(value) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, is_visible: value } : item)))} />
                <Toggle label="مميز" checked={!!service.is_featured} onChange={(value) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, is_featured: value } : item)))} />
              </div>

              <ServiceAdvancedControls
                service={service}
                media={media}
                onChange={(changes) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, ...changes } : item)))}
              />

              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                <RelationEditor
                  title="المميزات"
                  items={service.features}
                  onChange={(items) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, features: items } : item)))}
                  factory={newFeature}
                  renderRow={(item, index) => (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={`الميزة ${index + 1} بالإنجليزية`} value={item.label_en || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, features: updateListItem(entry.features, index, { label_en: event.target.value }) } : entry)))} />
                      <Field label={`الميزة ${index + 1} بالعربية`} value={item.label_ar || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, features: updateListItem(entry.features, index, { label_ar: event.target.value }) } : entry)))} />
                    </div>
                  )}
                />

                <RelationEditor
                  title="الخطوات"
                  items={service.steps}
                  onChange={(items) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, steps: items } : item)))}
                  factory={newStep}
                  renderRow={(item, index) => (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={`عنوان الخطوة ${index + 1} بالإنجليزية`} value={item.title_en || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, steps: updateListItem(entry.steps, index, { title_en: event.target.value }) } : entry)))} />
                      <Field label={`عنوان الخطوة ${index + 1} بالعربية`} value={item.title_ar || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, steps: updateListItem(entry.steps, index, { title_ar: event.target.value }) } : entry)))} />
                      <TextArea label="وصف الخطوة بالإنجليزية" className="md:col-span-2" value={item.description_en || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, steps: updateListItem(entry.steps, index, { description_en: event.target.value }) } : entry)))} />
                      <TextArea label="وصف الخطوة بالعربية" className="md:col-span-2" value={item.description_ar || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, steps: updateListItem(entry.steps, index, { description_ar: event.target.value }) } : entry)))} />
                    </div>
                  )}
                />

                <RelationEditor
                  title="الأسئلة الشائعة"
                  items={service.faqs}
                  onChange={(items) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, faqs: items } : item)))}
                  factory={newFaq}
                  renderRow={(item, index) => (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={`السؤال ${index + 1} بالإنجليزية`} value={item.question_en || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, faqs: updateListItem(entry.faqs, index, { question_en: event.target.value }) } : entry)))} />
                      <Field label={`السؤال ${index + 1} بالعربية`} value={item.question_ar || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, faqs: updateListItem(entry.faqs, index, { question_ar: event.target.value }) } : entry)))} />
                      <TextArea label="الإجابة بالإنجليزية" className="md:col-span-2" value={item.answer_en || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, faqs: updateListItem(entry.faqs, index, { answer_en: event.target.value }) } : entry)))} />
                      <TextArea label="الإجابة بالعربية" className="md:col-span-2" value={item.answer_ar || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, faqs: updateListItem(entry.faqs, index, { answer_ar: event.target.value }) } : entry)))} />
                    </div>
                  )}
                />

                <RelationEditor
                  title="معرض الوسائط"
                  items={service.media}
                  onChange={(items) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, media: items } : item)))}
                  factory={newMedia}
                  renderRow={(item, index) => (
                    <div className="space-y-4">
                      <MediaPicker
                        label="اختيار من المكتبة"
                        media={media}
                        selectedUrl={item.media_url || ''}
                        onSelect={(selected) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, media: updateListItem(entry.media, index, { media_url: selected.filepath, media_type: mediaTypeFromItem(selected) }) } : entry)))}
                      />
                      <Field label="رابط الوسائط" value={item.media_url || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, media: updateListItem(entry.media, index, { media_url: event.target.value }) } : entry)))} />
                      <div className="grid gap-4 md:grid-cols-2">
                        <Select label="نوع الوسائط" value={item.media_type || 'image'} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, media: updateListItem(entry.media, index, { media_type: event.target.value }) } : entry)))} >
                          <option value="image">صورة</option>
                          <option value="video">فيديو</option>
                          <option value="embed">مضمّن</option>
                        </Select>
                        <Field label="وصف بديل بالإنجليزية" value={item.alt_text_en || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, media: updateListItem(entry.media, index, { alt_text_en: event.target.value }) } : entry)))} />
                        <Field label="وصف بديل بالعربية" value={item.alt_text_ar || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, media: updateListItem(entry.media, index, { alt_text_ar: event.target.value }) } : entry)))} />
                      </div>
                    </div>
                  )}
                />
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <ActionButton onClick={() => onUpdate(service)} className="bg-green-600 text-white">
                  {saving === `service-${service.id}` ? 'جاري الحفظ...' : 'حفظ'}
                </ActionButton>
                <ActionButton onClick={() => onDelete(service.id)} className="bg-red-500/10 text-red-300">
                  <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> حذف</span>
                </ActionButton>
              </div>
            </details>
          ))}
        </div>
      </SectionCard>
    </>
  )
}
