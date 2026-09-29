import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext.jsx'

export default function AdminDashboard() {
  const { data } = useData()

  const cards = [
    {
      label: 'Total Terapis',
      value: data.therapists.length,
      sub: 'terapis aktif',
      link: '/admin/terapis',
      icon: '🧑‍⚕️',
    },
    {
      label: 'Total Berita',
      value: data.news.length,
      sub: 'artikel terbit',
      link: '/admin/berita',
      icon: '📰',
    },
    {
      label: 'Jenis Layanan',
      value: data.services.length,
      sub: 'di katalog',
      link: '/admin/layanan',
      icon: '💆',
    },
    {
      label: 'Foto Slider',
      value: (data.site.slides || []).length,
      sub: 'di galeri beranda',
      link: '/admin/slider',
      icon: '📸',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy-950 lg:text-3xl">Dashboard Admin</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ringkasan konten dan statistik kelola Pijat Nusantara.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.link}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-xl" aria-hidden="true">
                {c.icon}
              </span>
              <span className="text-xs font-semibold text-navy-600">Lihat →</span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-navy-950">{c.value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{c.label}</p>
            <p className="text-xs text-slate-400">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Terapis terbaru */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-950">Terapis Terdaftar</h2>
            <Link
              to="/admin/terapis"
              className="text-xs font-bold text-navy-600 hover:text-navy-900"
            >
              Kelola →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {data.therapists.slice(0, 4).map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <img
                  src={t.photo}
                  alt=""
                  className="h-11 w-11 rounded-full"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="truncate text-xs text-slate-400">{t.specialty}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                  ★ {t.rating}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Berita terbaru */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-950">Berita Terakhir</h2>
            <Link
              to="/admin/berita"
              className="text-xs font-bold text-navy-600 hover:text-navy-900"
            >
              Kelola →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {data.news.slice(0, 4).map((n) => (
              <li key={n.id} className="flex items-center gap-3 py-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-navy-50">
                  <img src={n.image} alt="" className="h-full w-full object-cover" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">{n.title}</p>
                  <p className="text-xs text-slate-400">{n.category}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-700">
        💡 Catatan MVP: data disimpan di <code className="font-bold">localStorage</code> peramban.
        Untuk produksi, hubungkan modul ini ke API & database (mis. Express + PostgreSQL/MongoDB).
      </p>
    </div>
  )
}