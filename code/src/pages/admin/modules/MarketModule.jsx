import { Trash2 } from 'lucide-react'
import { ActionButton, Field, FilePicker, MediaPicker, SectionCard, Select, TextArea, Toggle } from './shared/AdminUI'

const categoryOptions = [
  ['analysis', 'تحليل'],
  ['signal', 'إشارة'],
  ['news', 'خبر'],
  ['gold', 'ذهب'],
  ['forex', 'فوركس'],
]

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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="العنوان بالإنجليزية" value={draft.title_en} onChange={(event) => setDraft((current) => ({ ...current, title_en: event.target.value }))} />
          <Field label="العنوان بالعربية" value={draft.title_ar} onChange={(event) => setDraft((current) => ({ ...current, title_ar: event.target.value }))} />
          <Select label="التصنيف" value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}>
            {categoryOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
          <Field label="اسم الكاتب" value={draft.author_name} onChange={(event) => setDraft((current) => ({ ...current, author_name: event.target.value }))} />
          <Field label="تاريخ النشر" type="datetime-local" value={draft.published_at} onChange={(event) => setDraft((current) => ({ ...current, published_at: event.target.value }))} />
          <Field label="الترتيب" type="number" value={draft.sort_order} onChange={(event) => setDraft((current) => ({ ...current, sort_order: Number(event.target.value) }))} />
          <FilePicker label="رفع صورة التحديث" preview={draft.image_url} onChange={setDraftImageFile} buttonLabel={draftImageFile?.name || 'رفع صورة'} accept="image/*" />
          <MediaPicker label="اختيار صورة من المكتبة" media={media} selectedUrl={draft.image_url} onSelect={(item) => setDraft((current) => ({ ...current, image_url: item.filepath }))} />
          <TextArea label="الملخص بالإنجليزية" className="md:col-span-2 xl:col-span-3" value={draft.summary_en} onChange={(event) => setDraft((current) => ({ ...current, summary_en: event.target.value }))} />
          <TextArea label="الملخص بالعربية" className="md:col-span-2 xl:col-span-3" value={draft.summary_ar} onChange={(event) => setDraft((current) => ({ ...current, summary_ar: event.target.value }))} />
          <TextArea label="المحتوى بالإنجليزية" className="md:col-span-2 xl:col-span-3" value={draft.content_en} onChange={(event) => setDraft((current) => ({ ...current, content_en: event.target.value }))} />
          <TextArea label="المحتوى بالعربية" className="md:col-span-2 xl:col-span-3" value={draft.content_ar} onChange={(event) => setDraft((current) => ({ ...current, content_ar: event.target.value }))} />
          <Toggle label="ظاهر" checked={!!draft.is_visible} onChange={(value) => setDraft((current) => ({ ...current, is_visible: value }))} />
          <Toggle label="مميز" checked={!!draft.is_featured} onChange={(value) => setDraft((current) => ({ ...current, is_featured: value }))} />
          <Toggle label="مثبت" checked={!!draft.is_pinned} onChange={(value) => setDraft((current) => ({ ...current, is_pinned: value }))} />
        </div>
      </SectionCard>

      <SectionCard title="تحديثات السوق الحالية">
        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="العنوان بالإنجليزية" value={update.title_en || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, title_en: event.target.value } : item)))} />
                <Field label="العنوان بالعربية" value={update.title_ar || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, title_ar: event.target.value } : item)))} />
                <Select label="التصنيف" value={update.category || 'analysis'} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, category: event.target.value } : item)))}>
                  {categoryOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </Select>
                <Field label="اسم الكاتب" value={update.author_name || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, author_name: event.target.value } : item)))} />
                <Field label="تاريخ النشر" type="datetime-local" value={update.published_at || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, published_at: event.target.value } : item)))} />
                <Field label="الترتيب" type="number" value={update.sort_order || 0} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, sort_order: Number(event.target.value) } : item)))} />
                <FilePicker label="رفع صورة التحديث" preview={update.image_url || ''} onChange={(file) => onUploadImage(update, file)} buttonLabel="رفع صورة" accept="image/*" />
                <MediaPicker label="اختيار صورة من المكتبة" media={media} selectedUrl={update.image_url || ''} onSelect={(item) => setUpdates((current) => current.map((entry) => (entry.id === update.id ? { ...entry, image_url: item.filepath } : entry)))} />
                <TextArea label="الملخص بالإنجليزية" className="md:col-span-2 xl:col-span-3" value={update.summary_en || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, summary_en: event.target.value } : item)))} />
                <TextArea label="الملخص بالعربية" className="md:col-span-2 xl:col-span-3" value={update.summary_ar || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, summary_ar: event.target.value } : item)))} />
                <TextArea label="المحتوى بالإنجليزية" className="md:col-span-2 xl:col-span-3" value={update.content_en || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, content_en: event.target.value } : item)))} />
                <TextArea label="المحتوى بالعربية" className="md:col-span-2 xl:col-span-3" value={update.content_ar || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, content_ar: event.target.value } : item)))} />
                <Toggle label="ظاهر" checked={!!update.is_visible} onChange={(value) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, is_visible: value } : item)))} />
                <Toggle label="مميز" checked={!!update.is_featured} onChange={(value) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, is_featured: value } : item)))} />
                <Toggle label="مثبت" checked={!!update.is_pinned} onChange={(value) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, is_pinned: value } : item)))} />
              </div>
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
