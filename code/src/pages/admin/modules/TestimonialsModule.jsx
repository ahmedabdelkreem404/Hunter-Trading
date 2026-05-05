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
        title="Create testimonial"
        action={<ActionButton onClick={onCreate} className="w-full bg-green-600 text-white sm:w-auto">{saving === 'testimonial-create' ? 'Saving...' : 'Create testimonial'}</ActionButton>}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
          <Field label="Location" value={draft.location} onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))} />
          <Select
            label="Related service"
            value={draft.service_id || ''}
            onChange={(event) => {
              const selected = services.find((service) => String(service.id) === event.target.value)
              setDraft((current) => ({ ...current, service_id: selected?.id || null, service_type: selected?.type || '' }))
            }}
          >
            <option value="">None</option>
            {services.map((service) => <option key={service.id} value={service.id}>{serviceLabel(service)}</option>)}
          </Select>
          <Field label="Video URL" value={draft.video_url} onChange={(event) => setDraft((current) => ({ ...current, video_url: event.target.value }))} />
          <Field label="Rating" type="number" min="1" max="5" value={draft.rating} onChange={(event) => setDraft((current) => ({ ...current, rating: Number(event.target.value) }))} />
          <Field label="Sort order" type="number" value={draft.order_index || 0} onChange={(event) => setDraft((current) => ({ ...current, order_index: Number(event.target.value) }))} />
          <FilePicker label="Avatar upload" preview={draft.image_url} onChange={setDraftImageFile} buttonLabel={draftImageFile?.name || 'Upload image'} accept="image/*" />
          <MediaPicker label="Select avatar from library" media={media} selectedUrl={draft.image_url} onSelect={(item) => setDraft((current) => ({ ...current, image_url: item.filepath }))} />
          <TextArea label="Content EN" className="md:col-span-2 xl:col-span-3" value={draft.content_en} onChange={(event) => setDraft((current) => ({ ...current, content_en: event.target.value }))} />
          <TextArea label="Content AR" className="md:col-span-2 xl:col-span-3" value={draft.content_ar} onChange={(event) => setDraft((current) => ({ ...current, content_ar: event.target.value }))} />
          <Toggle label="Visible" checked={!!draft.is_visible} onChange={(value) => setDraft((current) => ({ ...current, is_visible: value }))} />
          <Toggle label="Approved" checked={!!draft.is_approved} onChange={(value) => setDraft((current) => ({ ...current, is_approved: value }))} />
          <Toggle label="Featured" checked={!!draft.is_featured} onChange={(value) => setDraft((current) => ({ ...current, is_featured: value }))} />
        </div>
      </SectionCard>

      <SectionCard title="All testimonials">
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Name" value={testimonial.name || ''} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, name: event.target.value } : item)))} />
                <Field label="Location" value={testimonial.location || ''} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, location: event.target.value } : item)))} />
                <Select
                  label="Related service"
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
                  <option value="">None</option>
                  {services.map((service) => <option key={service.id} value={service.id}>{serviceLabel(service)}</option>)}
                </Select>
                <Field label="Video URL" value={testimonial.video_url || ''} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, video_url: event.target.value } : item)))} />
                <Field label="Rating" type="number" min="1" max="5" value={testimonial.rating || 5} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, rating: Number(event.target.value) } : item)))} />
                <Field label="Sort order" type="number" value={testimonial.order_index || 0} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, order_index: Number(event.target.value) } : item)))} />
                <FilePicker label="Avatar upload" preview={testimonial.image_url || ''} onChange={(file) => onUploadImage(testimonial, file)} buttonLabel="Upload image" accept="image/*" />
                <MediaPicker label="Select avatar from library" media={media} selectedUrl={testimonial.image_url || ''} onSelect={(item) => setTestimonials((current) => current.map((entry) => (entry.id === testimonial.id ? { ...entry, image_url: item.filepath } : entry)))} />
                <TextArea label="Content EN" className="md:col-span-2 xl:col-span-3" value={testimonial.content_en || ''} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, content_en: event.target.value } : item)))} />
                <TextArea label="Content AR" className="md:col-span-2 xl:col-span-3" value={testimonial.content_ar || ''} onChange={(event) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, content_ar: event.target.value } : item)))} />
                <Toggle label="Visible" checked={!!testimonial.is_visible} onChange={(value) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, is_visible: value } : item)))} />
                <Toggle label="Approved" checked={!!testimonial.is_approved} onChange={(value) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, is_approved: value } : item)))} />
                <Toggle label="Featured" checked={!!testimonial.is_featured} onChange={(value) => setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, is_featured: value } : item)))} />
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <ActionButton onClick={() => onUpdate(testimonial)} className="bg-green-600 text-white">
                  {saving === `testimonial-${testimonial.id}` ? 'Saving...' : 'Save'}
                </ActionButton>
                <ActionButton onClick={() => onDelete(testimonial.id)} className="bg-red-500/10 text-red-300">
                  <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> Delete</span>
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}
