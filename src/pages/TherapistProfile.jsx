import { Link, useParams } from 'react-router-dom'
import TherapistCard from '../components/therapists/TherapistCard.jsx'
import Rating from '../components/ui/Rating.jsx'
import { useData } from '../context/DataContext.jsx'
import { telLink, waLink } from '../utils/contact.js'
import { avatarFallback } from '../utils/image.js'

export default function TherapistProfile() {
  const { id } = useParams()
  const { data } = useData()
  const therapist = data.therapists.find((t) => String(t.id) === String(id))

  if (!therapist) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-5xl" aria-hidden="true">🧑‍⚕️</p>
        <h1 className="mt-4 text-2xl font-extrabold text-navy-950">Terapis tidak ditemukan</h1>
        <p className="mt-2 text-sm text-slate-500">
          Profil pemijat yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <Link
          to="/pemijat"
          className="mt-6 inline-block rounded-xl bg-navy-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-navy-800"
        >
          Kembali ke Daftar Pemijat
        </Link>
      </section>
    )
  }

  const others = data.therapists.filter((t) => t.id !== therapist.id).slice(0, 3)
  const bookingHref = waLink(therapist.phone)

  const meta = [
    { label: 'Jenis Kelamin', value: therapist.gender || '—', icon: '👤' },
    { label: 'Wilayah Layanan', value: therapist.area || '—', icon: '📍' },
    { label: 'Pengalaman', value: `${therapist.experience} tahun`, icon: '⏳' },
    { label: 'Jumlah Ulasan', value: `${therapist.reviews ?? 0} ulasan`, icon: '⭐' },
  ]

  return (
    <>
      {/* Header profil */}
      <header className="bg-navy-950 py-12 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link to="/pemijat" className="text-sm font-bold text-navy-300 transition hover:text-white">
            ← Kembali ke Daftar Pemijat
          </Link>
          <div className="mt-8 flex flex-col items-start gap-8 lg:flex-row lg:items-center">
            <img
              src={therapist.photo}
              alt={`Foto ${therapist.name}`}
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = avatarFallback(therapist.name)
              }}
              className="h-36 w-36 rounded-3xl border-4 border-white/20 object-cover shadow-2xl lg:h-44 lg:w-44"
            />
            <div>
              <p className="inline-flex items-center rounded-full border border-navy-500/40 bg-navy-800/60 px-4 py-1.5 text-xs font-semibold text-navy-100">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                Terapis Aktif
              </p>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight lg:text-4xl">{therapist.name}</h1>
              <p className="mt-2 text-lg font-semibold text-navy-200">{therapist.specialty}</p>
              <div className="mt-4">
                <Rating value={therapist.rating} reviews={therapist.reviews} light />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-extrabold text-navy-950">Tentang {therapist.name}</h2>
            <p className="mt-3 text-base leading-8 text-slate-600">
              {therapist.bio ||
                `Terapis berpengalaman ${therapist.experience} tahun dengan keahlian ${therapist.specialty}. Melayani area ${therapist.area} dan sekitarnya.`}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {meta.map((m) => (
                <div key={m.label} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-xl" aria-hidden="true">
                    {m.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">{m.label}</p>
                    <p className="text-sm font-bold text-navy-950">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kartu kontak */}
          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h3 className="text-base font-bold text-navy-950">Hubungi Terapis</h3>
            <p className="mt-1 text-sm text-slate-500">Pesan langsung atau hubungi via telepon.</p>
            <div className="mt-5 space-y-3">
              <a
                href={bookingHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-navy-900 py-3 text-sm font-bold text-white transition hover:bg-navy-800"
              >
                <span aria-hidden="true">💬</span> Pesan via WhatsApp
              </a>
              <a
                href={telLink(therapist.phone)}
                className="flex items-center justify-center gap-2 rounded-xl border border-navy-900 py-3 text-sm font-bold text-navy-900 transition hover:bg-navy-50"
              >
                <span aria-hidden="true">📞</span> {therapist.phone}
              </a>
              <Link
                to="/layanan"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:border-navy-900 hover:text-navy-900"
              >
                Lihat Katalog Layanan
              </Link>
            </div>
          </aside>
        </div>

        {others.length > 0 && (
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold text-navy-950">Pemijat Lainnya</h2>
              <Link to="/pemijat" className="text-sm font-bold text-navy-600 transition hover:text-navy-900">
                Lihat Semua →
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((t) => (
                <TherapistCard key={t.id} therapist={t} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  )
}