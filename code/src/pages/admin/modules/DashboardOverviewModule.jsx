import { SectionCard, StatCard } from './shared/AdminUI'

export default function DashboardOverviewModule({ dashboard, servicesCount, pendingOrders }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total leads" value={dashboard.stats?.total_leads ?? 0} />
        <StatCard label="Leads today" value={dashboard.stats?.leads_today ?? 0} />
        <StatCard label="Visible services" value={dashboard.stats?.active_services ?? servicesCount ?? 0} />
        <StatCard label="Market updates" value={dashboard.stats?.total_market_updates ?? 0} />
        <StatCard label="Approved reviews" value={dashboard.stats?.approved_testimonials ?? 0} />
        <StatCard label="Pending orders" value={pendingOrders ?? dashboard.stats?.pending_orders ?? 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Recent leads">
          <div className="space-y-3">
            {(dashboard.recent_leads ?? []).map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="font-semibold text-white">{lead.name || '-'}</div>
                <div className="mt-1 text-sm text-slate-300">{lead.email || '-'}</div>
                <div className="mt-1 text-xs text-slate-500">{lead.source || '-'} • {lead.created_at}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent payment orders">
          <div className="space-y-3">
            {(dashboard.recent_orders ?? []).map((order) => (
              <div key={order.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="font-semibold text-white">{order.customer_name || '-'}</div>
                <div className="mt-1 text-sm text-slate-300">{order.title_ar || order.title_en || '-'}</div>
                <div className="mt-1 text-xs text-slate-500">{order.status} • {order.amount} • {order.created_at}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  )
}
