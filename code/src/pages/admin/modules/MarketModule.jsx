import { Trash2 } from 'lucide-react'
import { ActionButton, Field, FilePicker, MediaPicker, SectionCard, Select, TextArea, Toggle } from './shared/AdminUI'

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
  const categoryOptions = ['analysis', 'signal', 'news', 'gold', 'forex']

  return (
    <>
      <SectionCard
        title="Create market update"
        action={<ActionButton onClick={onCreate} className="w-full bg-green-600 text-white sm:w-auto">{saving === 'market-create' ? 'Saving...' : 'Create update'}</ActionButton>}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Title EN" value={draft.title_en} onChange={(event) => setDraft((current) => ({ ...current, title_en: event.target.value }))} />
          <Field label="Title AR" value={draft.title_ar} onChange={(event) => setDraft((current) => ({ ...current, title_ar: event.target.value }))} />
          <Select label="Category" value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}>
            {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
          </Select>
          <Field label="Author" value={draft.author_name} onChange={(event) => setDraft((current) => ({ ...current, author_name: event.target.value }))} />
          <Field label="Publish date" type="datetime-local" value={draft.published_at} onChange={(event) => setDraft((current) => ({ ...current, published_at: event.target.value }))} />
          <Field label="Sort order" type="number" value={draft.sort_order} onChange={(event) => setDraft((current) => ({ ...current, sort_order: Number(event.target.value) }))} />
          <FilePicker label="Image upload" preview={draft.image_url} onChange={setDraftImageFile} buttonLabel={draftImageFile?.name || 'Upload image'} />
          <MediaPicker label="Select image from library" media={media} selectedUrl={draft.image_url} onSelect={(item) => setDraft((current) => ({ ...current, image_url: item.filepath }))} />
          <TextArea label="Summary EN" className="md:col-span-2 xl:col-span-3" value={draft.summary_en} onChange={(event) => setDraft((current) => ({ ...current, summary_en: event.target.value }))} />
          <TextArea label="Summary AR" className="md:col-span-2 xl:col-span-3" value={draft.summary_ar} onChange={(event) => setDraft((current) => ({ ...current, summary_ar: event.target.value }))} />
          <TextArea label="Content EN" className="md:col-span-2 xl:col-span-3" value={draft.content_en} onChange={(event) => setDraft((current) => ({ ...current, content_en: event.target.value }))} />
          <TextArea label="Content AR" className="md:col-span-2 xl:col-span-3" value={draft.content_ar} onChange={(event) => setDraft((current) => ({ ...current, content_ar: event.target.value }))} />
          <Toggle label="Visible" checked={!!draft.is_visible} onChange={(value) => setDraft((current) => ({ ...current, is_visible: value }))} />
          <Toggle label="Featured" checked={!!draft.is_featured} onChange={(value) => setDraft((current) => ({ ...current, is_featured: value }))} />
          <Toggle label="Pinned" checked={!!draft.is_pinned} onChange={(value) => setDraft((current) => ({ ...current, is_pinned: value }))} />
        </div>
      </SectionCard>

      <SectionCard title="All market updates">
        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Title EN" value={update.title_en || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, title_en: event.target.value } : item)))} />
                <Field label="Title AR" value={update.title_ar || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, title_ar: event.target.value } : item)))} />
                <Select label="Category" value={update.category || 'analysis'} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, category: event.target.value } : item)))}>
                  {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
                </Select>
                <Field label="Author" value={update.author_name || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, author_name: event.target.value } : item)))} />
                <Field label="Publish date" type="datetime-local" value={update.published_at || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, published_at: event.target.value } : item)))} />
                <Field label="Sort order" type="number" value={update.sort_order || 0} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, sort_order: Number(event.target.value) } : item)))} />
                <FilePicker label="Image upload" preview={update.image_url || ''} onChange={(file) => onUploadImage(update, file)} buttonLabel="Upload image" />
                <MediaPicker label="Select image from library" media={media} selectedUrl={update.image_url || ''} onSelect={(item) => setUpdates((current) => current.map((entry) => (entry.id === update.id ? { ...entry, image_url: item.filepath } : entry)))} />
                <TextArea label="Summary EN" className="md:col-span-2 xl:col-span-3" value={update.summary_en || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, summary_en: event.target.value } : item)))} />
                <TextArea label="Summary AR" className="md:col-span-2 xl:col-span-3" value={update.summary_ar || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, summary_ar: event.target.value } : item)))} />
                <TextArea label="Content EN" className="md:col-span-2 xl:col-span-3" value={update.content_en || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, content_en: event.target.value } : item)))} />
                <TextArea label="Content AR" className="md:col-span-2 xl:col-span-3" value={update.content_ar || ''} onChange={(event) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, content_ar: event.target.value } : item)))} />
                <Toggle label="Visible" checked={!!update.is_visible} onChange={(value) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, is_visible: value } : item)))} />
                <Toggle label="Featured" checked={!!update.is_featured} onChange={(value) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, is_featured: value } : item)))} />
                <Toggle label="Pinned" checked={!!update.is_pinned} onChange={(value) => setUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, is_pinned: value } : item)))} />
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <ActionButton onClick={() => onUpdate(update)} className="bg-green-600 text-white">
                  {saving === `market-${update.id}` ? 'Saving...' : 'Save'}
                </ActionButton>
                <ActionButton onClick={() => onDelete(update.id)} className="bg-red-500/10 text-red-300">
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
