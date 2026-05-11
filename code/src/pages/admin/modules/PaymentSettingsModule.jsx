import { ActionButton, Field, SectionCard, TextArea } from './shared/AdminUI'

export default function PaymentSettingsModule({ settings, setSettings, onSave, saving }) {
  return (
    <SectionCard
      title="إعدادات الدفع والتحويلات"
      action={<ActionButton onClick={onSave} className="w-full bg-green-600 text-white sm:w-auto">{saving ? 'جاري الحفظ...' : 'حفظ إعدادات الدفع'}</ActionButton>}
    >
      <p className="mb-5 text-sm leading-7 text-slate-400">
        ضع هنا أرقام التحويل ورسائل الدفع التي تظهر للعميل في صفحة الدفع. طلبات الدفع نفسها تراجعها من تبويب طلبات الدفع.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="رقم InstaPay" value={settings.instapay_number || ''} onChange={(e) => setSettings((current) => ({ ...current, instapay_number: e.target.value }))} />
        <Field label="اسم حساب InstaPay" value={settings.instapay_account_name || ''} onChange={(e) => setSettings((current) => ({ ...current, instapay_account_name: e.target.value }))} />
        <Field label="رقم Vodafone Cash" value={settings.vodafone_cash_number || ''} onChange={(e) => setSettings((current) => ({ ...current, vodafone_cash_number: e.target.value }))} />
        <Field label="اسم محفظة Vodafone Cash" value={settings.vodafone_cash_account_name || ''} onChange={(e) => setSettings((current) => ({ ...current, vodafone_cash_account_name: e.target.value }))} />
        <TextArea label="بيانات التحويل البنكي أو طرق دفع إضافية" className="md:col-span-2" value={settings.bank_transfer_details || ''} onChange={(e) => setSettings((current) => ({ ...current, bank_transfer_details: e.target.value }))} />
        <TextArea label="رسالة وتعليمات الدفع بالعربية" className="md:col-span-2" value={settings.payment_instructions_ar || ''} onChange={(e) => setSettings((current) => ({ ...current, payment_instructions_ar: e.target.value }))} />
        <TextArea label="رسالة وتعليمات الدفع بالإنجليزية" className="md:col-span-2" value={settings.payment_instructions_en || ''} onChange={(e) => setSettings((current) => ({ ...current, payment_instructions_en: e.target.value }))} />
      </div>
    </SectionCard>
  )
}
