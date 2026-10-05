import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PhotoSlider from '../components/slider/PhotoSlider.jsx'
import TherapistCard from '../components/therapists/TherapistCard.jsx'
import SectionTitle from '../components/ui/SectionTitle.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import { useData } from '../context/DataContext.jsx'
import { useSectionNav } from '../hooks/useSectionNav.js'
import { formatPrice, waLink } from '../utils/contact.js'
import { formatDate } from '../utils/format.js'
import { VT } from '../utils/viewTransition.js'

const stats = [
  { icon: '🧑‍⚕️', value: '6', label: 'Terapis Berpengalaman', hint: 'Rata-rata 13 tahun praktik' },
  { icon: '💆', value: '8', label: 'Jenis Layanan', hint: 'Refleksi, urut, bekam & lainnya' },
  { icon: '⭐', value: '4.8', label: 'Rating Pelanggan', hint: 'Dari 1.100+ ulasan' },
  { icon: '😊', value: '2.400+', label: 'Pelanggan Puas', hint: 'Sejak tahun 2015' },
]

const highlights = [
  {
    icon: '🤲',
    title: 'Teknik Warisan Leluhur',
    text: 'Menggunakan metode pijat tradisional khas Indonesia yang terbukti turun-temurun.',
  },
  {
    icon: '🌿',
    title: 'Minyak Herbal Alami',
    text: 'Racikan minyak dan rempah pilihan tanpa pewangi sintetis untuk kenyamanan maksimal.',
  },
  {
    icon: '🧑‍⚕️',
    title: 'Terapis Tersertifikasi',
    text: 'Seluruh terapis berpengalaman, ramah, dan memahami kebutuhan tiap pelanggan.',
  },
  {
    icon: '📱',
    title: 'Booking Mudah',
    text: 'Hubungi langsung terapis favorit Anda via WhatsApp atau telepon, tanpa biaya tambahan.',
  },
]

const testimonials = [
  {
    name: 'Budi Hartanto',
    role: 'Pelanggan Setia',
    text: 'Pijat urutnya benar-benar meredakan pegal saya yang kerja di kantoran. Minyak rempahnya wangi alami.',
  },
  {
    name: 'Dewi Lestari',
    role: 'Ibu dari 2 anak',
    text: 'Terapisnya sangat telaten untuk pijat bayi. Anak saya tidurnya jadi nyenyak dan jarang rewel.',
  },
  {
    name: 'Rahmat Hidayat',
    role: 'Atlet Amatir',
    text: 'Pijat olahraganya oke banget, recovery otot jadi cepat setelah latihan dan lari.',
  },
]

export default function Dashboard() {
  const { data } = useData()
  const site = data.site
  const contact = site.contact
  const featuredTherapists = data.therapists.slice(0, 3)
  const featuredServices = data.services.slice(0, 4)
  const latestNews = data.news.slice(0, 3)
  const bookingHref = waLink(contact.phone)
  const goToSection = useSectionNav()
  const location = useLocation()
  const navigate = useNavigate()
  const pendingScroll = location.state?.scrollTo

  useEffect(() => {
    if (!pendingScroll) return
    let frame = requestAnimationFrame(() => {
      const el = document.getElementById(pendingScroll)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }
    })
    navigate(location.pathname, { replace: true, state: null })
    return () => cancelAnimationFrame(frame)
  }, [pendingScroll, location.pathname, navigate])

  return (
    <>
      {/* Hero */}
      <section id="beranda" className="relative scroll-mt-24 overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-navy-700/40 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-navy-500/30 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-navy-500/40 bg-navy-800/60 px-4 py-1.5 text-xs font-semibold text-navy-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Terapis siap dipanggil hari ini
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {site.heroTitle}{' '}
              <span className="text-accent">{site.heroHighlight}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-200">
              {site.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => goToSection('pemijat')}
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-navy-950 shadow-lg transition hover:bg-navy-100"
              >
                Lihat Terapis
              </button>
              <button
                type="button"
                onClick={() => goToSection('layanan')}
                className="rounded-xl border border-navy-400/60 px-6 py-3 text-sm font-bold text-white transition hover:bg-navy-800"
              >
                Lihat Layanan
              </button>
            </div>
          </div>

          {/* Kartu booking mock */}
          <div className="relative hidden lg:block">
            <div className="mx-auto max-w-sm rounded-3xl bg-white p-6 text-slate-800 shadow-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-navy-600">
                Jadwal Terdekat
              </p>
              <p className="mt-3 text-2xl font-extrabold text-navy-950">Hari Ini, 16.00</p>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <img
                  src={data.therapists[0]?.photo}
                  alt=""
                  className="h-12 w-12 rounded-full"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  {data.therapists[0] ? (
                    <Link
                      {...VT}
                      to={`/pemijat/${data.therapists[0].id}`}
                      className="block truncate text-sm font-bold transition hover:text-navy-600"
                    >
                      {data.therapists[0].name}
                    </Link>
                  ) : (
                    <p className="text-sm font-bold">Terapis</p>
                  )}
                  <p className="truncate text-xs text-slate-500">{data.therapists[0]?.specialty}</p>
                </div>
                <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  KONFIRMASI
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs text-slate-400">Pijat Refleksi · 60 menit</p>
                  <p className="text-lg font-extrabold text-navy-950">{formatPrice(60000)}</p>
                </div>
                <span className="text-2xl" aria-hidden="true">💆‍♀️</span>
              </div>
            </div>
            <div aria-hidden="true" className="absolute -right-6 -top-6 -z-10 h-40 w-40 rounded-full bg-navy-500/40 blur-2xl" />
            <div aria-hidden="true" className="absolute -bottom-8 -left-8 -z-10 h-48 w-48 rounded-full bg-navy-300/30 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* Keunggulan */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Mengapa Kami"
            title="Perawatan yang Menyehatkan, Pelayanan yang Menenangkan"
            description="Kami memadukan tradisi, pengalaman, dan sentuhan profesional untuk pengalaman pijat terbaik."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-3xl">
                  <span aria-hidden="true">{h.icon}</span>
                </div>
                <h3 className="mt-4 text-base font-bold text-navy-950">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri kegiatan */}
      {site.slides?.length > 0 && (
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              eyebrow="Dokumentasi"
              title="Galeri Kegiatan Kami"
              description="Momen perawatan terapis bersama pelanggan, dari pijat tradisional hingga terapi khusus."
            />
            <PhotoSlider
              slides={site.slides}
              className="mt-12"
            />
          </div>
        </section>
      )}

      {/* Terapis unggulan */}
      <section id="pemijat" className="scroll-mt-24 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              align="left"
              eyebrow="Tim Kami"
              title="Terapis Unggulan"
              description="Pilih terapis favorit Anda dan hubungi langsung untuk pemesanan."
            />
            <Link
              {...VT}
              to="/pemijat"
              className="rounded-xl border border-navy-900 px-5 py-2.5 text-sm font-bold text-navy-900 transition hover:bg-navy-900 hover:text-white"
            >
              Lihat Semua →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTherapists.map((t) => (
              <TherapistCard key={t.id} therapist={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Layanan unggulan */}
      <section id="layanan" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              align="left"
              eyebrow="Katalog Layanan"
              title="Layanan Populer"
              description="Mulai dari pijat relaksasi hingga terapi khusus. Tarif transparan tanpa biaya tersembunyi."
            />
            <Link
              {...VT}
              to="/layanan"
              className="rounded-xl border border-navy-900 px-5 py-2.5 text-sm font-bold text-navy-900 transition hover:bg-navy-900 hover:text-white"
            >
              Katalog Lengkap →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredServices.map((s) => (
              <div
                key={s.id}
                className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <span className="text-3xl" aria-hidden="true">{s.icon}</span>
                <h3 className="mt-4 text-base font-bold text-navy-950">{s.name}</h3>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  {s.category} · {s.duration} menit
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                  {s.description}
                </p>
                <p className="mt-4 text-xl font-extrabold text-navy-950">
                  {formatPrice(s.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Berita terbaru */}
      {latestNews.length > 0 && (
<section id="berita" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              align="left"
              eyebrow="Berita & Informasi"
              title="Kabar Terbaru"
              description="Ikuti promo, tips kesehatan, dan kabar dari Pijat Nusantara."
            />
            <Link
              {...VT}
              to="/berita"
              className="rounded-xl border border-navy-900 px-5 py-2.5 text-sm font-bold text-navy-900 transition hover:bg-navy-900 hover:text-white"
            >
              Semua Berita →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((n) => (
              <article
                key={n.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <Link {...VT} to={`/berita/${n.id}`} className="block">
                    <img
                      src={n.image}
                      alt={n.title}
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
                        {n.category}
                      </span>
                      <span className="text-xs text-slate-400">{formatDate(n.date)}</span>
                    </div>
                    <h3 className="mt-3 text-base font-bold leading-snug text-navy-950">
                      <Link {...VT} to={`/berita/${n.id}`} className="hover:text-navy-600">
                        {n.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimoni */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Testimoni"
            title="Apa Kata Pelanggan Kami"
            description="Kepuasan pelanggan adalah bukti nyata kualitas layanan kami."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex gap-1 text-amber-400" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.26 6.6.72-4.9 4.48 1.32 6.54L12 16.77 6.08 20l1.32-6.54L2.5 8.98l6.6-.72z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-slate-600">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-950">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section id="kontak" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Kontak"
            title="Hubungi Kami"
            description="Kunjungi studio kami atau hubungi langsung untuk memesan sesi pijat."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50 text-2xl" aria-hidden="true">
                📍
              </div>
              <h3 className="mt-4 text-base font-bold text-navy-950">Alamat Studio</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{contact.address}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50 text-2xl" aria-hidden="true">
                🕘
              </div>
              <h3 className="mt-4 text-base font-bold text-navy-950">Jam Buka</h3>
              {contact.hours.map((line) => (
                <p key={line} className="mt-2 text-sm leading-relaxed text-slate-500">
                  {line}
                </p>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50 text-2xl" aria-hidden="true">
                📞
              </div>
              <h3 className="mt-4 text-base font-bold text-navy-950">Telepon &amp; Email</h3>
              <a
                href={bookingHref}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block text-sm font-semibold text-navy-900 hover:underline"
              >
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="mt-1 block text-sm text-slate-500 hover:text-navy-900"
              >
                {contact.email}
              </a>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={bookingHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600"
            >
              💬 Booking via WhatsApp
            </a>
            <Link
              {...VT}
              to="/kontak"
              className="rounded-xl border border-navy-900 px-6 py-3 text-sm font-bold text-navy-900 transition hover:bg-navy-900 hover:text-white"
            >
              Form &amp; Peta Lengkap →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-950 py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => goToSection('beranda')}
            className="text-xs font-bold uppercase tracking-wider text-navy-300 transition hover:text-white"
          >
            ↑ Kembali ke atas
          </button>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Siap Merasakan Relaksasi Sejati?
          </h2>
          <p className="max-w-2xl text-navy-200">
            Booking sekarang melalui WhatsApp atau kunjungi studio kami. Tim kami siap
            melayani Anda setiap hari.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={bookingHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600"
            >
              💬 Booking via WhatsApp
            </a>
            <button
              type="button"
              onClick={() => goToSection('kontak')}
              className="rounded-xl border border-navy-400/60 px-6 py-3 text-sm font-bold text-white transition hover:bg-navy-800"
            >
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>
    </>
  )
}