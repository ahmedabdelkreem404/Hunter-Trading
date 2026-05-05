import { SectionCard } from './shared/AdminUI'

export default function LeadsModule({ leads }) {
  return (
    <SectionCard title="العملاء المحتملون">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] text-sm">
          <thead>
            <tr className="text-right text-slate-400">
              <th className="pb-3">الاسم</th>
              <th className="pb-3">البريد الإلكتروني</th>
              <th className="pb-3">الهاتف</th>
              <th className="pb-3">المصدر</th>
              <th className="pb-3">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-white/10">
                <td className="py-3 text-white">{lead.name || '-'}</td>
                <td className="py-3 text-slate-300">{lead.email || '-'}</td>
                <td className="py-3 text-slate-300">{lead.phone || '-'}</td>
                <td className="py-3 text-slate-300">{lead.source || '-'}</td>
                <td className="py-3 text-slate-300">{lead.created_at || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}
