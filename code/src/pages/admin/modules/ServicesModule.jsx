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
          <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Add</span>
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
              <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> Remove</span>
            </ActionButton>
          </div>
        </div>
      ))}
    </div>
  )
}

function updateListItem(list, index, changes) {
  return (list || []).map((item, currentIndex) => (currentIndex === index ? { ...item, ...changes } : item))
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
    ['funded', 'Funded Accounts'],
    ['vip', 'VIP'],
    ['scalp', 'Scalp'],
    ['courses', 'Courses'],
    ['offers', 'Offers'],
  ]

  return (
    <>
      <SectionCard
        title="Create service or product"
        action={
          <ActionButton onClick={onCreate} className="w-full bg-green-600 text-white sm:w-auto">
            {saving === 'service-create' ? 'Saving...' : 'Create service'}
          </ActionButton>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Select label="Type" value={serviceDraft.type} onChange={(event) => setServiceDraft((current) => ({ ...current, type: event.target.value }))}>
            {typeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
          <Field label="Slug" value={serviceDraft.slug} onChange={(event) => setServiceDraft((current) => ({ ...current, slug: event.target.value }))} />
          <Field label="Sort order" type="number" value={serviceDraft.sort_order} onChange={(event) => setServiceDraft((current) => ({ ...current, sort_order: Number(event.target.value) }))} />
          <Field label="Title EN" value={serviceDraft.title_en} onChange={(event) => setServiceDraft((current) => ({ ...current, title_en: event.target.value }))} />
          <Field label="Title AR" value={serviceDraft.title_ar} onChange={(event) => setServiceDraft((current) => ({ ...current, title_ar: event.target.value }))} />
          <Field label="Price" type="number" value={serviceDraft.price} onChange={(event) => setServiceDraft((current) => ({ ...current, price: Number(event.target.value) }))} />
          <Field label="Compare price" type="number" value={serviceDraft.compare_price} onChange={(event) => setServiceDraft((current) => ({ ...current, compare_price: event.target.value }))} />
          <Field label="Badge EN" value={serviceDraft.badge_text_en} onChange={(event) => setServiceDraft((current) => ({ ...current, badge_text_en: event.target.value }))} />
          <Field label="Badge AR" value={serviceDraft.badge_text_ar} onChange={(event) => setServiceDraft((current) => ({ ...current, badge_text_ar: event.target.value }))} />
          <Field label="CTA label EN" value={serviceDraft.cta_label_en} onChange={(event) => setServiceDraft((current) => ({ ...current, cta_label_en: event.target.value }))} />
          <Field label="CTA label AR" value={serviceDraft.cta_label_ar} onChange={(event) => setServiceDraft((current) => ({ ...current, cta_label_ar: event.target.value }))} />
          <Field label="CTA link / redirect" className="md:col-span-2 xl:col-span-3" value={serviceDraft.cta_url} onChange={(event) => setServiceDraft((current) => ({ ...current, cta_url: event.target.value }))} />
          <Field label="Offer starts at" type="datetime-local" value={serviceDraft.offer_starts_at || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, offer_starts_at: event.target.value }))} />
          <Field label="Offer ends at" type="datetime-local" value={serviceDraft.offer_ends_at || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, offer_ends_at: event.target.value }))} />
          <FilePicker label="Thumbnail upload" preview={serviceDraft.thumbnail_url} onChange={setServiceImageFile} buttonLabel={serviceImageFile?.name || 'Upload new image'} />
          <MediaPicker label="Select thumbnail from library" media={media} selectedUrl={serviceDraft.thumbnail_url} onSelect={(item) => setServiceDraft((current) => ({ ...current, thumbnail_url: item.filepath, cover_url: item.filepath }))} />
          <TextArea label="Short description EN" className="md:col-span-2 xl:col-span-3" value={serviceDraft.short_description_en} onChange={(event) => setServiceDraft((current) => ({ ...current, short_description_en: event.target.value }))} />
          <TextArea label="Short description AR" className="md:col-span-2 xl:col-span-3" value={serviceDraft.short_description_ar} onChange={(event) => setServiceDraft((current) => ({ ...current, short_description_ar: event.target.value }))} />
          <TextArea label="Full description EN" className="md:col-span-2 xl:col-span-3" value={serviceDraft.full_description_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, full_description_en: event.target.value }))} />
          <TextArea label="Full description AR" className="md:col-span-2 xl:col-span-3" value={serviceDraft.full_description_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, full_description_ar: event.target.value }))} />
          <Toggle label="Visible" checked={!!serviceDraft.is_visible} onChange={(value) => setServiceDraft((current) => ({ ...current, is_visible: value }))} />
          <Toggle label="Featured" checked={!!serviceDraft.is_featured} onChange={(value) => setServiceDraft((current) => ({ ...current, is_featured: value }))} />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <RelationEditor
            title="Features"
            items={serviceDraft.features}
            onChange={(items) => setServiceDraft((current) => ({ ...current, features: items }))}
            factory={newFeature}
            renderRow={(item, index) => (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={`Feature ${index + 1} EN`} value={item.label_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, features: updateListItem(current.features, index, { label_en: event.target.value }) }))} />
                <Field label={`Feature ${index + 1} AR`} value={item.label_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, features: updateListItem(current.features, index, { label_ar: event.target.value }) }))} />
              </div>
            )}
          />

          <RelationEditor
            title="Steps"
            items={serviceDraft.steps}
            onChange={(items) => setServiceDraft((current) => ({ ...current, steps: items }))}
            factory={newStep}
            renderRow={(item, index) => (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={`Step ${index + 1} title EN`} value={item.title_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, steps: updateListItem(current.steps, index, { title_en: event.target.value }) }))} />
                <Field label={`Step ${index + 1} title AR`} value={item.title_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, steps: updateListItem(current.steps, index, { title_ar: event.target.value }) }))} />
                <TextArea label="Description EN" className="md:col-span-2" value={item.description_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, steps: updateListItem(current.steps, index, { description_en: event.target.value }) }))} />
                <TextArea label="Description AR" className="md:col-span-2" value={item.description_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, steps: updateListItem(current.steps, index, { description_ar: event.target.value }) }))} />
              </div>
            )}
          />

          <RelationEditor
            title="FAQs"
            items={serviceDraft.faqs}
            onChange={(items) => setServiceDraft((current) => ({ ...current, faqs: items }))}
            factory={newFaq}
            renderRow={(item, index) => (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={`Question ${index + 1} EN`} value={item.question_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, faqs: updateListItem(current.faqs, index, { question_en: event.target.value }) }))} />
                <Field label={`Question ${index + 1} AR`} value={item.question_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, faqs: updateListItem(current.faqs, index, { question_ar: event.target.value }) }))} />
                <TextArea label="Answer EN" className="md:col-span-2" value={item.answer_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, faqs: updateListItem(current.faqs, index, { answer_en: event.target.value }) }))} />
                <TextArea label="Answer AR" className="md:col-span-2" value={item.answer_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, faqs: updateListItem(current.faqs, index, { answer_ar: event.target.value }) }))} />
              </div>
            )}
          />

          <RelationEditor
            title="Gallery media"
            items={serviceDraft.media}
            onChange={(items) => setServiceDraft((current) => ({ ...current, media: items }))}
            factory={newMedia}
            renderRow={(item, index) => (
              <div className="space-y-4">
                <MediaPicker
                  label="Pick existing media"
                  media={media}
                  selectedUrl={item.media_url || ''}
                  onSelect={(selected) => setServiceDraft((current) => ({ ...current, media: updateListItem(current.media, index, { media_url: selected.filepath, media_type: 'image' }) }))}
                />
                <Field label="Media URL" value={item.media_url || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, media: updateListItem(current.media, index, { media_url: event.target.value }) }))} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Alt text EN" value={item.alt_text_en || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, media: updateListItem(current.media, index, { alt_text_en: event.target.value }) }))} />
                  <Field label="Alt text AR" value={item.alt_text_ar || ''} onChange={(event) => setServiceDraft((current) => ({ ...current, media: updateListItem(current.media, index, { alt_text_ar: event.target.value }) }))} />
                </div>
              </div>
            )}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="All services"
        action={
          <Select label="Filter type" value={filterType} onChange={(event) => setFilterType(event.target.value)}>
            <option value="all">All</option>
            {typeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        }
      >
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <div key={service.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Select label="Type" value={service.type} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, type: event.target.value } : item)))}>
                  {typeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </Select>
                <Field label="Slug" value={service.slug || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, slug: event.target.value } : item)))} />
                <Field label="Sort order" type="number" value={service.sort_order || 0} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, sort_order: Number(event.target.value) } : item)))} />
                <Field label="Title EN" value={service.title_en || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, title_en: event.target.value } : item)))} />
                <Field label="Title AR" value={service.title_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, title_ar: event.target.value } : item)))} />
                <Field label="Price" type="number" value={service.price || 0} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, price: Number(event.target.value) } : item)))} />
                <Field label="Compare price" type="number" value={service.compare_price || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, compare_price: event.target.value } : item)))} />
                <Field label="Badge EN" value={service.badge_text_en || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, badge_text_en: event.target.value } : item)))} />
                <Field label="Badge AR" value={service.badge_text_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, badge_text_ar: event.target.value } : item)))} />
                <Field label="CTA label EN" value={service.cta_label_en || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, cta_label_en: event.target.value } : item)))} />
                <Field label="CTA label AR" value={service.cta_label_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, cta_label_ar: event.target.value } : item)))} />
                <Field label="CTA link / redirect" className="md:col-span-2 xl:col-span-3" value={service.cta_url || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, cta_url: event.target.value } : item)))} />
                <Field label="Offer starts at" type="datetime-local" value={service.offer_starts_at || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, offer_starts_at: event.target.value } : item)))} />
                <Field label="Offer ends at" type="datetime-local" value={service.offer_ends_at || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, offer_ends_at: event.target.value } : item)))} />
                <FilePicker label="Thumbnail upload" preview={service.thumbnail_url || service.cover_url || ''} onChange={(file) => onUploadImage(service, file)} buttonLabel="Upload image" />
                <MediaPicker label="Select thumbnail from library" media={media} selectedUrl={service.thumbnail_url || service.cover_url || ''} onSelect={(item) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, thumbnail_url: item.filepath, cover_url: item.filepath } : entry)))} />
                <TextArea label="Short description EN" className="md:col-span-2 xl:col-span-3" value={service.short_description_en || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, short_description_en: event.target.value } : item)))} />
                <TextArea label="Short description AR" className="md:col-span-2 xl:col-span-3" value={service.short_description_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, short_description_ar: event.target.value } : item)))} />
                <TextArea label="Full description EN" className="md:col-span-2 xl:col-span-3" value={service.full_description_en || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, full_description_en: event.target.value } : item)))} />
                <TextArea label="Full description AR" className="md:col-span-2 xl:col-span-3" value={service.full_description_ar || ''} onChange={(event) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, full_description_ar: event.target.value } : item)))} />
                <Toggle label="Visible" checked={!!service.is_visible} onChange={(value) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, is_visible: value } : item)))} />
                <Toggle label="Featured" checked={!!service.is_featured} onChange={(value) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, is_featured: value } : item)))} />
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                <RelationEditor
                  title="Features"
                  items={service.features}
                  onChange={(items) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, features: items } : item)))}
                  factory={newFeature}
                  renderRow={(item, index) => (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={`Feature ${index + 1} EN`} value={item.label_en || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, features: updateListItem(entry.features, index, { label_en: event.target.value }) } : entry)))} />
                      <Field label={`Feature ${index + 1} AR`} value={item.label_ar || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, features: updateListItem(entry.features, index, { label_ar: event.target.value }) } : entry)))} />
                    </div>
                  )}
                />

                <RelationEditor
                  title="Steps"
                  items={service.steps}
                  onChange={(items) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, steps: items } : item)))}
                  factory={newStep}
                  renderRow={(item, index) => (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={`Step ${index + 1} title EN`} value={item.title_en || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, steps: updateListItem(entry.steps, index, { title_en: event.target.value }) } : entry)))} />
                      <Field label={`Step ${index + 1} title AR`} value={item.title_ar || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, steps: updateListItem(entry.steps, index, { title_ar: event.target.value }) } : entry)))} />
                      <TextArea label="Description EN" className="md:col-span-2" value={item.description_en || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, steps: updateListItem(entry.steps, index, { description_en: event.target.value }) } : entry)))} />
                      <TextArea label="Description AR" className="md:col-span-2" value={item.description_ar || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, steps: updateListItem(entry.steps, index, { description_ar: event.target.value }) } : entry)))} />
                    </div>
                  )}
                />

                <RelationEditor
                  title="FAQs"
                  items={service.faqs}
                  onChange={(items) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, faqs: items } : item)))}
                  factory={newFaq}
                  renderRow={(item, index) => (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={`Question ${index + 1} EN`} value={item.question_en || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, faqs: updateListItem(entry.faqs, index, { question_en: event.target.value }) } : entry)))} />
                      <Field label={`Question ${index + 1} AR`} value={item.question_ar || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, faqs: updateListItem(entry.faqs, index, { question_ar: event.target.value }) } : entry)))} />
                      <TextArea label="Answer EN" className="md:col-span-2" value={item.answer_en || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, faqs: updateListItem(entry.faqs, index, { answer_en: event.target.value }) } : entry)))} />
                      <TextArea label="Answer AR" className="md:col-span-2" value={item.answer_ar || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, faqs: updateListItem(entry.faqs, index, { answer_ar: event.target.value }) } : entry)))} />
                    </div>
                  )}
                />

                <RelationEditor
                  title="Gallery media"
                  items={service.media}
                  onChange={(items) => setServices((current) => current.map((item) => (item.id === service.id ? { ...item, media: items } : item)))}
                  factory={newMedia}
                  renderRow={(item, index) => (
                    <div className="space-y-4">
                      <MediaPicker
                        label="Pick existing media"
                        media={media}
                        selectedUrl={item.media_url || ''}
                        onSelect={(selected) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, media: updateListItem(entry.media, index, { media_url: selected.filepath, media_type: 'image' }) } : entry)))}
                      />
                      <Field label="Media URL" value={item.media_url || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, media: updateListItem(entry.media, index, { media_url: event.target.value }) } : entry)))} />
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Alt text EN" value={item.alt_text_en || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, media: updateListItem(entry.media, index, { alt_text_en: event.target.value }) } : entry)))} />
                        <Field label="Alt text AR" value={item.alt_text_ar || ''} onChange={(event) => setServices((current) => current.map((entry) => (entry.id === service.id ? { ...entry, media: updateListItem(entry.media, index, { alt_text_ar: event.target.value }) } : entry)))} />
                      </div>
                    </div>
                  )}
                />
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <ActionButton onClick={() => onUpdate(service)} className="bg-green-600 text-white">
                  {saving === `service-${service.id}` ? 'Saving...' : 'Save'}
                </ActionButton>
                <ActionButton onClick={() => onDelete(service.id)} className="bg-red-500/10 text-red-300">
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
