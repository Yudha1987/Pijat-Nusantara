export default function StatCard({ icon, value, label, hint }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-2xl">
        <span aria-hidden="true">{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-extrabold text-navy-950">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}