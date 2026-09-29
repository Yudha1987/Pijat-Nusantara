import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero.jsx'
import { useData } from '../context/DataContext.jsx'
import { formatPrice } from '../utils/contact.js'

export default function Services() {
  const { data } = useData()
  const [active, setActive] = useState('Semua')

  const categories = useMemo(() => {
    const set = new Set(data.services.map((s) => s.category))
    return ['Semua', ...set]
  }, [data.services])

  const filtered = useMemo(
    () =>
      active === 'Semua'
        ? data.services
        : data.services.filter((s) => s.category === active),
    [active, data.services],
  )

  return (
    <>
      <PageHero
        eyebrow="Katalog Layanan"
        title="Layanan & Harga"
        description="Pilih layanan sesuai kebutuhan Anda. Harga transparan, durasi jelas, dan bisa dipesan langsung."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filter kategori */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                active === cat
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-navy-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid layanan */}
        {filtered.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((s) => (
              <article
                key={s.id}
                className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-2xl" aria-hidden="true">
                    {s.icon}
                  </span>
                  <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">
                    {s.category}
                  </span>
                </div>

                <h2 className="mt-5 text-lg font-bold text-navy-950">{s.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{s.description}</p>

                <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Durasi</dt>
                    <dd className="font-semibold text-slate-700">{s.duration} menit</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Harga</dt>
                    <dd className="text-lg font-extrabold text-navy-950">{formatPrice(s.price)}</dd>
                  </div>
                </dl>

                <Link
                  to="/kontak"
                  className="mt-5 rounded-xl bg-navy-900 py-2.5 text-center text-sm font-bold text-white transition hover:bg-navy-800"
                >
                  Pesan Layanan
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-16 text-center">
            <p className="text-4xl" aria-hidden="true">💆</p>
            <p className="mt-4 text-base font-bold text-navy-950">Belum ada layanan</p>
            <p className="mt-1 text-sm text-slate-500">Belum ada layanan pada kategori ini.</p>
          </div>
        )}

        {/* Catatan */}
        <p className="mt-10 text-center text-sm text-slate-400">
          * Harga dapat berbeda untuk panggilan ke rumah / hotel. Hubungi kami untuk penawaran khusus.
        </p>
      </section>
    </>
  )
}