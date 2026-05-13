import { EmptyState, SectionCard } from './shared/AdminUI'

export default function LeadsModule({ leads }) {
  return (
    <SectionCard title="العملاء المحتملون">
      {leads.length === 0 ? (
        <EmptyState title="لا يوجد عملاء محتملون" description="أي بيانات يرسلها العميل من الموقع ستظهر هنا." />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {leads.map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <div className="font-bold text-white">{lead.name || '-'}</div>
                <div className="mt-2 space-y-1 text-sm text-slate-300">
                  <div>{lead.email || '-'}</div>
                  <div>{lead.phone || '-'}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-bold text-cyan-100">{lead.source || '-'}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-400">{lead.created_at || '-'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-right text-slate-400">
                  <th className="pb-3">الاسم</th>
                  <th className="pb-3">البريد الإلكتروني</th>
                  <th className="pb-3">الهاتف</th>
                  <th className="pb-3">المصدر</th>
                  <th className="pb-3">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/10 transition hover:bg-white/[0.03]">
                    <td className="py-3 font-bold text-white">{lead.name || '-'}</td>
                    <td className="py-3 text-slate-300">{lead.email || '-'}</td>
                    <td className="py-3 text-slate-300">{lead.phone || '-'}</td>
                    <td className="py-3 text-slate-300">{lead.source || '-'}</td>
                    <td className="py-3 text-slate-300">{lead.created_at || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </SectionCard>
  )
}
