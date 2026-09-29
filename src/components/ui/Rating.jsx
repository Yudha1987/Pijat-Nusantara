export default function Rating({ value, reviews, light = false }) {
  return (
    <div className="flex items-center gap-1">
      <span className="flex items-center gap-0.5 text-amber-400" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.26 6.6.72-4.9 4.48 1.32 6.54L12 16.77 6.08 20l1.32-6.54L2.5 8.98l6.6-.72z" />
        </svg>
      </span>
      <span className={`text-sm font-bold ${light ? 'text-white' : 'text-slate-800'}`}>{value}</span>
      {reviews != null && (
        <span className={`text-xs ${light ? 'text-navy-200' : 'text-slate-400'}`}>({reviews} ulasan)</span>
      )}
    </div>
  )
}