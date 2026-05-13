import { Trash2 } from 'lucide-react'
import { ActionButton, Field, MediaPreview, SectionCard, Select, TextArea, Toggle } from './shared/AdminUI'

const categoryOptions = [
  ['analysis', 'تحليل'],
  ['signal', 'إشارة'],
  ['news', 'خبر'],
  ['gold', 'ذهب'],
  ['forex', 'فوركس'],
]

function isImageMedia(item) {
  const mime = String(item?.mimetype || '')
  const path = String(item?.filepath || item?.url || '')
  return mime.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)(\?|#|$)/i.test(path)
}

function MarketImageControls({ value, file, onFileChange, onSelect, media = [] }) {
  const images = media.filter(isImageMedia)
  const selectedUrl = value || ''

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white">صورة التحديث</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">ارفع صورة أو اختر صورة جاهزة من المكتبة.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[7rem_minmax(0,1fr)] xl:grid-cols-1">
        <div className="flex aspect-[16/10] min-h-24 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
          {selectedUrl ? (
            <MediaPreview src={selectedUrl} alt="صورة التحديث" className="h-full w-full" />
          ) : (
            <span className="text-xs font-bold text-slate-500">بدون صورة</span>
          )}
        </div>

        <div className="min-w-0">
          <label className="admin-action-button w-full cursor-pointer border border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15">
            اختيار صورة من الجهاز
            <input type="file" accept="image/*" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} className="sr-only" />
          </label>
          <div className="mt-2 truncate text-xs text-slate-500">{file?.name || 'لم يتم اختيار ملف جديد'}</div>
        </div>
      </div>

      <details className="mt-3 rounded-2xl border border-slate-700/70 bg-slate-900/45">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-slate-100 transition hover:text-cyan-200">
          اختيار من مكتبة الوسائط
        </summary>
        <div className="border-t border-white/10 p-3">
          {images.length ? (
            <div className="grid max-h-52 grid-cols-3 gap-2 overflow-y-auto pr-1">
              {images.map((item) => {
                const url = item.filepath || item.url || ''
                return (
                  <button
                    key={item.id || url}
                    type="button"
                    onClick={() => onSelect(url)}
                    className={`overflow-hidden rounded-xl border bg-slate-950/70 text-right transition hover:border-cyan-300/60 ${
                      selectedUrl === url ? 'border-cyan-300 ring-2 ring-cyan-300/20' : 'border-white/10'
                    }`}
                  >
                    <img src={url} alt={item.filename || 'صورة'} className="h-16 w-full object-cover" />
                    <div className="truncate px-2 py-1.5 text-[11px] font-bold text-slate-300">{item.filename || 'صورة'}</div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-400">لا توجد صور في المكتبة حالياً.</div>
          )}
        </div>
      </details>
    </div>
  )
}

function MarketUpdateForm({ value, onChange, imageFile, onImageFileChange, media }) {
  const setField = (field, nextValue) => onChange({ ...value, [field]: nextValue })

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-white">بيانات التحديث</h3>
          <p className="mt-1 text-xs leading-6 text-slate-400">اكتب البيانات الأساسية بالعربية. الترجمات الإنجليزية من تبويب الترجمات.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Field label="العنوان بالعربية" className="lg:col-span-2" value={value.title_ar || ''} onChange={(event) => setField('title_ar', event.target.value)} />
          <Select label="التصنيف" value={value.category || 'analysis'} onChange={(event) => setField('category', event.target.value)}>
            {categoryOptions.map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}
          </Select>
          <Field label="اسم الكاتب" value={value.author_name || ''} onChange={(event) => setField('author_name', event.target.value)} />
          <Field label="تاريخ النشر" type="datetime-local" value={value.published_at || ''} onChange={(event) => setField('published_at', event.target.value)} />
          <Field label="الترتيب" type="number" value={value.sort_order || 0} onChange={(event) => setField('sort_order', Number(event.target.value))} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-white">المحتوى العربي</h3>
              <p className="mt-1 text-xs leading-6 text-slate-400">الملخص يظهر في كارت التحديث، والمحتوى يظهر في التفاصيل.</p>
            </div>
            <div className="grid gap-4">
              <TextArea label="الملخص بالعربية" value={value.summary_ar || ''} onChange={(event) => setField('summary_ar', event.target.value)} />
              <TextArea label="المحتوى بالعربية" value={value.content_ar || ''} onChange={(event) => setField('content_ar', event.target.value)} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Toggle label="ظاهر" checked={!!value.is_visible} onChange={(nextValue) => setField('is_visible', nextValue)} />
            <Toggle label="مميز" checked={!!value.is_featured} onChange={(nextValue) => setField('is_featured', nextValue)} />
            <Toggle label="مثبت" checked={!!value.is_pinned} onChange={(nextValue) => setField('is_pinned', nextValue)} />
          </div>
        </div>

        <MarketImageControls
          value={value.image_url || ''}
          file={imageFile}
          onFileChange={onImageFileChange}
          onSelect={(url) => setField('image_url', url)}
          media={media}
        />
      </div>
    </div>
  )
}

export default function MarketModule({
  updates,
  setUpdates,
  draft,
  setDraft,
  draftImageFile,
  setDraftImageFile,
  onCreate,
  onUpdate,
  onDelete,
  onUploadImage,
  saving,
  media = [],
}) {
  return (
    <>
      <SectionCard
        title="إضافة تحديث سوق"
        action={<ActionButton onClick={onCreate} className="w-full bg-green-600 text-white sm:w-auto">{saving === 'market-create' ? 'جاري الحفظ...' : 'إضافة تحديث'}</ActionButton>}
      >
        <MarketUpdateForm
          value={draft}
          onChange={setDraft}
          imageFile={draftImageFile}
          onImageFileChange={setDraftImageFile}
          media={media}
        />
      </SectionCard>

      <SectionCard title="تحديثات السوق الحالية">
        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <MarketUpdateForm
                value={update}
                onChange={(nextUpdate) => setUpdates((current) => current.map((item) => (item.id === update.id ? nextUpdate : item)))}
                imageFile={null}
                onImageFileChange={(file) => onUploadImage(update, file)}
                media={media}
              />
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <ActionButton onClick={() => onUpdate(update)} className="bg-green-600 text-white">
                  {saving === `market-${update.id}` ? 'جاري الحفظ...' : 'حفظ'}
                </ActionButton>
                <ActionButton onClick={() => onDelete(update.id)} className="bg-red-500/10 text-red-300">
                  <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> حذف</span>
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}
