import { ActionButton, Field, FilePicker, SectionCard, TextArea } from './shared/AdminUI'

export default function SettingsModule({ settings, setSettings, siteLogoFile, setSiteLogoFile, onSave, saving }) {
  return (
    <>
      <SectionCard
        title="الهوية والتواصل"
        action={<ActionButton onClick={onSave} className="w-full bg-green-600 text-white sm:w-auto">{saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}</ActionButton>}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FilePicker label="شعار الموقع" preview={settings.site_logo || ''} onChange={setSiteLogoFile} buttonLabel={siteLogoFile?.name || 'اختر الشعار'} />
          <Field label="اسم الموقع" value={settings.website_name || ''} onChange={(e) => setSettings((current) => ({ ...current, website_name: e.target.value }))} />
          <Field label="البريد الإداري" value={settings.support_email || ''} onChange={(e) => setSettings((current) => ({ ...current, support_email: e.target.value }))} />
          <Field label="رابط تيليجرام" value={settings.telegram_url || ''} onChange={(e) => setSettings((current) => ({ ...current, telegram_url: e.target.value }))} />
          <Field label="رابط واتساب" value={settings.whatsapp_url || ''} onChange={(e) => setSettings((current) => ({ ...current, whatsapp_url: e.target.value }))} />
          <Field label="رقم InstaPay" value={settings.instapay_number || ''} onChange={(e) => setSettings((current) => ({ ...current, instapay_number: e.target.value }))} />
          <Field label="رقم Vodafone Cash" value={settings.vodafone_cash_number || ''} onChange={(e) => setSettings((current) => ({ ...current, vodafone_cash_number: e.target.value }))} />
          <Field label="الموقع" value={settings.location || ''} onChange={(e) => setSettings((current) => ({ ...current, location: e.target.value }))} />
          <Field label="رابط إنستجرام" value={settings.instagram_url || ''} onChange={(e) => setSettings((current) => ({ ...current, instagram_url: e.target.value }))} />
          <Field label="رابط يوتيوب" value={settings.youtube_url || ''} onChange={(e) => setSettings((current) => ({ ...current, youtube_url: e.target.value }))} />
          <Field label="رابط فيسبوك" value={settings.facebook_url || ''} onChange={(e) => setSettings((current) => ({ ...current, facebook_url: e.target.value }))} />
          <Field label="رابط TikTok" value={settings.tiktok_url || ''} onChange={(e) => setSettings((current) => ({ ...current, tiktok_url: e.target.value }))} />
          <Field label="رابط X / Twitter" value={settings.twitter_url || ''} onChange={(e) => setSettings((current) => ({ ...current, twitter_url: e.target.value }))} />
        </div>
      </SectionCard>

      <SectionCard title="الألوان والهوية البصرية">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="اللون الأساسي" type="color" value={settings.primary_color || '#00ff88'} onChange={(e) => setSettings((current) => ({ ...current, primary_color: e.target.value }))} />
          <Field label="اللون الأساسي القوي" type="color" value={settings.primary_color_strong || '#00cc6a'} onChange={(e) => setSettings((current) => ({ ...current, primary_color_strong: e.target.value }))} />
          <Field label="الأزرق" type="color" value={settings.accent_blue || '#0066ff'} onChange={(e) => setSettings((current) => ({ ...current, accent_blue: e.target.value }))} />
          <Field label="الخلفية" type="color" value={settings.background_dark || '#0a0a0f'} onChange={(e) => setSettings((current) => ({ ...current, background_dark: e.target.value }))} />
          <Field label="خلفية الكروت" type="color" value={settings.card_dark || '#12121a'} onChange={(e) => setSettings((current) => ({ ...current, card_dark: e.target.value }))} />
          <Field label="لون النص" type="color" value={settings.text_dark || '#ffffff'} onChange={(e) => setSettings((current) => ({ ...current, text_dark: e.target.value }))} />
        </div>
      </SectionCard>

      <SectionCard title="القانوني والفوتر">
        <div className="grid gap-4">
          <Field label="عنوان سياسة الخصوصية" value={settings.privacy_policy_title || ''} onChange={(e) => setSettings((current) => ({ ...current, privacy_policy_title: e.target.value }))} />
          <TextArea label="محتوى سياسة الخصوصية" value={settings.privacy_policy_content || ''} onChange={(e) => setSettings((current) => ({ ...current, privacy_policy_content: e.target.value }))} />
          <Field label="عنوان الشروط والأحكام" value={settings.terms_title || ''} onChange={(e) => setSettings((current) => ({ ...current, terms_title: e.target.value }))} />
          <TextArea label="محتوى الشروط والأحكام" value={settings.terms_content || ''} onChange={(e) => setSettings((current) => ({ ...current, terms_content: e.target.value }))} />
          <Field label="عنوان التحذير" value={settings.risk_warning_title || ''} onChange={(e) => setSettings((current) => ({ ...current, risk_warning_title: e.target.value }))} />
          <TextArea label="محتوى التحذير" value={settings.risk_warning_content || ''} onChange={(e) => setSettings((current) => ({ ...current, risk_warning_content: e.target.value }))} />
          <TextArea label="وصف الفوتر" value={settings.footer_description || ''} onChange={(e) => setSettings((current) => ({ ...current, footer_description: e.target.value }))} />
        </div>
      </SectionCard>
    </>
  )
}
