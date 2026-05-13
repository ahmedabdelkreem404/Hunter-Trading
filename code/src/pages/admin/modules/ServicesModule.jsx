import { useEffect, useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ActionButton, Field, FilePicker, MediaPicker, MediaPreview, SectionCard, Select, TextArea, Toggle, confirmDelete } from './shared/AdminUI'
import { inferMediaTypeFromUrl } from '../../../utils/media'

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
  return { label_en: '', label_ar: '', url: '', is_visible: true, new_tab: true, sort_order: 1 }
}

function mediaTypeFromItem(item = {}) {
  const mimetype = String(item.mimetype || '')
  if (mimetype.startsWith('video/')) return 'video'
  return inferMediaTypeFromUrl(item.filepath || '', 'image')
}

function mediaUrlChanges(url, urlField, typeField, fallbackType = 'image') {
  return {
    [urlField]: url,
    [typeField]: inferMediaTypeFromUrl(url, fallbackType),
  }
}

function asBool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback
  return value === true || value === 1 || value === '1'
}

function EditorPanel({ title, description, children, defaultOpen = false }) {
  const header = (
    <div className="min-w-0">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {description ? <p className="mt-1 text-xs leading-6 text-slate-400">{description}</p> : null}
    </div>
  )

  if (defaultOpen) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 sm:p-5">
        {header}
        <div className="mt-4">{children}</div>
      </div>
    )
  }

  return (
    <details className="group rounded-2xl border border-white/10 bg-slate-950/45 transition hover:border-hunter-green/20 hover:bg-slate-950/65">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5">
        {header}
        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300 transition group-open:bg-hunter-green/15 group-open:text-hunter-green">
          فتح / إغلاق
        </span>
      </summary>
      <div className="border-t border-white/10 p-4 sm:p-5">{children}</div>
    </details>
  )
}

function RelationEditor({ title, items, onChange, factory, renderRow }) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/35 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <ActionButton
          type="button"
          onClick={() => onChange([...(items || []), factory()])}
          className="min-h-9 border border-white/10 bg-white/5 px-3 py-2 text-slate-200 hover:bg-white/10"
        >
          <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> إضافة</span>
        </ActionButton>
      </div>

      <div className="space-y-3">
        {cloneList(items, factory).map((item, index) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-slate-900/55 p-3 sm:p-4">
          {renderRow(item, index)}
          <div className="mt-3 flex justify-end">
            <ActionButton
              type="button"
              onClick={async () => {
                if (!(await confirmDelete(`هل تريد حذف عنصر من ${title}؟`))) return
                onChange((items || []).filter((_, currentIndex) => currentIndex !== index))
              }}
              className="min-h-9 bg-red-500/10 px-3 py-2 text-red-300 hover:bg-red-500/15"
            >
              <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> حذف</span>
            </ActionButton>
          </div>
        </div>
        ))}
      </div>
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

function shortUrl(url = '') {
  if (!url) return 'لم يتم الاختيار'
  const clean = String(url).split('?')[0]
  return clean.split('/').filter(Boolean).pop() || clean
}

function isImageMedia(item = {}) {
  const mimetype = String(item.mimetype || '')
  const filepath = String(item.filepath || '')
  return mimetype.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)(\?|#|$)/i.test(filepath)
}

function LibraryPickerPanel({ label, selectedUrl, media, onSelect, onUpload, mediaMode = 'all', accept = 'image/*,video/mp4,video/webm,video/quicktime' }) {
  const visibleMedia = mediaMode === 'image' ? media.filter(isImageMedia) : media

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/45 p-3 transition hover:border-cyan-300/25 hover:bg-slate-900/70">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/80">
          {selectedUrl ? <MediaPreview src={selectedUrl} alt={label} className="h-full w-full" /> : <span className="text-[10px] font-bold text-slate-500">Media</span>}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-white">{label}</div>
          <div className="mt-1 truncate text-xs text-slate-400">{shortUrl(selectedUrl)}</div>
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        {onUpload ? (
          <label className="admin-action-button w-full cursor-pointer border border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15">
            رفع من الجهاز
            <input type="file" accept={accept} onChange={(event) => onUpload(event.target.files?.[0] ?? null)} className="sr-only" />
          </label>
        ) : null}

        <details className="rounded-xl border border-white/10 bg-slate-950/45">
          <summary className="cursor-pointer list-none px-3 py-2 text-center text-sm font-bold text-white transition hover:text-cyan-200">
            اختيار من مكتبة الوسائط
          </summary>
          <div className="border-t border-white/10 p-3">
            {visibleMedia.length ? (
              <div className="grid max-h-52 grid-cols-2 gap-2 overflow-y-auto pr-1">
                {visibleMedia.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item)}
                    className={`overflow-hidden rounded-xl border bg-slate-950/70 text-right transition hover:border-cyan-300/60 ${
                      selectedUrl === item.filepath ? 'border-cyan-300 ring-2 ring-cyan-300/20' : 'border-white/10'
                    }`}
                  >
                    <MediaPreview src={item.filepath} alt={item.filename} className="h-14 w-full" />
                    <div className="truncate px-2 py-1 text-[11px] font-bold text-slate-300">{item.filename}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-center text-xs leading-5 text-slate-400">
                لا توجد ملفات مناسبة في المكتبة.
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  )
}

function ServiceAdvancedControls({ service, onChange, onUpload, media = [] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white">وسائط الكارت وصفحة التفاصيل</h3>
          <p className="mt-1 text-xs leading-6 text-slate-400">كل جزء مستقل: وسائط الكارت تظهر في الصفحة الرئيسية، ووسائط التفاصيل تظهر داخل صفحة الخدمة.</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/35 p-4">
            <h4 className="mb-4 text-sm font-bold text-hunter-green">وسائط الكارت</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <Select label="نوع وسائط الكارت" value={service.card_media_type || 'image'} onChange={(event) => onChange({ card_media_type: event.target.value })}>
                <option value="image">صورة</option>
                <option value="video">فيديو</option>
                <option value="embed">رابط مدمج</option>
              </Select>
              <Field label="رابط وسائط الكارت" value={service.card_media_url || ''} onChange={(event) => onChange(mediaUrlChanges(event.target.value, 'card_media_url', 'card_media_type', service.card_media_type || 'image'))} />
              <Field label="صورة غلاف فيديو الكارت" className="md:col-span-2" value={service.card_video_poster_url || ''} onChange={(event) => onChange({ card_video_poster_url: event.target.value })} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <LibraryPickerPanel
                label="اختيار وسائط الكارت"
                media={media}
                selectedUrl={service.card_media_url || ''}
                onSelect={(item) => onChange({ card_media_url: item.filepath, card_media_type: mediaTypeFromItem(item) })}
                onUpload={onUpload ? (file) => onUpload(file, 'card_media_url') : null}
              />
              <LibraryPickerPanel
                label="اختيار غلاف فيديو الكارت"
                media={media}
                selectedUrl={service.card_video_poster_url || ''}
                onSelect={(item) => onChange({ card_video_poster_url: item.filepath })}
                onUpload={onUpload ? (file) => onUpload(file, 'card_video_poster_url') : null}
                mediaMode="image"
                accept="image/*"
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              <Toggle label="تشغيل تلقائي" checked={asBool(service.card_video_autoplay, true)} onChange={(value) => onChange({ card_video_autoplay: value })} />
              <Toggle label="كتم الصوت" checked={asBool(service.card_video_muted, true)} onChange={(value) => onChange({ card_video_muted: value })} />
              <Toggle label="تكرار الفيديو" checked={asBool(service.card_video_loop, true)} onChange={(value) => onChange({ card_video_loop: value })} />
              <Toggle label="إظهار أزرار التحكم" checked={asBool(service.card_video_controls, false)} onChange={(value) => onChange({ card_video_controls: value })} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/35 p-4">
            <h4 className="mb-4 text-sm font-bold text-hunter-green">وسائط صفحة التفاصيل</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <Select label="نوع وسائط التفاصيل" value={service.cover_media_type || 'image'} onChange={(event) => onChange({ cover_media_type: event.target.value })}>
                <option value="image">صورة</option>
                <option value="video">فيديو</option>
                <option value="embed">رابط مدمج</option>
              </Select>
              <Field label="رابط وسائط التفاصيل" value={service.cover_url || ''} onChange={(event) => onChange(mediaUrlChanges(event.target.value, 'cover_url', 'cover_media_type', service.cover_media_type || 'image'))} />
              <Field label="صورة غلاف فيديو التفاصيل" className="md:col-span-2" value={service.cover_video_poster_url || ''} onChange={(event) => onChange({ cover_video_poster_url: event.target.value })} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <LibraryPickerPanel
                label="اختيار وسائط التفاصيل"
                media={media}
                selectedUrl={service.cover_url || ''}
                onSelect={(item) => onChange({ cover_url: item.filepath, cover_media_type: mediaTypeFromItem(item) })}
                onUpload={onUpload ? (file) => onUpload(file, 'cover_url') : null}
              />
              <LibraryPickerPanel
                label="اختيار غلاف فيديو التفاصيل"
                media={media}
                selectedUrl={service.cover_video_poster_url || ''}
                onSelect={(item) => onChange({ cover_video_poster_url: item.filepath })}
                onUpload={onUpload ? (file) => onUpload(file, 'cover_video_poster_url') : null}
                mediaMode="image"
                accept="image/*"
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              <Toggle label="تشغيل تلقائي" checked={asBool(service.cover_video_autoplay, true)} onChange={(value) => onChange({ cover_video_autoplay: value })} />
              <Toggle label="كتم الصوت" checked={asBool(service.cover_video_muted, true)} onChange={(value) => onChange({ cover_video_muted: value })} />
              <Toggle label="تكرار الفيديو" checked={asBool(service.cover_video_loop, true)} onChange={(value) => onChange({ cover_video_loop: value })} />
              <Toggle label="إظهار أزرار التحكم" checked={asBool(service.cover_video_controls, false)} onChange={(value) => onChange({ cover_video_controls: value })} />
            </div>
          </div>
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
        title="أزرار صفحة التفاصيل والريفيرال"
        items={service.important_links}
        onChange={(items) => onChange({ important_links: items })}
        factory={newImportantLink}
        renderRow={(item, index) => (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Field label="اسم الزر بالإنجليزية" value={item.label_en || ''} onChange={(event) => onChange({ important_links: updateListItem(service.important_links, index, { label_en: event.target.value }) })} />
            <Field label="اسم الزر بالعربية" value={item.label_ar || ''} onChange={(event) => onChange({ important_links: updateListItem(service.important_links, index, { label_ar: event.target.value }) })} />
            <Field label="رابط الزر" className="xl:col-span-2" value={item.url || ''} onChange={(event) => onChange({ important_links: updateListItem(service.important_links, index, { url: event.target.value }) })} />
            <Field label="الترتيب" type="number" value={item.sort_order || 0} onChange={(event) => onChange({ important_links: updateListItem(service.important_links, index, { sort_order: Number(event.target.value) }) })} />
            <Toggle label="ظاهر" checked={item.is_visible !== false} onChange={(value) => onChange({ important_links: updateListItem(service.important_links, index, { is_visible: value }) })} />
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
  onUploadDraftMedia,
  onUploadDraftGalleryMedia,
  onUploadGalleryMedia,
  saving,
  media = [],
  lockedType = '',
  moduleTitle = '',
  moduleDescription = '',
}) {
  useEffect(() => {
    if (!lockedType) return
    setServiceDraft((current) => (current.type === lockedType ? current : { ...current, type: lockedType }))
  }, [lockedType, setServiceDraft])

  const filteredServices = useMemo(() => {
    const effectiveType = lockedType || filterType
    if (effectiveType === 'all') return services
    return services.filter((service) => service.type === effectiveType)
  }, [filterType, lockedType, services])

  const typeOptions = [
    ['funded', 'الحسابات الممولة'],
    ['vip', 'VIP'],
    ['scalp', 'Scalp'],
    ['courses', 'الكورسات'],
    ['offers', 'العروض'],
  ]

  const currentTypeLabel = moduleTitle || typeOptions.find(([value]) => value === lockedType)?.[1] || 'الخدمة'

  return (
    <>
      <SectionCard title={`إضافة عنصر جديد في ${lockedType ? currentTypeLabel : 'الخدمات والمنتجات'}`}>
        {moduleDescription ? <p className="mb-5 text-sm leading-7 text-slate-400">{moduleDescription}</p> : null}
        <details className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <summary className="cursor-pointer list-none rounded-xl bg-white/5 p-3 font-semibold text-white">
            فتح نموذج إضافة خدمة جديدة
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lockedType ? (
            <Field label="نوع السكشن" value={currentTypeLabel} readOnly />
          ) : (
            <Select label="نوع الخدمة" value={serviceDraft.type} onChange={(event) => setServiceDraft((current) => ({ ...current, type: event.target.value }))}>
              {typeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Select>
          )}
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
            onUpload={(file, target) => onUploadDraftMedia?.(file, target)}
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
                  onUpload={(file) => onUploadDraftGalleryMedia?.(index, file)}
                />
                <Field label="رابط الوسائط" value={item.media_url || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, media: updateListItem(current.media, index, { media_url: event.target.value, media_type: inferMediaTypeFromUrl(event.target.value, item.media_type || 'image') }) }))} />
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
            <ActionButton onClick={() => onCreate(lockedType)} className="w-full bg-green-600 text-white sm:w-auto">
              {saving === 'service-create' ? 'جاري الحفظ...' : 'إضافة الخدمة'}
            </ActionButton>
          </div>
        </details>
      </SectionCard>

      <SectionCard
        title={lockedType ? `العناصر الحالية في ${currentTypeLabel}` : 'الخدمات الحالية'}
        action={!lockedType ? (
          <Select label="فلترة حسب النوع" value={filterType} onChange={(event) => setFilterType(event.target.value)}>
            <option value="all">كل الخدمات</option>
            {typeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        ) : null}
      >
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
              لا توجد عناصر مضافة في هذا السكشن حتى الآن.
            </div>
          ) : null}
          {filteredServices.map((service) => (
            <details key={service.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <summary className="flex cursor-pointer list-none flex-col gap-2 rounded-xl bg-white/5 p-3 text-white sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">{service.title_ar || service.title_en || service.slug || `#${service.id}`}</span>
                <span className="text-sm text-slate-400">{typeOptions.find(([value]) => value === service.type)?.[1] || service.type}</span>
              </summary>
              <div className="mt-4 space-y-4">
                <EditorPanel title="البيانات الأساسية" description="أهم بيانات الكارت والصفحة. خلّي الجزء ده هو مكان التعديل اليومي." defaultOpen>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {lockedType ? (
                      <Field label="نوع السكشن" value={currentTypeLabel} readOnly />
                    ) : (
                      <Select label="نوع الخدمة" value={service.type} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, type: event.target.value } : item)))}>
                        {typeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </Select>
                    )}
                    <Field label="الرابط المختصر" value={service.slug || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, slug: event.target.value } : item)))} />
                    <Field label="الترتيب" type="number" value={service.sort_order || 0} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, sort_order: Number(event.target.value) } : item)))} />
                    <Field label="العنوان بالعربية" value={service.title_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, title_ar: event.target.value } : item)))} />
                    <Field label="السعر" type="number" value={service.price || 0} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, price: Number(event.target.value) } : item)))} />
                    <Field label="السعر قبل الخصم" type="number" value={service.compare_price || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, compare_price: event.target.value } : item)))} />
                    <Field label="الشارة بالعربية" value={service.badge_text_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, badge_text_ar: event.target.value } : item)))} />
                    <Field label="نص الزر بالعربية" value={service.cta_label_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, cta_label_ar: event.target.value } : item)))} />
                    <Field label="رابط الزر أو التحويل" value={service.cta_url || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, cta_url: event.target.value } : item)))} />
                    <Field label="بداية العرض" type="datetime-local" value={service.offer_starts_at || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, offer_starts_at: event.target.value } : item)))} />
                    <Field label="نهاية العرض" type="datetime-local" value={service.offer_ends_at || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, offer_ends_at: event.target.value } : item)))} />
                    <TextArea label="وصف مختصر بالعربية" className="md:col-span-2 xl:col-span-3" value={service.short_description_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, short_description_ar: event.target.value } : item)))} />
                    <TextArea label="الوصف الكامل بالعربية" className="md:col-span-2 xl:col-span-3" value={service.full_description_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, full_description_ar: event.target.value } : item)))} />
                    <Toggle label="ظاهر" checked={!!service.is_visible} onChange={(value) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, is_visible: value } : item)))} />
                    <Toggle label="مميز" checked={!!service.is_featured} onChange={(value) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, is_featured: value } : item)))} />
                  </div>
                </EditorPanel>

                <EditorPanel title="الوسائط والزر والشروط" description="صور وفيديوهات الكارت، وسائط صفحة التفاصيل، سلوك الزر، الشروط، الريفيرال والروابط المهمة.">
                  <ServiceAdvancedControls
                    service={service}
                    media={media}
                    onUpload={(file, target) => onUploadImage(service, file, target)}
                    onChange={(changes) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, ...changes } : item)))}
                  />
                </EditorPanel>

                <EditorPanel title="محتوى صفحة التفاصيل" description="المميزات، الخطوات، الأسئلة الشائعة ومعرض الوسائط. افتح الجزء الذي تحتاج تعديله فقط.">
                  <div className="grid gap-4 xl:grid-cols-2">
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
                            onUpload={(file) => onUploadGalleryMedia?.(service, index, file)}
                          />
                          <Field label="رابط الوسائط" value={item.media_url || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, media: updateListItem(entry.media, index, { media_url: event.target.value, media_type: inferMediaTypeFromUrl(event.target.value, item.media_type || 'image') }) } : entry)))} />
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
                </EditorPanel>
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
