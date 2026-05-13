import { ActionButton, AdminBlock, Field, FilePicker, SectionCard, TextArea } from './shared/AdminUI'

export default function CoachSocialModule({
  coach,
  setCoach,
  coachImageFile,
  setCoachImageFile,
  onSaveCoach,
  saving,
}) {
  return (
    <>
      <SectionCard
        title="المدرب"
        action={<ActionButton onClick={onSaveCoach} className="w-full bg-green-600 text-white sm:w-auto">{saving === 'coach-save' ? 'جار الحفظ...' : 'حفظ بيانات المدرب'}</ActionButton>}
      >
        <div className="space-y-4">
          <AdminBlock title="بيانات المدرب" description="هذه البيانات تظهر في سكشن المدرب داخل الموقع.">
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="الاسم بالإنجليزية" value={coach.name_en || ''} onChange={(e) => setCoach((current) => ({ ...current, name_en: e.target.value }))} />
              <Field label="الاسم بالعربية" value={coach.name_ar || ''} onChange={(e) => setCoach((current) => ({ ...current, name_ar: e.target.value }))} />
              <Field label="اللقب بالإنجليزية" value={coach.title_en || ''} onChange={(e) => setCoach((current) => ({ ...current, title_en: e.target.value }))} />
              <Field label="اللقب بالعربية" value={coach.title_ar || ''} onChange={(e) => setCoach((current) => ({ ...current, title_ar: e.target.value }))} />
            </div>
          </AdminBlock>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-4">
              <AdminBlock title="الأرقام الظاهرة" description="اكتب أرقام مختصرة وواضحة عشان تظهر بشكل مرتب في الموقع.">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="سنوات الخبرة" type="number" value={coach.experience_years || 0} onChange={(e) => setCoach((current) => ({ ...current, experience_years: Number(e.target.value) }))} />
                  <Field label="عدد الطلاب" type="number" value={coach.students_count || 0} onChange={(e) => setCoach((current) => ({ ...current, students_count: Number(e.target.value) }))} />
                  <Field label="الأرباح المعلنة" value={coach.profit_shared || ''} onChange={(e) => setCoach((current) => ({ ...current, profit_shared: e.target.value }))} />
                </div>
              </AdminBlock>

              <AdminBlock title="نبذة المدرب" description="اكتب نبذة مختصرة ومريحة بصرياً للعميل.">
                <div className="grid gap-4">
                  <TextArea label="نبذة بالإنجليزية" value={coach.bio_en || ''} onChange={(e) => setCoach((current) => ({ ...current, bio_en: e.target.value }))} />
                  <TextArea label="نبذة بالعربية" value={coach.bio_ar || ''} onChange={(e) => setCoach((current) => ({ ...current, bio_ar: e.target.value }))} />
                </div>
              </AdminBlock>
            </div>

            <AdminBlock title="صورة المدرب" description="يفضل صورة مربعة أو بورتريه واضحة.">
              <FilePicker label="صورة المدرب" preview={coach.image_url || ''} onChange={setCoachImageFile} accept="image/*" buttonLabel={coachImageFile?.name || 'اختيار صورة المدرب'} />
            </AdminBlock>
          </div>
        </div>
      </SectionCard>
    </>
  )
}
