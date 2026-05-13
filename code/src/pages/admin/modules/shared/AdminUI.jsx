import { createContext, useContext, useEffect, useState } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import { getEmbedUrl, isDirectVideoUrl } from '../../../../utils/media'

const AdminFieldLanguageContext = createContext('all')

export function confirmDelete(message = 'هل تريد حذف هذا العنصر؟') {
  if (typeof window === 'undefined') return Promise.resolve(false)

  if (typeof window.__hunterAdminConfirmDelete === 'function') {
    return window.__hunterAdminConfirmDelete({ message })
  }

  return Promise.resolve(window.confirm(`${message}\nهذا الإجراء لا يمكن التراجع عنه.`))
}

export function DeleteConfirmDialog() {
  const [dialog, setDialog] = useState(null)

  useEffect(() => {
    const previousHandler = window.__hunterAdminConfirmDelete
    window.__hunterAdminConfirmDelete = ({
      message = 'هل تريد حذف هذا العنصر؟',
      description = 'هذا الإجراء لا يمكن التراجع عنه.',
      confirmLabel = 'نعم، احذف',
      cancelLabel = 'إلغاء',
    } = {}) =>
      new Promise((resolve) => {
        setDialog({ message, description, confirmLabel, cancelLabel, resolve })
      })

    return () => {
      window.__hunterAdminConfirmDelete = previousHandler
    }
  }, [])

  useEffect(() => {
    if (!dialog) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        dialog.resolve(false)
        setDialog(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dialog])

  if (!dialog) return null

  const close = (confirmed) => {
    dialog.resolve(confirmed)
    setDialog(null)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-red-400/25 bg-slate-950 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-4 border-b border-white/10 bg-red-500/10 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-300/25 bg-red-500/15 text-red-200 shadow-lg shadow-red-500/10">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black text-white">تأكيد الحذف</h2>
            <p className="mt-1 text-sm leading-6 text-slate-300">{dialog.message}</p>
          </div>
          <button
            type="button"
            onClick={() => close(false)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.08] p-4 text-sm leading-7 text-red-100">
            {dialog.description}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => close(true)}
              className="admin-action-button bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-400"
            >
              <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> {dialog.confirmLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => close(false)}
              className="admin-action-button border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
            >
              {dialog.cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminFieldLanguageProvider({ mode = 'all', children }) {
  return (
    <AdminFieldLanguageContext.Provider value={mode}>
      {children}
    </AdminFieldLanguageContext.Provider>
  )
}

function shouldHideByLanguage(label, mode) {
  if (mode !== 'arabic') return false
  if (typeof label !== 'string') return false
  return label.includes('بالإنجليزية') || label.includes('إنجليزية') || label.includes('English')
}

export function StatCard({ label, value }) {
  return (
    <div className="admin-panel rounded-2xl p-4 shadow-sm sm:p-5">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-bold text-white sm:text-3xl">{value}</div>
    </div>
  )
}

export function SectionCard({ title, action, children }) {
  return (
    <div className="admin-panel overflow-hidden rounded-3xl shadow-sm">
      <div className="admin-panel-header flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <h2 className="text-base font-bold text-white sm:text-lg">{title}</h2>
        {action ? <div className="w-full sm:w-auto">{action}</div> : null}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  )
}

export function AdminBlock({ title, description, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-cyan-300/20 hover:bg-slate-950/60 ${className}`}>
      {title || description ? (
        <div className="mb-4">
          {title ? <h3 className="text-sm font-black text-white">{title}</h3> : null}
          {description ? <p className="mt-1 text-xs leading-6 text-slate-400">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export function EmptyState({ title = 'لا توجد بيانات', description = 'ستظهر البيانات هنا بعد إضافتها من لوحة التحكم.' }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/45 p-6 text-center">
      <div className="text-sm font-bold text-white">{title}</div>
      <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
    </div>
  )
}

function baseInputClassName() {
  return 'admin-input'
}

export function Field({ label, className = '', ...props }) {
  const languageMode = useContext(AdminFieldLanguageContext)
  if (shouldHideByLanguage(label, languageMode)) return null

  return (
    <label className={`block ${className}`}>
      <span className="admin-label">{label}</span>
      <input {...props} className={baseInputClassName()} />
    </label>
  )
}

export function Select({ label, children, className = '', ...props }) {
  const languageMode = useContext(AdminFieldLanguageContext)
  if (shouldHideByLanguage(label, languageMode)) return null

  return (
    <label className={`block ${className}`}>
      <span className="admin-label">{label}</span>
      <select {...props} className={baseInputClassName()}>
        {children}
      </select>
    </label>
  )
}

export function TextArea({ label, className = '', ...props }) {
  const languageMode = useContext(AdminFieldLanguageContext)
  if (shouldHideByLanguage(label, languageMode)) return null

  return (
    <label className={`block ${className}`}>
      <span className="admin-label">{label}</span>
      <textarea {...props} className={`${baseInputClassName()} min-h-24 resize-y`} />
    </label>
  )
}

export function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      className={`admin-toggle ${checked ? 'admin-toggle-on' : 'admin-toggle-off'}`}
      onClick={(event) => {
        event.preventDefault()
        onChange(!checked)
      }}
    >
      <span className="admin-toggle-label">{label}</span>
      <span className={`admin-toggle-track ${checked ? 'admin-toggle-track-on' : ''}`}>
        <span className="admin-toggle-thumb" />
      </span>
    </button>
  )
}

function isVideoMime(mimetype = '') {
  return String(mimetype).startsWith('video/')
}

export function MediaPreview({ src, alt, className = 'h-24 w-24' }) {
  if (!src) return null

  if (isDirectVideoUrl(src)) {
    return (
      <video src={src} className={`${className} rounded-xl border border-gray-700 object-cover`} muted playsInline preload="metadata" />
    )
  }

  const embedUrl = getEmbedUrl(src)
  if (embedUrl) {
    return <iframe src={embedUrl} title={alt} className={`${className} rounded-xl border border-gray-700`} loading="lazy" allowFullScreen />
  }

  return <img src={src} alt={alt} className={`${className} rounded-xl border border-gray-700 object-cover`} />
}

export function FilePicker({ label, onChange, preview, buttonLabel = 'اختيار ملف', accept = 'image/*,video/mp4,video/webm,video/quicktime' }) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      <div className="admin-file-picker rounded-2xl p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80">
            {preview ? (
              <MediaPreview src={preview} alt={label} className="h-full w-full" />
            ) : (
              <span className="text-xs font-bold text-slate-500">Media</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold leading-5 text-white">{buttonLabel}</div>
            <p className="text-[11px] leading-5 text-slate-400">اختر ملف من جهازك، ثم اضغط حفظ أو رفع حسب السكشن.</p>
          </div>
          <span className="admin-action-button shrink-0 cursor-pointer border border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15">
            اختيار ملف
          </span>
        </div>
        <input type="file" accept={accept} onChange={(event) => onChange(event.target.files?.[0] ?? null)} className="sr-only" />
      </div>
    </label>
  )
}

export function MediaPicker({ label, media = [], onSelect, selectedUrl = '', onUpload, accept = 'image/*,video/mp4,video/webm,video/quicktime', uploadLabel = 'رفع من الجهاز' }) {
  return (
    <div className="block">
      <span className="admin-label">{label}</span>
      {onUpload ? (
        <label className="admin-action-button mb-2 w-full cursor-pointer border border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15">
          {uploadLabel}
          <input type="file" accept={accept} onChange={(event) => onUpload(event.target.files?.[0] ?? null)} className="sr-only" />
        </label>
      ) : null}
      <details className="rounded-2xl border border-slate-700/70 bg-slate-950/50 transition hover:border-cyan-300/30 hover:bg-slate-900/80">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
          <span className="text-sm font-bold text-slate-100">اختيار من مكتبة الوسائط</span>
          <span className="text-xs text-slate-500">{media.length} ملف</span>
        </summary>
        <div className="border-t border-white/10 p-3">
          {selectedUrl ? <MediaPreview src={selectedUrl} alt={label} className="mb-3 h-20 w-20" /> : null}
          {media.length ? (
            <div className="grid max-h-56 grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
              {media.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className={`overflow-hidden rounded-xl border text-right transition ${
                    selectedUrl === item.filepath ? 'border-cyan-300 bg-cyan-300/10 ring-2 ring-cyan-300/15' : 'border-white/10 bg-slate-900/70 hover:border-cyan-300/40'
                  }`}
                >
                  {isVideoMime(item.mimetype) || isDirectVideoUrl(item.filepath) ? (
                    <video src={item.filepath} className="h-16 w-full object-cover" muted playsInline preload="metadata" />
                  ) : (
                    <img src={item.filepath} alt={item.filename} className="h-16 w-full object-cover" />
                  )}
                  <div className="truncate px-2 py-1.5 text-[11px] font-bold text-slate-300">{item.filename}</div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState title="المكتبة فارغة" description="ارفع ملفات من تبويب مكتبة الوسائط أولاً." />
          )}
        </div>
      </details>
    </div>
  )
}

export function ActionButton({ children, className = '', type = 'button', ...props }) {
  return (
    <button type={type} {...props} className={`admin-action-button ${className}`}>
      {children}
    </button>
  )
}
