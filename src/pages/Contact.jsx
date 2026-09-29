import { useState } from 'react'
import PageHero from '../components/ui/PageHero.jsx'
import { useData } from '../context/DataContext.jsx'
import { waLink } from '../utils/contact.js'

const initialForm = { name: '', email: '', phone: '', subject: 'Pertanyaan Umum', message: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Nama wajib diisi.'
  if (!form.email.trim()) {
    errors.email = 'Email wajib diisi.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format email tidak valid.'
  }
  if (!form.phone.trim()) {
    errors.phone = 'Nomor telepon wajib diisi.'
  } else if (!/^[0-9+\-\s]{9,15}$/.test(form.phone.trim())) {
    errors.phone = 'Nomor telepon tidak valid.'
  }
  if (!form.message.trim()) errors.message = 'Pesan wajib diisi.'
  else if (form.message.trim().length < 10)
    errors.message = 'Pesan minimal 10 karakter.'
  return errors
}

const inputCls = (hasError) =>
  `w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 ${
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-navy-500 focus:ring-navy-100'
  }`

export default function Contact() {
  const { data } = useData()
  const { contact } = data.site
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const infoCards = [
    { icon: '📍', title: 'Alamat', lines: [contact.address] },
    { icon: '📞', title: 'Telepon / WA', lines: [contact.phone] },
    { icon: '✉️', title: 'Email', lines: [contact.email] },
    { icon: '🕐', title: 'Jam Operasional', lines: contact.hours },
  ]
  const whatsappHref = waLink(contact.phone)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setSubmitted(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
      setForm(initialForm)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Hubungi Kami"
        title="Mari Terhubung"
        description="Punya pertanyaan atau ingin memesan layanan? Kirim pesan dan tim kami akan segera merespons."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Info kontak */}
          <div className="space-y-4 lg:col-span-2">
            {infoCards.map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-2xl" aria-hidden="true">
                  {c.icon}
                </span>
                <div>
                  <p className="text-sm font-bold text-navy-950">{c.title}</p>
                  {c.lines.map((line) => (
                    <p key={line} className="mt-0.5 text-sm text-slate-500">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-navy-950 p-6 text-white">
              <p className="text-sm font-bold uppercase tracking-wider text-navy-300">
                Respons Cepat
              </p>
              <p className="mt-2 text-sm leading-relaxed text-navy-100">
                Butuh jawaban instan? Hubungi kami langsung via WhatsApp dan dapatkan
                balasan maksimal 15 menit selama jam operasional.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                💬 Chat WhatsApp
              </a>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3"
          >
            <h2 className="text-2xl font-extrabold text-navy-950">Kirim Pesan</h2>
            <p className="mt-1 text-sm text-slate-500">
              Isi formulir di bawah, kami akan membalas melalui email atau telepon.
            </p>

            {submitted && (
              <div
                role="status"
                className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
              >
                <span aria-hidden="true" className="text-xl">✅</span>
                <div>
                  <p className="font-bold">Pesan terkirim!</p>
                  <p className="mt-0.5">
                    Terima kasih telah menghubungi kami. Tim Pijat Nusantara akan segera
                    merespons Anda.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Budi Santoso"
                  className={inputCls(errors.name)}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className={inputCls(errors.email)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Nomor Telepon
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="08xx-xxxx-xxxx"
                  className={inputCls(errors.phone)}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="mt-1 text-xs font-medium text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Topik Pesan
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={inputCls(false)}
                >
                  <option>Pertanyaan Umum</option>
                  <option>Pemesanan Pijat ke Rumah</option>
                  <option>Kerja Sama / Mitra</option>
                  <option>Masukan & Keluhan</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tulis kebutuhan atau pertanyaan Anda di sini…"
                  className={`${inputCls(errors.message)} resize-y`}
                  aria-invalid={!!errors.message}
                />
                {errors.message && <p className="mt-1 text-xs font-medium text-red-500">{errors.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-navy-900 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-800 active:scale-[0.99] sm:w-auto sm:px-10"
            >
              Kirim Pesan
            </button>
          </form>
        </div>
      </section>
    </>
  )
}