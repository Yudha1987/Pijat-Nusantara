import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/format.js'

export default function NewsCard({ item }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg">
      <Link to={`/berita/${item.id}`} className="block">
        <img
          src={item.image}
          alt={item.title}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/images/news/berita-default.svg'
          }}
          className="aspect-[16/9] w-full object-cover"
          loading="lazy"
        />
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">
            {item.category}
          </span>
          <span className="text-xs text-slate-400">{formatDate(item.date)}</span>
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug text-navy-950">
          <Link to={`/berita/${item.id}`} className="hover:text-navy-600">
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.excerpt}</p>
        <Link
          to={`/berita/${item.id}`}
          className="mt-4 inline-block text-sm font-bold text-navy-600 hover:text-navy-900"
        >
          Baca selengkapnya →
        </Link>
      </div>
    </article>
  )
}