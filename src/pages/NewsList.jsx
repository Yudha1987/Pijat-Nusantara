import { useMemo, useState } from 'react'
import NewsCard from '../components/news/NewsCard.jsx'
import PageHero from '../components/ui/PageHero.jsx'
import { useData } from '../context/DataContext.jsx'

export default function NewsList() {
  const { data } = useData()
  const [active, setActive] = useState('Semua')

  const categories = useMemo(() => {
    const set = new Set(data.news.map((n) => n.category))
    return ['Semua', ...set]
  }, [data.news])

  const filtered = useMemo(
    () =>
      active === 'Semua'
        ? data.news
        : data.news.filter((n) => n.category === active),
    [active, data.news],
  )

  return (
    <>
      <PageHero
        eyebrow="Berita & Informasi"
        title="Kabar Pijat Nusantara"
        description="Informasi terbaru, promo, dan tips kesehatan seputar pijat tradisional dari tim kami."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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

        {filtered.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-16 text-center">
            <p className="text-4xl" aria-hidden="true">📰</p>
            <p className="mt-4 text-base font-bold text-navy-950">Belum ada berita</p>
            <p className="mt-1 text-sm text-slate-500">
              Belum ada berita pada kategori ini.
            </p>
          </div>
        )}
      </section>
    </>
  )
}