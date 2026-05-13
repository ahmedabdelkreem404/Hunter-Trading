import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { ActionButton, Field, SectionCard, Select, TextArea, confirmDelete } from './shared/AdminUI'
import {
  PAYMENT_METHOD_TYPES,
  createPaymentMethod,
  getAdminPaymentMethods,
  serializePaymentMethods,
} from '../../../utils/paymentMethods'

export default function PaymentSettingsModule({ settings, setSettings, onSave, saving }) {
  const methods = getAdminPaymentMethods(settings)

  const commitMethods = (nextMethods) => {
    setSettings((current) => ({
      ...current,
      payment_methods_json: serializePaymentMethods(nextMethods),
    }))
  }

  const updateMethod = (id, patch) => {
    commitMethods(methods.map((method) => (method.id === id ? { ...method, ...patch } : method)))
  }

  const moveMethod = (id, direction) => {
    const index = methods.findIndex((method) => method.id === id)
    const targetIndex = index + direction
    if (index < 0 || targetIndex < 0 || targetIndex >= methods.length) return

    const next = [...methods]
    const [item] = next.splice(index, 1)
    next.splice(targetIndex, 0, item)
    commitMethods(next)
  }

  const addMethod = () => {
    commitMethods([...methods, createPaymentMethod(methods.length)])
  }

  const removeMethod = async (id) => {
    if (!(await confirmDelete('هل تريد حذف طريقة الدفع؟'))) return
    commitMethods(methods.filter((method) => method.id !== id))
  }

  return (
    <div className="space-y-5">
      <SectionCard
        title="إعدادات الدفع والتحويلات"
        action={<ActionButton onClick={onSave} className="w-full bg-green-600 text-white sm:w-auto">{saving ? 'جاري الحفظ...' : 'حفظ إعدادات الدفع'}</ActionButton>}
      >
        <div className="space-y-5">
          <div className="rounded-2xl border border-hunter-green/20 bg-hunter-green/10 p-4 text-sm leading-7 text-slate-200">
            من هنا تضيف أو تخفي أي طريقة دفع تظهر للعميل في صفحة الدفع. الطريقة المفعلة فقط هي التي تظهر للعميل، ويمكنك ترتيب الطرق من الأسهم.
          </div>

          <div className="grid gap-4">
            <TextArea
              label="رسالة وتعليمات الدفع بالعربية"
              value={settings.payment_instructions_ar || ''}
              onChange={(e) => setSettings((current) => ({ ...current, payment_instructions_ar: e.target.value }))}
            />
            <TextArea
              label="رسالة وتعليمات الدفع بالإنجليزية"
              value={settings.payment_instructions_en || ''}
              onChange={(e) => setSettings((current) => ({ ...current, payment_instructions_en: e.target.value }))}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="طرق الدفع الظاهرة للعميل"
        action={<ActionButton onClick={addMethod} className="flex w-full items-center justify-center gap-2 bg-hunter-green text-slate-950 sm:w-auto"><Plus className="h-4 w-4" />إضافة طريقة دفع</ActionButton>}
      >
        <div className="space-y-4">
          {methods.map((method, index) => (
            <div key={method.id} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
              <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${method.is_enabled ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    <h3 className="truncate text-base font-semibold text-white">{method.label_ar || method.label_en || 'طريقة دفع'}</h3>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${method.is_enabled ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                      {method.is_enabled ? 'ظاهرة للعميل' : 'مخفية'}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{method.helper_ar || 'اكتب وصفاً واضحاً يظهر للعميل داخل القائمة.'}</p>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => updateMethod(method.id, { is_enabled: !method.is_enabled })}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-200 hover:bg-white/10"
                    title={method.is_enabled ? 'إخفاء' : 'إظهار'}
                  >
                    {method.is_enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveMethod(method.id, -1)}
                    disabled={index === 0}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    title="رفع لأعلى"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveMethod(method.id, 1)}
                    disabled={index === methods.length - 1}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    title="إنزال لأسفل"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMethod(method.id)}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 p-4 md:grid-cols-2">
                <Select label="نوع طريقة الدفع" value={method.type} onChange={(e) => updateMethod(method.id, { type: e.target.value })}>
                  {PAYMENT_METHOD_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </Select>
                <Field label="معرّف داخلي قصير" value={method.id} onChange={(e) => updateMethod(method.id, { id: e.target.value.trim() || method.id })} />

                <Field label="اسم الطريقة بالعربية" value={method.label_ar || ''} onChange={(e) => updateMethod(method.id, { label_ar: e.target.value })} />
                <Field label="اسم الطريقة بالإنجليزية" value={method.label_en || ''} onChange={(e) => updateMethod(method.id, { label_en: e.target.value })} />

                <Field label="وصف مختصر بالعربية داخل القائمة" value={method.helper_ar || ''} onChange={(e) => updateMethod(method.id, { helper_ar: e.target.value })} />
                <Field label="وصف مختصر بالإنجليزية داخل القائمة" value={method.helper_en || ''} onChange={(e) => updateMethod(method.id, { helper_en: e.target.value })} />

                <Field label="عنوان البيان الرئيسي بالعربية" value={method.primary_label_ar || ''} onChange={(e) => updateMethod(method.id, { primary_label_ar: e.target.value })} />
                <Field label="عنوان البيان الرئيسي بالإنجليزية" value={method.primary_label_en || ''} onChange={(e) => updateMethod(method.id, { primary_label_en: e.target.value })} />

                <TextArea
                  label="الرقم / الحساب / بيانات التحويل"
                  className="md:col-span-2"
                  value={method.primary_value || ''}
                  onChange={(e) => updateMethod(method.id, { primary_value: e.target.value })}
                />

                <Field label="عنوان البيان الإضافي بالعربية" value={method.secondary_label_ar || ''} onChange={(e) => updateMethod(method.id, { secondary_label_ar: e.target.value })} />
                <Field label="عنوان البيان الإضافي بالإنجليزية" value={method.secondary_label_en || ''} onChange={(e) => updateMethod(method.id, { secondary_label_en: e.target.value })} />

                <Field
                  label="البيان الإضافي مثل اسم الحساب"
                  className="md:col-span-2"
                  value={method.secondary_value || ''}
                  onChange={(e) => updateMethod(method.id, { secondary_value: e.target.value })}
                />

                <TextArea
                  label="تعليمات خاصة بهذه الطريقة بالعربية"
                  value={method.instructions_ar || ''}
                  onChange={(e) => updateMethod(method.id, { instructions_ar: e.target.value })}
                />
                <TextArea
                  label="تعليمات خاصة بهذه الطريقة بالإنجليزية"
                  value={method.instructions_en || ''}
                  onChange={(e) => updateMethod(method.id, { instructions_en: e.target.value })}
                />
              </div>
            </div>
          ))}

          {methods.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-slate-400">
              لا توجد طرق دفع حالياً. اضغط “إضافة طريقة دفع” لبدء إضافة بيانات التحويل.
            </div>
          ) : null}
        </div>
      </SectionCard>
    </div>
  )
}
