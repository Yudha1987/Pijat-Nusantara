import { Link, useParams } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { formatDate } from '../utils/format.js'

export default function NewsDetail() {
  const { id } = useParams()
  const { data } = useData()
  const item = data.news.find((n) => String(n.id) === String(id))

  if (!item) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-5xl" aria-hidden="true">📰</p>
        <h1 className="mt-4 text-2xl font-extrabold text-navy-950">Berita tidak ditemukan</h1>
        <p className="mt-2 text-sm text-slate-500">
          Artikel yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <Link
          to="/berita"
          className="mt-6 inline-block rounded-xl bg-navy-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-navy-800"
        >
          Kembali ke Berita
        </Link>
      </section>
    )
  }

  const others = data.news
    .filter((n) => String(n.id) !== String(item.id))
    .slice(0, 3)

  return (
    <>
      <article>
        {/* Hero artikel */}
        <header className="bg-navy-950 py-16 text-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Link
              to="/berita"
              className="text-sm font-bold text-navy-300 hover:text-white"
            >
              ← Kembali ke Berita
            </Link>
            <p className="mt-6 text-sm font-bold uppercase tracking-wider text-navy-300">
              {item.category}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {item.title}
            </h1>
            <p className="mt-4 text-sm text-navy-200">
              Oleh {item.author} · {formatDate(item.date)}
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <img
            src={item.image}
            alt={item.title}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/images/news/berita-default.svg'
            }}
            className="aspect-[16/9] w-full rounded-2xl object-cover shadow-sm"
          />

          <div className="mt-8 space-y-5">
            {item.content.split('\n\n').map((para, i) => (
              <p
                key={i}
                className="text-base leading-8 text-slate-600 sm:text-lg sm:leading-9"
              >
                {para}
              </p>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-navy-100 bg-navy-50 p-6">
            <p className="text-base font-bold text-navy-950">
              Ingin mencoba layanan kami?
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Pilih terapis favorit atau lihat katalog layanan lengkap kami.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/pemijat"
                className="rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800"
              >
                Lihat Terapis
              </Link>
              <Link
                to="/layanan"
                className="rounded-xl border border-navy-900 px-5 py-2.5 text-sm font-bold text-navy-900 transition hover:bg-navy-50"
              >
                Katalog Layanan
              </Link>
            </div>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-navy-950">Berita Lainnya</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((n) => (
                <Link
                  key={n.id}
                  to={`/berita/${n.id}`}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <img
                    src={n.image}
                    alt={n.title}
                    className="aspect-[16/9] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <span className="text-xs text-slate-400">{formatDate(n.date)}</span>
                    <h3 className="mt-2 text-sm font-bold leading-snug text-navy-950 group-hover:text-navy-600">
                      {n.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}