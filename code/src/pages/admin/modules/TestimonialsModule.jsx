import { Trash2 } from 'lucide-react'
import { ActionButton, Field, FilePicker, MediaPicker, SectionCard, Select, TextArea, Toggle } from './shared/AdminUI'

function serviceLabel(service) {
  return service.title_ar || service.title_en || `#${service.id}`
}

export default function TestimonialsModule({
  testimonials,
  setTestimonials,
  draft,
  setDraft,
  draftImageFile,
  setDraftImageFile,
  onCreate,
  onUpdate,
  onDelete,
  onUploadImage,
  saving,
  services = [],
  media = [],
}) {
  return (
    <>
      <SectionCard
        title="إضافة رأي عميل"
        action={<ActionButton onClick={onCreate} className="w-full bg-green-600 text-white sm:w-auto">{saving === 'testimonial-create' ? 'جاري الحفظ...' : 'إضافة رأي'}</ActionButton>}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="اسم العميل" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
          <Field label="الموقع أو الدولة" value={draft.location} onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))} />
          <Select
            label="الخدمة المرتبطة"
            value={draft.service_id || ''}
            onChange={(event) => {
              const selected = services.find((service) => String(service.id) === event.target.value)
              setDraft((current) => ({ ...current, service_id: selected?.id || null, service_type: selected?.type || '' }))
            }}
          >
            <option value="">بدون خدمة</option>
            {services.map((service) => <option key={service.id} value={service.id}>{serviceLabel(service)}</option>)}
          </Select>
          <Field label="رابط الفيديو" value={draft.video_url} onChange={(event) => setDraft((current) => ({ ...current, video_url: event.target.value }))} />
          <Field label="التقييم" type="number" min="1" max="5" value={draft.rating} onChange={(event) => setDraft((current) => ({ ...current, rating: Number(event.target.value) }))} />
          <Field label="الترتيب" type="number" value={draft.order_index || 0} onChange={(event) => setDraft((current) => ({ ...current, order_index: Number(event.target.value) }))} />
          <FilePicker label="رفع صورة العميل" preview={draft.image_url} onChange={setDraftImageFile} buttonLabel={draftImageFile?.name || 'رفع صورة'} accept="image/*" />
          <MediaPicker label="اختيار صورة من المكتبة" media={media} selectedUrl={draft.image_url} onSelect={(item) => setDraft((current) => ({ ...current, image_url: item.filepath }))} />
          <TextArea label="المحتوى بالإنجليزية" className="md:col-span-2 xl:col-span-3" value={draft.content_en} onChange={(event) => setDraft((current) => ({ ...current, content_en: event.target.value }))} />
          <TextArea label="المحتوى بالعربية" className="md:col-span-2 xl:col-span-3" value={draft.content_ar} onChange={(event) => setDraft((current) => ({ ...current, content_ar: event.target.value }))} />
          <Toggle label="ظاهر" checked={!!draft.is_visible} onChange={(value) => setDraft((current) => ({ ...current, is_visible: value }))} />
          <Toggle label="معتمد" checked={!!draft.is_approved} onChange={(value) => setDraft((current) => ({ ...current, is_approved: value }))} />
          <Toggle label="مميز" checked={!!draft.is_featured} onChange={(value) => setDraft((current) => ({ ...current, is_featured: value }))} />
        </div>
      </SectionCard>

      <SectionCard title="آراء العملاء الحالية">
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="اسم العميل" value={testimonial.name || ''} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, name: event.target.value } : item)))} />
                <Field label="الموقع أو الدولة" value={testimonial.location || ''} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, location: event.target.value } : item)))} />
                <Select
                  label="الخدمة المرتبطة"
                  value={testimonial.service_id || ''}
                  onChange={(event) => {
                    const selected = services.find((service) => String(service.id) === event.target.value)
                    setTestimonials((current) =>
                      current.map((item) => (
                        item.id === testimonial.id
                          ? { ...item, service_id: selected?.id || null, service_type: selected?.type || '' }
                          : item
                      ))
                    )
                  }}
                >
                  <option value="">بدون خدمة</option>
                  {services.map((service) => <option key={service.id} value={service.id}>{serviceLabel(service)}</option>)}
                </Select>
                <Field label="رابط الفيديو" value={testimonial.video_url || ''} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, video_url: event.target.value } : item)))} />
                <Field label="التقييم" type="number" min="1" max="5" value={testimonial.rating || 5} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, rating: Number(event.target.value) } : item)))} />
                <Field label="الترتيب" type="number" value={testimonial.order_index || 0} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, order_index: Number(event.target.value) } : item)))} />
                <FilePicker label="رفع صورة العميل" preview={testimonial.image_url || ''} onChange={(file) => onUploadImage(testimonial, file)} buttonLabel="رفع صورة" accept="image/*" />
                <MediaPicker label="اختيار صورة من المكتبة" media={media} selectedUrl={testimonial.image_url || ''} onSelect={(item) => setTestimonials((current) => current.map((entry) => (entry.id === testimonial.id ? { ...entry, image_url: item.filepath } : entry)))} />
                <TextArea label="المحتوى بالإنجليزية" className="md:col-span-2 xl:col-span-3" value={testimonial.content_en || ''} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, content_en: event.target.value } : item)))} />
                <TextArea label="المحتوى بالعربية" className="md:col-span-2 xl:col-span-3" value={testimonial.content_ar || ''} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, content_ar: event.target.value } : item)))} />
                <Toggle label="ظاهر" checked={!!testimonial.is_visible} onChange={(value) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, is_visible: value } : item)))} />
                <Toggle label="معتمد" checked={!!testimonial.is_approved} onChange={(value) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, is_approved: value } : item)))} />
                <Toggle label="مميز" checked={!!testimonial.is_featured} onChange={(value) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, is_featured: value } : item)))} />
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <ActionButton onClick={() => onUpdate(testimonial)} className="bg-green-600 text-white">
                  {saving === `testimonial-${testimonial.id}` ? 'جاري الحفظ...' : 'حفظ'}
                </ActionButton>
                <ActionButton onClick={() => onDelete(testimonial.id)} className="bg-red-500/10 text-red-300">
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
