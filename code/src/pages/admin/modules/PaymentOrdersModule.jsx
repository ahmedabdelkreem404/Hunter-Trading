import { ActionButton, Field, SectionCard, Select, TextArea } from './shared/AdminUI'

export default function PaymentOrdersModule({ orders, setOrders, onSaveOrder, saving }) {
  return (
    <SectionCard title="Payment orders">
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                <div className="text-lg font-semibold text-white">
                  #{order.id} • {order.title_ar || order.title_en || 'Service'}
                </div>
                <div className="text-sm text-slate-400">
                  {order.customer_name} • {order.customer_email} • {order.customer_phone || '-'}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">Method: {order.payment_method}</div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">Amount: ${Number(order.amount || 0).toFixed(2)}</div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">Status: {order.status || 'pending'}</div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                    {order.screenshot_url ? (
                      <a href={order.screenshot_url} target="_blank" rel="noreferrer" className="text-hunter-green hover:underline">
                        Open screenshot
                      </a>
                    ) : (
                      'No screenshot'
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Select label="Status" value={order.status || 'pending'} onChange={(event) => setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, status: event.target.value } : item)))}>
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="paid">paid</option>
                  <option value="completed">completed</option>
                  <option value="rejected">rejected</option>
                  <option value="cancelled">cancelled</option>
                </Select>
                <Field label="Redirect URL" value={order.redirect_url || ''} onChange={(event) => setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, redirect_url: event.target.value } : item)))} />
                <TextArea label="Internal note" value={order.admin_note || ''} onChange={(event) => setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, admin_note: event.target.value } : item)))} />
                <ActionButton onClick={() => onSaveOrder(order)} className="w-full bg-green-600 text-white">
                  {saving === `order-${order.id}` ? 'Saving...' : 'Save order'}
                </ActionButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
