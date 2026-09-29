import { useMemo, useState } from 'react'
import TherapistCard from '../components/therapists/TherapistCard.jsx'
import PageHero from '../components/ui/PageHero.jsx'
import { useData } from '../context/DataContext.jsx'

export default function Therapists() {
  const { data } = useData()
  const [query, setQuery] = useState('')
  const [gender, setGender] = useState('Semua')
  const [sort, setSort] = useState('rating')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = data.therapists.filter((t) => {
      const matchQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.specialty.toLowerCase().includes(q) ||
        t.area.toLowerCase().includes(q)
      const matchGender = gender === 'Semua' || t.gender === gender
      return matchQuery && matchGender
    })
    result = [...result].sort((a, b) =>
      sort === 'rating' ? b.rating - a.rating : b.experience - a.experience,
    )
    return result
  }, [query, gender, sort, data.therapists])

  return (
    <>
      <PageHero
        eyebrow="Tim Kami"
        title="Daftar Pemijat"
        description="Cari dan hubungi langsung terapis pilihan Anda. Semua terapis berpengalaman dan ramah."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filter */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Cari pemijat</span>
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, keahlian, atau wilayah…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-navy-500 focus:bg-white focus:ring-2 focus:ring-navy-100"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {['Semua', 'Laki-laki', 'Perempuan'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  gender === g
                    ? 'bg-navy-900 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-navy-50'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Urutkan"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-navy-500"
          >
            <option value="rating">Terpopuler (rating)</option>
            <option value="experience">Paling berpengalaman</option>
          </select>
        </div>

        {/* Hasil */}
        <p className="mt-6 text-sm font-semibold text-slate-500">
          {filtered.length} terapis ditemukan
        </p>

        {filtered.length > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <TherapistCard key={t.id} therapist={t} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-16 text-center">
            <p className="text-4xl" aria-hidden="true">🔍</p>
            <p className="mt-4 text-base font-bold text-navy-950">Tidak ada terapis ditemukan</p>
            <p className="mt-1 text-sm text-slate-500">
              Coba ubah kata kunci pencarian atau filter Anda.
            </p>
          </div>
        )}
      </section>
    </>
  )
}