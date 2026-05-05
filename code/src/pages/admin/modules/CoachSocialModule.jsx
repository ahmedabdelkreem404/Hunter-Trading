import { ActionButton, Field, FilePicker, SectionCard, TextArea } from './shared/AdminUI'
import SocialSettingsControls from './shared/SocialSettingsControls'

export default function CoachSocialModule({
  coach,
  setCoach,
  coachImageFile,
  setCoachImageFile,
  settings,
  setSettings,
  onSaveCoach,
  onSaveSettings,
  saving,
}) {
  return (
    <>
      <SectionCard
        title="المدرب"
        action={<ActionButton onClick={onSaveCoach} className="w-full bg-green-600 text-white sm:w-auto">{saving === 'coach-save' ? 'جار الحفظ...' : 'حفظ بيانات المدرب'}</ActionButton>}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="الاسم بالإنجليزية" value={coach.name_en || ''} onChange={(e) => setCoach((current) => ({ ...current, name_en: e.target.value }))} />
          <Field label="الاسم بالعربية" value={coach.name_ar || ''} onChange={(e) => setCoach((current) => ({ ...current, name_ar: e.target.value }))} />
          <Field label="اللقب بالإنجليزية" value={coach.title_en || ''} onChange={(e) => setCoach((current) => ({ ...current, title_en: e.target.value }))} />
          <Field label="اللقب بالعربية" value={coach.title_ar || ''} onChange={(e) => setCoach((current) => ({ ...current, title_ar: e.target.value }))} />
          <Field label="سنوات الخبرة" type="number" value={coach.experience_years || 0} onChange={(e) => setCoach((current) => ({ ...current, experience_years: Number(e.target.value) }))} />
          <Field label="عدد الطلاب" type="number" value={coach.students_count || 0} onChange={(e) => setCoach((current) => ({ ...current, students_count: Number(e.target.value) }))} />
          <Field label="الأرباح المعلنة" value={coach.profit_shared || ''} onChange={(e) => setCoach((current) => ({ ...current, profit_shared: e.target.value }))} />
          <FilePicker label="صورة المدرب" preview={coach.image_url || ''} onChange={setCoachImageFile} accept="image/*" />
          <TextArea label="نبذة بالإنجليزية" className="md:col-span-2" value={coach.bio_en || ''} onChange={(e) => setCoach((current) => ({ ...current, bio_en: e.target.value }))} />
          <TextArea label="نبذة بالعربية" className="md:col-span-2" value={coach.bio_ar || ''} onChange={(e) => setCoach((current) => ({ ...current, bio_ar: e.target.value }))} />
        </div>
      </SectionCard>

      <SectionCard
        title="روابط السوشيال الموحدة"
        action={<ActionButton onClick={onSaveSettings} className="w-full bg-green-600 text-white sm:w-auto">{saving === 'settings-save' ? 'جار الحفظ...' : 'حفظ روابط السوشيال'}</ActionButton>}
      >
        <p className="mb-5 text-sm leading-7 text-slate-400">
          هذه هي نفس روابط السوشيال المستخدمة في الفوتر. تفعيل أو تعطيل أي منصة هنا ينعكس على الفوتر وسكشن الكوتش معًا.
        </p>
        <SocialSettingsControls settings={settings} setSettings={setSettings} />
      </SectionCard>
    </>
  )
}
