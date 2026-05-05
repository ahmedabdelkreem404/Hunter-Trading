export function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-sm sm:p-5">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-bold text-white sm:text-3xl">{value}</div>
    </div>
  )
}

export function SectionCard({ title, action, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <h2 className="text-base font-semibold text-white sm:text-lg">{title}</h2>
        {action ? <div className="w-full sm:w-auto">{action}</div> : null}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  )
}

function baseInputClassName() {
  return 'w-full min-w-0 rounded-xl border border-gray-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-hunter-green/60'
}

export function Field({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <input {...props} className={baseInputClassName()} />
    </label>
  )
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <select {...props} className={baseInputClassName()}>
        {children}
      </select>
    </label>
  )
}

export function TextArea({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <textarea {...props} className={`${baseInputClassName()} min-h-28`} />
    </label>
  )
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex flex-col gap-3 rounded-xl border border-gray-700 bg-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4" />
    </label>
  )
}

function isVideoUrl(url = '') {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url)
}

function isVideoMime(mimetype = '') {
  return String(mimetype).startsWith('video/')
}

export function MediaPreview({ src, alt, className = 'h-24 w-24' }) {
  if (!src) return null

  if (isVideoUrl(src)) {
    return (
      <video src={src} className={`${className} rounded-xl border border-gray-700 object-cover`} muted playsInline preload="metadata" />
    )
  }

  return <img src={src} alt={alt} className={`${className} rounded-xl border border-gray-700 object-cover`} />
}

export function FilePicker({ label, onChange, preview, buttonLabel = 'اختيار ملف', accept = 'image/*,video/mp4,video/webm,video/quicktime' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <div className="rounded-xl border border-dashed border-gray-700 bg-slate-800 p-4">
        {preview ? <MediaPreview src={preview} alt={label} className="mb-3 h-28 w-28" /> : null}
        <input type="file" accept={accept} onChange={(event) => onChange(event.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-300" />
        <div className="mt-2 text-xs text-slate-500">{buttonLabel}</div>
      </div>
    </label>
  )
}

export function MediaPicker({ label, media = [], onSelect, selectedUrl = '' }) {
  return (
    <div className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <div className="rounded-xl border border-gray-700 bg-slate-800 p-3">
        {selectedUrl ? <MediaPreview src={selectedUrl} alt={label} className="mb-3 h-24 w-24" /> : null}
        <div className="grid max-h-56 gap-3 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3">
          {media.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`overflow-hidden rounded-xl border text-right transition ${
                selectedUrl === item.filepath ? 'border-hunter-green bg-hunter-green/10' : 'border-white/10 bg-slate-900/70 hover:border-white/20'
              }`}
            >
              {isVideoMime(item.mimetype) || isVideoUrl(item.filepath) ? (
                <video src={item.filepath} className="h-20 w-full object-cover" muted playsInline preload="metadata" />
              ) : (
                <img src={item.filepath} alt={item.filename} className="h-20 w-full object-cover" />
              )}
              <div className="truncate px-3 py-2 text-xs text-slate-300">{item.filename}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ActionButton({ children, className = '', ...props }) {
  return (
    <button {...props} className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${className}`}>
      {children}
    </button>
  )
}
