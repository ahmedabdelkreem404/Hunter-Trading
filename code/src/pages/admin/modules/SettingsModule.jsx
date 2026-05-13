import { ActionButton, Field, SectionCard, TextArea } from './shared/AdminUI'
import SocialSettingsControls from './shared/SocialSettingsControls'

function SettingsBlock({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 transition hover:border-cyan-300/25 hover:bg-slate-950/65">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {description ? <p className="mt-1 text-xs leading-6 text-slate-400">{description}</p> : null}
      </div>
      {children}
    </div>
  )
}

function LogoUploader({ preview, file, onChange }) {
  return (
    <div>
      <span className="admin-label">شعار الموقع</span>
      <div className="admin-file-picker rounded-2xl p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80">
            {preview ? (
              <img src={preview} alt="شعار الموقع" className="h-full w-full object-contain p-2" />
            ) : (
              <span className="text-xs font-bold text-slate-500">Logo</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold leading-5 text-white">ارفع شعار واضح للموقع</div>
            <p className="text-[11px] leading-5 text-slate-400">PNG أو WebP بخلفية شفافة يفضل.</p>
          </div>
          <label className="admin-action-button shrink-0 cursor-pointer border border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15">
            اختيار شعار
            <input type="file" accept="image/*" onChange={(event) => onChange(event.target.files?.[0] ?? null)} className="sr-only" />
          </label>
        </div>
        <div className="mt-2 truncate text-xs text-slate-500">{file?.name || 'لم يتم اختيار شعار جديد'}</div>
      </div>
    </div>
  )
}

export default function SettingsModule({ settings, setSettings, siteLogoFile, setSiteLogoFile, onSave, saving }) {
  return (
    <>
      <SectionCard
        title="الهوية والتواصل"
        action={<ActionButton onClick={onSave} className="w-full bg-green-600 text-white sm:w-auto">{saving ? 'جار الحفظ...' : 'حفظ الإعدادات'}</ActionButton>}
      >
        <div className="space-y-4">
          <SettingsBlock title="هوية الموقع" description="اسم الموقع والشعار المستخدمان في الواجهة العامة.">
            <div className="grid items-start gap-4 lg:grid-cols-2">
              <LogoUploader preview={settings.site_logo || ''} file={siteLogoFile} onChange={setSiteLogoFile} />
              <Field label="اسم الموقع" value={settings.website_name || ''} onChange={(e) => setSettings((current) => ({ ...current, website_name: e.target.value }))} />
            </div>
          </SettingsBlock>

          <SettingsBlock title="بيانات التواصل" description="البيانات الأساسية التي تظهر للعميل أو تستخدم داخل لوحة التحكم.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="البريد الإداري" value={settings.support_email || ''} onChange={(e) => setSettings((current) => ({ ...current, support_email: e.target.value }))} />
              <Field label="الموقع" value={settings.location || ''} onChange={(e) => setSettings((current) => ({ ...current, location: e.target.value }))} />
            </div>
          </SettingsBlock>
        </div>
      </SectionCard>

      <SectionCard
        title="روابط السوشيال الموحدة"
        action={<ActionButton onClick={onSave} className="w-full bg-green-600 text-white sm:w-auto">{saving ? 'جار الحفظ...' : 'حفظ روابط السوشيال'}</ActionButton>}
      >
        <p className="mb-5 text-sm leading-7 text-slate-400">
          أي منصة يتم تفعيلها هنا ستظهر بنفس الأيقونة واللون في الفوتر وسكشن الكوتش معًا. هذا هو مكان التحكم الموحد في روابط السوشيال.
        </p>
        <SocialSettingsControls settings={settings} setSettings={setSettings} />
      </SectionCard>

      <SectionCard title="الألوان والهوية البصرية">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SettingsBlock title="ألوان الهوية" description="الألوان الأساسية للأزرار والعناصر البارزة.">
            <div className="grid gap-4">
              <Field label="اللون الأساسي" type="color" value={settings.primary_color || '#00ff88'} onChange={(e) => setSettings((current) => ({ ...current, primary_color: e.target.value }))} />
              <Field label="اللون الأساسي القوي" type="color" value={settings.primary_color_strong || '#00cc6a'} onChange={(e) => setSettings((current) => ({ ...current, primary_color_strong: e.target.value }))} />
              <Field label="لون العروض والخصومات" type="color" value={settings.accent_orange || '#ff6b35'} onChange={(e) => setSettings((current) => ({ ...current, accent_orange: e.target.value }))} />
              <Field label="لون العروض القوي" type="color" value={settings.accent_orange_strong || '#ff8c42'} onChange={(e) => setSettings((current) => ({ ...current, accent_orange_strong: e.target.value }))} />
            </div>
          </SettingsBlock>
          <SettingsBlock title="ألوان الواجهة" description="ألوان الخلفيات والكروت داخل الموقع.">
            <div className="grid gap-4">
              <Field label="الأزرق" type="color" value={settings.accent_blue || '#0066ff'} onChange={(e) => setSettings((current) => ({ ...current, accent_blue: e.target.value }))} />
              <Field label="الخلفية" type="color" value={settings.background_dark || '#0a0a0f'} onChange={(e) => setSettings((current) => ({ ...current, background_dark: e.target.value }))} />
            </div>
          </SettingsBlock>
          <SettingsBlock title="الكروت والنصوص" description="ألوان النص وخلفية البطاقات.">
            <div className="grid gap-4">
              <Field label="خلفية الكروت" type="color" value={settings.card_dark || '#12121a'} onChange={(e) => setSettings((current) => ({ ...current, card_dark: e.target.value }))} />
              <Field label="لون النص" type="color" value={settings.text_dark || '#ffffff'} onChange={(e) => setSettings((current) => ({ ...current, text_dark: e.target.value }))} />
              <Field label="لون النص الثانوي" type="color" value={settings.text_muted_dark || '#8a8a9a'} onChange={(e) => setSettings((current) => ({ ...current, text_muted_dark: e.target.value }))} />
            </div>
          </SettingsBlock>
        </div>
      </SectionCard>

      <SectionCard title="ألوان كروت الخدمات والمنتجات">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SettingsBlock title="خلفية الكارت" description="تحكم في الخلفية الخارجية والداخلية لكل كروت الخدمات والعروض.">
            <div className="grid gap-4">
              <Field label="خلفية الكارت الخارجية" type="color" value={settings.product_card_shell_bg || '#0a0a0f'} onChange={(e) => setSettings((current) => ({ ...current, product_card_shell_bg: e.target.value }))} />
              <Field label="خلفية الكارت الداخلية" type="color" value={settings.product_card_surface_bg || '#12121a'} onChange={(e) => setSettings((current) => ({ ...current, product_card_surface_bg: e.target.value }))} />
            </div>
          </SettingsBlock>
          <SettingsBlock title="الحدود والنصوص" description="ألوان العنوان والوصف والحدود داخل كل كارت.">
            <div className="grid gap-4">
              <Field label="لون حدود الكارت" type="color" value={settings.product_card_border_color || '#2a2a36'} onChange={(e) => setSettings((current) => ({ ...current, product_card_border_color: e.target.value }))} />
              <Field label="لون عنوان الكارت" type="color" value={settings.product_card_title_color || '#ffffff'} onChange={(e) => setSettings((current) => ({ ...current, product_card_title_color: e.target.value }))} />
              <Field label="لون الوصف والمميزات" type="color" value={settings.product_card_body_color || '#9ca3af'} onChange={(e) => setSettings((current) => ({ ...current, product_card_body_color: e.target.value }))} />
            </div>
          </SettingsBlock>
          <SettingsBlock title="أزرار الكروت" description="لون النص داخل أزرار الشراء أو التفاصيل.">
            <Field label="لون نص زر الكارت" type="color" value={settings.product_card_button_text_color || '#050509'} onChange={(e) => setSettings((current) => ({ ...current, product_card_button_text_color: e.target.value }))} />
          </SettingsBlock>
        </div>
      </SectionCard>

      <SectionCard title="القانوني والفوتر">
        <div className="grid gap-4 xl:grid-cols-2">
          <SettingsBlock title="سياسة الخصوصية" description="النص القانوني الخاص بالخصوصية.">
            <div className="grid gap-4">
              <Field label="عنوان سياسة الخصوصية بالعربية" value={settings.privacy_policy_title_ar || settings.privacy_policy_title || ''} onChange={(e) => setSettings((current) => ({ ...current, privacy_policy_title_ar: e.target.value }))} />
              <Field label="عنوان سياسة الخصوصية بالإنجليزية" value={settings.privacy_policy_title_en || ''} onChange={(e) => setSettings((current) => ({ ...current, privacy_policy_title_en: e.target.value }))} />
              <TextArea label="محتوى سياسة الخصوصية بالعربية" value={settings.privacy_policy_content_ar || settings.privacy_policy_content || ''} onChange={(e) => setSettings((current) => ({ ...current, privacy_policy_content_ar: e.target.value }))} />
              <TextArea label="محتوى سياسة الخصوصية بالإنجليزية" value={settings.privacy_policy_content_en || ''} onChange={(e) => setSettings((current) => ({ ...current, privacy_policy_content_en: e.target.value }))} />
            </div>
          </SettingsBlock>
          <SettingsBlock title="الشروط والأحكام" description="شروط استخدام الموقع والخدمات.">
            <div className="grid gap-4">
              <Field label="عنوان الشروط والأحكام بالعربية" value={settings.terms_title_ar || settings.terms_title || ''} onChange={(e) => setSettings((current) => ({ ...current, terms_title_ar: e.target.value }))} />
              <Field label="عنوان الشروط والأحكام بالإنجليزية" value={settings.terms_title_en || ''} onChange={(e) => setSettings((current) => ({ ...current, terms_title_en: e.target.value }))} />
              <TextArea label="محتوى الشروط والأحكام بالعربية" value={settings.terms_content_ar || settings.terms_content || ''} onChange={(e) => setSettings((current) => ({ ...current, terms_content_ar: e.target.value }))} />
              <TextArea label="محتوى الشروط والأحكام بالإنجليزية" value={settings.terms_content_en || ''} onChange={(e) => setSettings((current) => ({ ...current, terms_content_en: e.target.value }))} />
            </div>
          </SettingsBlock>
          <SettingsBlock title="تحذير المخاطر" description="التحذير الذي يظهر للعميل في الموقع والفوتر.">
            <div className="grid gap-4">
              <Field label="عنوان تحذير المخاطر بالعربية" value={settings.risk_disclaimer_title_ar || settings.risk_warning_title_ar || settings.risk_warning_title || ''} onChange={(e) => setSettings((current) => ({ ...current, risk_disclaimer_title_ar: e.target.value, risk_warning_title_ar: e.target.value }))} />
              <Field label="عنوان تحذير المخاطر بالإنجليزية" value={settings.risk_disclaimer_title_en || settings.risk_warning_title_en || ''} onChange={(e) => setSettings((current) => ({ ...current, risk_disclaimer_title_en: e.target.value, risk_warning_title_en: e.target.value }))} />
              <TextArea label="محتوى تحذير المخاطر بالعربية" value={settings.risk_disclaimer_content_ar || settings.risk_warning_content_ar || settings.risk_warning_content || ''} onChange={(e) => setSettings((current) => ({ ...current, risk_disclaimer_content_ar: e.target.value, risk_warning_content_ar: e.target.value }))} />
              <TextArea label="محتوى تحذير المخاطر بالإنجليزية" value={settings.risk_disclaimer_content_en || settings.risk_warning_content_en || ''} onChange={(e) => setSettings((current) => ({ ...current, risk_disclaimer_content_en: e.target.value, risk_warning_content_en: e.target.value }))} />
            </div>
          </SettingsBlock>
          <SettingsBlock title="وصف الفوتر" description="النص المختصر أسفل الموقع.">
            <div className="grid gap-4">
              <TextArea label="وصف الفوتر بالعربية" value={settings.footer_description_ar || settings.footer_description || ''} onChange={(e) => setSettings((current) => ({ ...current, footer_description_ar: e.target.value }))} />
              <TextArea label="وصف الفوتر بالإنجليزية" value={settings.footer_description_en || ''} onChange={(e) => setSettings((current) => ({ ...current, footer_description_en: e.target.value }))} />
            </div>
          </SettingsBlock>
        </div>
      </SectionCard>
    </>
  )
}
