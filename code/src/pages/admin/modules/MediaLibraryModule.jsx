import { Copy, Trash2 } from 'lucide-react'
import { ActionButton, FilePicker, MediaPreview, SectionCard } from './shared/AdminUI'

export default function MediaLibraryModule({ media, uploadFile, setUploadFile, onUpload, onDelete, saving }) {
  return (
    <>
      <SectionCard
        title="Upload media"
        action={
          <ActionButton onClick={onUpload} className="w-full bg-green-600 text-white sm:w-auto">
            {saving === 'media-upload' ? 'Uploading...' : 'Upload file'}
          </ActionButton>
        }
      >
        <FilePicker
          label="Choose file"
          preview=""
          onChange={setUploadFile}
          buttonLabel={uploadFile?.name || 'Choose a new image or video'}
        />
      </SectionCard>

      <SectionCard title="Media library">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
              <MediaPreview src={item.filepath} alt={item.filename} className="mb-3 h-44 w-full" />
              <div className="truncate text-sm text-white">{item.filename}</div>
              <div className="mt-1 text-xs text-slate-500">{item.created_at}</div>
              <div className="mt-3 flex gap-2">
                <ActionButton onClick={() => navigator.clipboard.writeText(item.filepath)} className="flex-1 bg-white/5 text-slate-200">
                  <span className="inline-flex items-center gap-2"><Copy className="h-4 w-4" /> Copy</span>
                </ActionButton>
                <ActionButton onClick={() => onDelete(item.id)} className="bg-red-500/10 text-red-300">
                  <Trash2 className="h-4 w-4" />
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}
