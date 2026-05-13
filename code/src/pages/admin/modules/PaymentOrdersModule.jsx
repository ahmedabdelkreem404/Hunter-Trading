import { ActionButton, EmptyState, Field, SectionCard, Select, TextArea } from './shared/AdminUI'

const statuses = [
  ['pending', 'معلق'],
  ['approved', 'مقبول'],
  ['paid', 'مدفوع'],
  ['completed', 'مكتمل'],
  ['rejected', 'مرفوض'],
  ['cancelled', 'ملغي'],
]

function statusLabel(value = 'pending') {
  return statuses.find(([key]) => key === value)?.[1] || value
}

export default function PaymentOrdersModule({ orders, setOrders, onSaveOrder, saving }) {
  return (
    <SectionCard title="طلبات الدفع والتأكيد">
      <div className="space-y-4">
        {orders.length === 0 ? (
          <EmptyState title="لا توجد طلبات دفع حتى الآن" description="عندما يرفع العميل إيصال الدفع سيظهر هنا مع بياناته وحالة الطلب." />
        ) : null}
        {orders.map((order) => (
          <div key={order.id} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
            <div className="flex flex-col gap-3 border-b border-white/10 bg-slate-900/35 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="truncate text-lg font-black text-white">
                  طلب #{order.id} - {order.title_ar || order.title_en || 'خدمة'}
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  {order.customer_name} • {order.customer_email} • {order.customer_phone || '-'}
                </div>
              </div>
              <span className="w-fit rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-black text-amber-200">
                {statusLabel(order.status || 'pending')}
              </span>
            </div>

            <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">طريقة الدفع: {order.payment_method || '-'}</div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">المبلغ: ${Number(order.amount || 0).toFixed(2)}</div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">تاريخ الطلب: {order.created_at || '-'}</div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                    {order.screenshot_url ? (
                      <a href={order.screenshot_url} target="_blank" rel="noreferrer" className="text-hunter-green hover:underline">
                        فتح إيصال الدفع
                      </a>
                    ) : (
                      'لا يوجد إيصال'
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/45 p-4">
                <div className="mb-3 text-sm font-black text-white">إدارة الطلب</div>
                <div className="space-y-3">
                  <Select label="حالة الطلب" value={order.status || 'pending'} onChange={(event) => setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, status: event.target.value } : item)))}>
                    {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </Select>
                  <Field label="رابط التحويل بعد الموافقة" value={order.redirect_url || ''} onChange={(event) => setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, redirect_url: event.target.value } : item)))} />
                  <TextArea label="ملاحظة داخلية" value={order.admin_note || ''} onChange={(event) => setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, admin_note: event.target.value } : item)))} />
                  <ActionButton onClick={() => onSaveOrder(order)} className="w-full bg-green-600 text-white">
                    {saving === `order-${order.id}` ? 'جاري الحفظ...' : 'حفظ الطلب'}
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
