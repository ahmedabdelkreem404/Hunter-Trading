import { Trash2 } from 'lucide-react'
import { ActionButton, Field, FilePicker, SectionCard, Select, TextArea, Toggle } from './shared/AdminUI'

export default function CoachSocialModule({
  coach,
  setCoach,
  coachImageFile,
  setCoachImageFile,
  socialLinks,
  setSocialLinks,
  socialDraft,
  setSocialDraft,
  onSaveCoach,
  onCreateSocial,
  onUpdateSocial,
  onDeleteSocial,
  saving,
}) {
  return (
    <>
      <SectionCard
        title="المدرب"
        action={<ActionButton onClick={onSaveCoach} className="w-full bg-green-600 text-white sm:w-auto">{saving === 'coach-save' ? 'جارٍ الحفظ...' : 'حفظ بيانات المدرب'}</ActionButton>}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="الاسم EN" value={coach.name_en || ''} onChange={(e) => setCoach((current) => ({ ...current, name_en: e.target.value }))} />
          <Field label="الاسم AR" value={coach.name_ar || ''} onChange={(e) => setCoach((current) => ({ ...current, name_ar: e.target.value }))} />
          <Field label="اللقب EN" value={coach.title_en || ''} onChange={(e) => setCoach((current) => ({ ...current, title_en: e.target.value }))} />
          <Field label="اللقب AR" value={coach.title_ar || ''} onChange={(e) => setCoach((current) => ({ ...current, title_ar: e.target.value }))} />
          <Field label="سنوات الخبرة" type="number" value={coach.experience_years || 0} onChange={(e) => setCoach((current) => ({ ...current, experience_years: Number(e.target.value) }))} />
          <Field label="عدد الطلاب" type="number" value={coach.students_count || 0} onChange={(e) => setCoach((current) => ({ ...current, students_count: Number(e.target.value) }))} />
          <Field label="الأرباح المعلنة" value={coach.profit_shared || ''} onChange={(e) => setCoach((current) => ({ ...current, profit_shared: e.target.value }))} />
          <FilePicker label="صورة المدرب" preview={coach.image_url || ''} onChange={setCoachImageFile} />
          <TextArea label="نبذة EN" className="md:col-span-2" value={coach.bio_en || ''} onChange={(e) => setCoach((current) => ({ ...current, bio_en: e.target.value }))} />
          <TextArea label="نبذة AR" className="md:col-span-2" value={coach.bio_ar || ''} onChange={(e) => setCoach((current) => ({ ...current, bio_ar: e.target.value }))} />
        </div>
      </SectionCard>

      <SectionCard
        title="روابط السوشيال"
        action={<ActionButton onClick={onCreateSocial} className="w-full bg-green-600 text-white sm:w-auto">{saving === 'social-create' ? 'جارٍ الإضافة...' : 'إضافة رابط'}</ActionButton>}
      >
        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <Select label="المنصة" value={socialDraft.platform || 'telegram'} onChange={(e) => setSocialDraft((current) => ({ ...current, platform: e.target.value }))}>
            <option value="telegram">Telegram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="twitter">X</option>
            <option value="linkedin">LinkedIn</option>
          </Select>
          <Field label="العنوان" value={socialDraft.label || ''} onChange={(e) => setSocialDraft((current) => ({ ...current, label: e.target.value }))} />
          <Field label="الرابط" className="md:col-span-2" value={socialDraft.url || ''} onChange={(e) => setSocialDraft((current) => ({ ...current, url: e.target.value }))} />
        </div>
        <div className="space-y-4">
          {socialLinks.map((link) => (
            <div key={link.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="المنصة" value={link.platform || ''} onChange={(e) => setSocialLinks((current) => current.map((item) => (item.id === link.id ? { ...item, platform: e.target.value } : item)))} />
                <Field label="العنوان" value={link.label || ''} onChange={(e) => setSocialLinks((current) => current.map((item) => (item.id === link.id ? { ...item, label: e.target.value } : item)))} />
                <Field label="الرابط" className="md:col-span-2" value={link.url || ''} onChange={(e) => setSocialLinks((current) => current.map((item) => (item.id === link.id ? { ...item, url: e.target.value } : item)))} />
                <Field label="الترتيب" type="number" value={link.sort_order || 0} onChange={(e) => setSocialLinks((current) => current.map((item) => (item.id === link.id ? { ...item, sort_order: Number(e.target.value) } : item)))} />
                <Toggle label="ظاهر" checked={!!link.is_enabled} onChange={(value) => setSocialLinks((current) => current.map((item) => (item.id === link.id ? { ...item, is_enabled: value } : item)))} />
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <ActionButton onClick={() => onUpdateSocial(link)} className="bg-green-600 text-white">
                  {saving === `social-${link.id}` ? 'جارٍ الحفظ...' : 'حفظ'}
                </ActionButton>
                <ActionButton onClick={() => onDeleteSocial(link.id)} className="bg-red-500/10 text-red-300">
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
