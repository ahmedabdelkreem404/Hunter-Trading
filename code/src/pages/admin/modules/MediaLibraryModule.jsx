import { Copy, Trash2 } from 'lucide-react'
import { ActionButton, EmptyState, FilePicker, MediaPreview, SectionCard } from './shared/AdminUI'

export default function MediaLibraryModule({ media, uploadFile, setUploadFile, onUpload, onDelete, saving }) {
  return (
    <>
      <SectionCard
        title="رفع ملف جديد"
        action={
          <ActionButton onClick={onUpload} className="w-full bg-green-600 text-white sm:w-auto">
            {saving === 'media-upload' ? 'جاري الرفع...' : 'رفع الملف'}
          </ActionButton>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
          <FilePicker
            label="اختيار صورة أو فيديو"
            preview=""
            onChange={setUploadFile}
            buttonLabel={uploadFile?.name || 'اختيار ملف من الجهاز'}
          />
          <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm leading-7 text-cyan-50">
            ارفع الصور والفيديوهات مرة واحدة من هنا، وبعدها اختارها داخل الخدمات والسكشنات من مكتبة الوسائط.
          </div>
        </div>
      </SectionCard>

      <SectionCard title="مكتبة الوسائط">
        {media.length === 0 ? (
          <EmptyState title="مكتبة الوسائط فارغة" description="ابدأ برفع صور الخدمات أو فيديوهات العروض من الأعلى." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {media.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-3 transition hover:border-cyan-300/25 hover:bg-slate-950/65">
                <MediaPreview src={item.filepath} alt={item.filename} className="mb-3 aspect-[16/10] h-auto w-full" />
                <div className="truncate text-sm font-bold text-white">{item.filename}</div>
                <div className="mt-1 text-xs text-slate-500">{item.created_at}</div>
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <ActionButton onClick={() => navigator.clipboard.writeText(item.filepath)} className="bg-white/5 text-slate-200">
                    <span className="inline-flex items-center gap-2"><Copy className="h-4 w-4" /> نسخ</span>
                  </ActionButton>
                  <ActionButton onClick={() => onDelete(item.id)} className="bg-red-500/10 text-red-300 hover:bg-red-500/15" aria-label="حذف الملف">
                    <Trash2 className="h-4 w-4" />
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </>
  )
}
