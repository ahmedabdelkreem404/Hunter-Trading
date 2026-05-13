import { EmptyState, SectionCard, StatCard } from './shared/AdminUI'

export default function DashboardOverviewModule({ dashboard, servicesCount, pendingOrders }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="إجمالي العملاء" value={dashboard.stats?.total_leads ?? 0} />
        <StatCard label="عملاء اليوم" value={dashboard.stats?.leads_today ?? 0} />
        <StatCard label="الخدمات الظاهرة" value={dashboard.stats?.active_services ?? servicesCount ?? 0} />
        <StatCard label="تحديثات السوق" value={dashboard.stats?.total_market_updates ?? 0} />
        <StatCard label="آراء معتمدة" value={dashboard.stats?.approved_testimonials ?? 0} />
        <StatCard label="طلبات معلقة" value={pendingOrders ?? dashboard.stats?.pending_orders ?? 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="أحدث العملاء المحتملين">
          <div className="space-y-3">
            {(dashboard.recent_leads ?? []).length ? (
              (dashboard.recent_leads ?? []).map((lead) => (
                <div key={lead.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-cyan-300/20 hover:bg-slate-950/65">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-white">{lead.name || '-'}</div>
                      <div className="mt-1 truncate text-sm text-slate-300">{lead.email || '-'}</div>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">{lead.source || '-'}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{lead.created_at || '-'}</div>
                </div>
              ))
            ) : (
              <EmptyState title="لا يوجد عملاء حتى الآن" description="أي عميل يترك بياناته في الموقع سيظهر هنا." />
            )}
          </div>
        </SectionCard>

        <SectionCard title="أحدث طلبات الدفع">
          <div className="space-y-3">
            {(dashboard.recent_orders ?? []).length ? (
              (dashboard.recent_orders ?? []).map((order) => (
                <div key={order.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-cyan-300/20 hover:bg-slate-950/65">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-white">{order.customer_name || '-'}</div>
                      <div className="mt-1 truncate text-sm text-slate-300">{order.title_ar || order.title_en || '-'}</div>
                    </div>
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-200">{order.status || '-'}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{order.amount || '-'} • {order.created_at || '-'}</div>
                </div>
              ))
            ) : (
              <EmptyState title="لا توجد طلبات دفع" description="طلبات الدفع وإيصالات التحويل ستظهر هنا بعد إرسال العميل للطلب." />
            )}
          </div>
        </SectionCard>
      </div>
    </>
  )
}
