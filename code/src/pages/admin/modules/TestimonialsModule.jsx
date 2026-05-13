import { Trash2 } from 'lucide-react'
import { ActionButton, AdminBlock, Field, FilePicker, MediaPicker, SectionCard, Select, TextArea, Toggle } from './shared/AdminUI'

function serviceLabel(service) {
  return service.title_ar || service.title_en || `#${service.id}`
}

function TestimonialForm({ value, onChange, imageFile, onImageFileChange, services, media }) {
  const setField = (field, nextValue) => onChange({ ...value, [field]: nextValue })

  return (
    <div className="space-y-4">
      <AdminBlock title="بيانات العميل" description="بيانات مختصرة تظهر في كارت رأي العميل.">
        <div className="grid gap-4 lg:grid-cols-3">
          <Field label="اسم العميل" value={value.name || ''} onChange={(event) => setField('name', event.target.value)} />
          <Field label="الموقع أو الدولة" value={value.location || ''} onChange={(event) => setField('location', event.target.value)} />
          <Select
            label="الخدمة المرتبطة"
            value={value.service_id || ''}
            onChange={(event) => {
              const selected = services.find((service) => String(service.id) === event.target.value)
              onChange({ ...value, service_id: selected?.id || null, service_type: selected?.type || '' })
            }}
          >
            <option value="">بدون خدمة</option>
            {services.map((service) => <option key={service.id} value={service.id}>{serviceLabel(service)}</option>)}
          </Select>
          <Field label="رابط الفيديو" value={value.video_url || ''} onChange={(event) => setField('video_url', event.target.value)} />
          <Field label="التقييم" type="number" min="1" max="5" value={value.rating || 5} onChange={(event) => setField('rating', Number(event.target.value))} />
          <Field label="الترتيب" type="number" value={value.order_index || 0} onChange={(event) => setField('order_index', Number(event.target.value))} />
        </div>
      </AdminBlock>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <AdminBlock title="محتوى الرأي" description="اكتب رأي العميل بالعربية. النص الإنجليزي من تبويب الترجمات.">
          <div className="grid gap-4">
            <TextArea label="المحتوى بالإنجليزية" value={value.content_en || ''} onChange={(event) => setField('content_en', event.target.value)} />
            <TextArea label="المحتوى بالعربية" value={value.content_ar || ''} onChange={(event) => setField('content_ar', event.target.value)} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Toggle label="ظاهر" checked={!!value.is_visible} onChange={(nextValue) => setField('is_visible', nextValue)} />
            <Toggle label="معتمد" checked={!!value.is_approved} onChange={(nextValue) => setField('is_approved', nextValue)} />
            <Toggle label="مميز" checked={!!value.is_featured} onChange={(nextValue) => setField('is_featured', nextValue)} />
          </div>
        </AdminBlock>

        <AdminBlock title="صورة العميل" description="اختار صورة خفيفة وواضحة، أو استخدم صورة من المكتبة.">
          <div className="space-y-4">
            <FilePicker label="رفع صورة العميل" preview={value.image_url || ''} onChange={onImageFileChange} buttonLabel={imageFile?.name || 'اختيار صورة العميل'} accept="image/*" />
            <MediaPicker label="اختيار صورة من المكتبة" media={media} selectedUrl={value.image_url || ''} onSelect={(item) => setField('image_url', item.filepath)} />
          </div>
        </AdminBlock>
      </div>
    </div>
  )
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
        <TestimonialForm value={draft} onChange={setDraft} imageFile={draftImageFile} onImageFileChange={setDraftImageFile} services={services} media={media} />
      </SectionCard>

      <SectionCard title="آراء العملاء الحالية">
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <TestimonialForm
                value={testimonial}
                onChange={(nextTestimonial) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? nextTestimonial : item)))}
                imageFile={null}
                onImageFileChange={(file) => onUploadImage(testimonial, file)}
                services={services}
                media={media}
              />
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
