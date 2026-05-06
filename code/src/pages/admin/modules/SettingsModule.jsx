import { ActionButton, Field, FilePicker, SectionCard, TextArea } from './shared/AdminUI'
import SocialSettingsControls from './shared/SocialSettingsControls'

export default function SettingsModule({ settings, setSettings, siteLogoFile, setSiteLogoFile, onSave, saving }) {
  return (
    <>
      <SectionCard
        title="الهوية والتواصل"
        action={<ActionButton onClick={onSave} className="w-full bg-green-600 text-white sm:w-auto">{saving ? 'جار الحفظ...' : 'حفظ الإعدادات'}</ActionButton>}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FilePicker label="شعار الموقع" preview={settings.site_logo || ''} onChange={setSiteLogoFile} buttonLabel={siteLogoFile?.name || 'اختر الشعار'} accept="image/*" />
          <Field label="اسم الموقع" value={settings.website_name || ''} onChange={(e) => setSettings((current) => ({ ...current, website_name: e.target.value }))} />
          <Field label="البريد الإداري" value={settings.support_email || ''} onChange={(e) => setSettings((current) => ({ ...current, support_email: e.target.value }))} />
          <Field label="الموقع" value={settings.location || ''} onChange={(e) => setSettings((current) => ({ ...current, location: e.target.value }))} />
        </div>
      </SectionCard>

      <SectionCard title="معلومات الدفع">
        <p className="mb-5 text-sm leading-7 text-slate-400">
          البيانات هنا تظهر في صفحة الدفع للمنتجات المدفوعة فقط. خدمة السكالب لا تستخدم الدفع داخل الموقع.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="رقم InstaPay" value={settings.instapay_number || ''} onChange={(e) => setSettings((current) => ({ ...current, instapay_number: e.target.value }))} />
          <Field label="اسم حساب InstaPay" value={settings.instapay_account_name || ''} onChange={(e) => setSettings((current) => ({ ...current, instapay_account_name: e.target.value }))} />
          <Field label="رقم Vodafone Cash" value={settings.vodafone_cash_number || ''} onChange={(e) => setSettings((current) => ({ ...current, vodafone_cash_number: e.target.value }))} />
          <Field label="اسم محفظة Vodafone Cash" value={settings.vodafone_cash_account_name || ''} onChange={(e) => setSettings((current) => ({ ...current, vodafone_cash_account_name: e.target.value }))} />
          <TextArea label="بيانات التحويل البنكي أو طرق دفع إضافية" value={settings.bank_transfer_details || ''} onChange={(e) => setSettings((current) => ({ ...current, bank_transfer_details: e.target.value }))} />
          <TextArea label="تعليمات الدفع بالعربية" value={settings.payment_instructions_ar || ''} onChange={(e) => setSettings((current) => ({ ...current, payment_instructions_ar: e.target.value }))} />
          <TextArea label="تعليمات الدفع بالإنجليزية" value={settings.payment_instructions_en || ''} onChange={(e) => setSettings((current) => ({ ...current, payment_instructions_en: e.target.value }))} />
        </div>
      </SectionCard>

      <SectionCard title="روابط السوشيال الموحدة">
        <p className="mb-5 text-sm leading-7 text-slate-400">
          أي منصة يتم تفعيلها هنا ستظهر بنفس الأيقونة واللون في الفوتر وسكشن الكوتش معًا.
        </p>
        <SocialSettingsControls settings={settings} setSettings={setSettings} />
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
          <Field label="عنوان سياسة الخصوصية بالعربية" value={settings.privacy_policy_title_ar || settings.privacy_policy_title || ''} onChange={(e) => setSettings((current) => ({ ...current, privacy_policy_title_ar: e.target.value }))} />
          <Field label="عنوان سياسة الخصوصية بالإنجليزية" value={settings.privacy_policy_title_en || ''} onChange={(e) => setSettings((current) => ({ ...current, privacy_policy_title_en: e.target.value }))} />
          <TextArea label="محتوى سياسة الخصوصية بالعربية" value={settings.privacy_policy_content_ar || settings.privacy_policy_content || ''} onChange={(e) => setSettings((current) => ({ ...current, privacy_policy_content_ar: e.target.value }))} />
          <TextArea label="محتوى سياسة الخصوصية بالإنجليزية" value={settings.privacy_policy_content_en || ''} onChange={(e) => setSettings((current) => ({ ...current, privacy_policy_content_en: e.target.value }))} />
          <Field label="عنوان الشروط والأحكام بالعربية" value={settings.terms_title_ar || settings.terms_title || ''} onChange={(e) => setSettings((current) => ({ ...current, terms_title_ar: e.target.value }))} />
          <Field label="عنوان الشروط والأحكام بالإنجليزية" value={settings.terms_title_en || ''} onChange={(e) => setSettings((current) => ({ ...current, terms_title_en: e.target.value }))} />
          <TextArea label="محتوى الشروط والأحكام بالعربية" value={settings.terms_content_ar || settings.terms_content || ''} onChange={(e) => setSettings((current) => ({ ...current, terms_content_ar: e.target.value }))} />
          <TextArea label="محتوى الشروط والأحكام بالإنجليزية" value={settings.terms_content_en || ''} onChange={(e) => setSettings((current) => ({ ...current, terms_content_en: e.target.value }))} />
          <Field label="عنوان تحذير المخاطر بالعربية" value={settings.risk_disclaimer_title_ar || settings.risk_warning_title_ar || settings.risk_warning_title || ''} onChange={(e) => setSettings((current) => ({ ...current, risk_disclaimer_title_ar: e.target.value, risk_warning_title_ar: e.target.value }))} />
          <Field label="عنوان تحذير المخاطر بالإنجليزية" value={settings.risk_disclaimer_title_en || settings.risk_warning_title_en || ''} onChange={(e) => setSettings((current) => ({ ...current, risk_disclaimer_title_en: e.target.value, risk_warning_title_en: e.target.value }))} />
          <TextArea label="محتوى تحذير المخاطر بالعربية" value={settings.risk_disclaimer_content_ar || settings.risk_warning_content_ar || settings.risk_warning_content || ''} onChange={(e) => setSettings((current) => ({ ...current, risk_disclaimer_content_ar: e.target.value, risk_warning_content_ar: e.target.value }))} />
          <TextArea label="محتوى تحذير المخاطر بالإنجليزية" value={settings.risk_disclaimer_content_en || settings.risk_warning_content_en || ''} onChange={(e) => setSettings((current) => ({ ...current, risk_disclaimer_content_en: e.target.value, risk_warning_content_en: e.target.value }))} />
          <TextArea label="وصف الفوتر بالعربية" value={settings.footer_description_ar || settings.footer_description || ''} onChange={(e) => setSettings((current) => ({ ...current, footer_description_ar: e.target.value }))} />
          <TextArea label="وصف الفوتر بالإنجليزية" value={settings.footer_description_en || ''} onChange={(e) => setSettings((current) => ({ ...current, footer_description_en: e.target.value }))} />
        </div>
      </SectionCard>
    </>
  )
}
