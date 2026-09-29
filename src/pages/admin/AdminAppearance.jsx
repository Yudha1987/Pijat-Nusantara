import { useState } from 'react'
import { getDefaultSite, useData } from '../../context/DataContext.jsx'
import { readImageFile } from '../../utils/image.js'
import {
  applyPalette,
  deriveAccent,
  generateScale,
  presets,
} from '../../utils/color.js'

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {hint && <span className="ml-1 font-normal text-slate-400">({hint})</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-navy-500 focus:bg-white focus:ring-2 focus:ring-navy-100'

function LogoPicker({ value, onChange }) {
  const [preview, setPreview] = useState(value || '')
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await readImageFile(file, 320, { png: true })
      setPreview(dataUrl)
      setError('')
      onChange(dataUrl)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-40 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
          {preview ? (
            <img src={preview} alt="Pratinjau logo" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-3xl" aria-hidden="true">🏷️</span>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800">
              {preview ? 'Ganti Logo' : 'Unggah Logo'}
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview('')
                  onChange(null)
                }}
                className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Hapus Logo
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Logo tampil di navbar (header) dan footer menggantikan ikon bawaan. Bentuk &
            transparansi asli dipertahankan (disimpan sebagai PNG).
          </p>
        </div>
      </div>
      {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}

export default function AdminAppearance() {
  const { data, updateSite, resetSite } = useData()
  const site = data.site

  const [form, setForm] = useState({
    brandName: site.brandName,
    brandHighlight: site.brandHighlight,
    tagline: site.tagline,
    heroTitle: site.heroTitle,
    heroHighlight: site.heroHighlight,
    heroDescription: site.heroDescription,
    logo: site.logo || null,
    palette: { ...site.palette },
    accent: site.accent,
    customBase: '#16255f',
    contact: { ...site.contact },
  })
  const [saved, setSaved] = useState(false)
  const [activePreset, setActivePreset] = useState(
    () => Object.keys(presets).find((k) => presets[k].accent === site.accent) || 'navy',
  )

  const applyToLive = (palette, accent) => {
    applyPalette(palette, accent)
    setForm((f) => ({ ...f, palette: { ...palette }, accent }))
  }

  const flashSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const choosePreset = (key) => {
    const p = presets[key]
    setActivePreset(key)
    applyToLive(p.scale, p.accent)
    // Auto-simpan warna tema agar tetap terpilih setelah refresh.
    updateSite({ palette: { ...p.scale }, accent: p.accent })
    flashSaved()
  }

  const chooseCustom = (baseHex) => {
    if (!baseHex) return
    setActivePreset('custom')
    const scale = generateScale(baseHex)
    applyToLive(scale, deriveAccent(baseHex))
    setForm((f) => ({ ...f, customBase: baseHex }))
    // Auto-simpan warna tema kustom agar tetap terpilih setelah refresh.
    updateSite({ palette: { ...scale }, accent: deriveAccent(baseHex) })
    flashSaved()
  }

  const reset = () => {
    if (!window.confirm('Kembalikan semua pengaturan tampilan ke bawaan?')) return
    const def = getDefaultSite()
    setActivePreset('navy')
    setForm({
      brandName: def.brandName,
      brandHighlight: def.brandHighlight,
      tagline: def.tagline,
      heroTitle: def.heroTitle,
      heroHighlight: def.heroHighlight,
      heroDescription: def.heroDescription,
      logo: def.logo || null,
      palette: { ...def.palette },
      accent: def.accent,
      customBase: '#16255f',
      contact: { ...def.contact, hours: [...def.contact.hours] },
    })
    applyPalette(def.palette, def.accent)
    resetSite()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSave = (e) => {
    e.preventDefault()
    updateSite({
      brandName: form.brandName.trim() || 'Pijat',
      brandHighlight: form.brandHighlight.trim() || 'Nusantara',
      tagline: form.tagline.trim(),
      heroTitle: form.heroTitle.trim(),
      heroHighlight: form.heroHighlight.trim(),
      heroDescription: form.heroDescription.trim(),
      logo: form.logo || null,
      palette: form.palette,
      accent: form.accent,
      contact: form.contact,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 lg:text-3xl">
            Pengaturan Tampilan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ubah identitas, warna tema, teks hero, dan info kontak website. Perubahan
            tampil secara langsung di seluruh halaman.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Reset Bawaan
        </button>
      </div>

      {saved && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          ✅ Perubahan berhasil disimpan dan langsung diterapkan.
        </div>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        {/* Warna */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-navy-950">Warna Tema</h2>
          <p className="mt-1 text-xs text-slate-400">
            Pilih preset siap pakai atau buat warna kustom dengan base color.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Object.entries(presets).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => choosePreset(key)}
                className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left text-xs font-bold transition ${
                  activePreset === key
                    ? 'border-navy-900 bg-navy-50 text-navy-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="flex gap-1">
                  {['50', '300', '600', '900'].map((s) => (
                    <span
                      key={s}
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: p.scale[s] }}
                    />
                  ))}
                </span>
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => chooseCustom(form.customBase)}
              className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left text-xs font-bold transition ${
                activePreset === 'custom'
                  ? 'border-navy-900 bg-navy-50 text-navy-900'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span
                className="h-4 w-4 rounded-full border border-slate-300"
                style={{ backgroundColor: form.palette['900'] }}
              />
              Kustom
            </button>
          </div>

          {activePreset === 'custom' && (
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Pilih Base Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.customBase}
                  onChange={(e) => chooseCustom(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  aria-label="Base color"
                />
                <input
                  type="text"
                  value={form.customBase}
                  onChange={(e) => chooseCustom(e.target.value)}
                  className={`${inputCls} w-32`}
                  placeholder="#16255f"
                />
              </div>
            </div>
          )}
        </section>

        {/* Branding */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-navy-950">Branding</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Nama Brand" hint="bagian pertama">
              <input
                value={form.brandName}
                onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))}
                className={inputCls}
              />
            </Field>
            <Field label="Highlight Brand" hint="bagian berwarna aksen">
              <input
                value={form.brandHighlight}
                onChange={(e) => setForm((f) => ({ ...f, brandHighlight: e.target.value }))}
                className={inputCls}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Tagline">
                <input
                  value={form.tagline}
                  onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </section>

        {/* Logo / Foto Header */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-navy-950">Logo / Foto Header</h2>
          <p className="mt-1 text-sm text-slate-500">
            Objek kosong memakai ikon bawaan; unggah logo untuk menggantikannya di navbar dan footer.
          </p>
          <div className="mt-4">
            <LogoPicker
              value={form.logo}
              onChange={(logo) => setForm((f) => ({ ...f, logo }))}
            />
          </div>
        </section>

        {/* Hero */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-navy-950">Teks Hero Beranda</h2>
          <div className="mt-4 space-y-4">
            <Field label="Judul Utama">
              <input
                value={form.heroTitle}
                onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
                className={inputCls}
              />
            </Field>
            <Field label="Highlight Judul" hint="bagian berwarna aksen">
              <input
                value={form.heroHighlight}
                onChange={(e) => setForm((f) => ({ ...f, heroHighlight: e.target.value }))}
                className={inputCls}
              />
            </Field>
            <Field label="Deskripsi">
              <textarea
                rows="3"
                value={form.heroDescription}
                onChange={(e) => setForm((f) => ({ ...f, heroDescription: e.target.value }))}
                className={`${inputCls} resize-y`}
              />
            </Field>
          </div>
        </section>

        {/* Kontak */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-navy-950">Info Kontak</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Telepon / WhatsApp">
              <input
                value={form.contact.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contact: { ...f.contact, phone: e.target.value } }))
                }
                className={inputCls}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={form.contact.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contact: { ...f.contact, email: e.target.value } }))
                }
                className={inputCls}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Alamat">
                <input
                  value={form.contact.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contact: { ...f.contact, address: e.target.value } }))
                  }
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Jam Operasional" hint="pisahkan baris dengan Enter">
                <textarea
                  rows="2"
                  value={form.contact.hours.join('\n')}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      contact: {
                        ...f.contact,
                        hours: e.target.value
                          .split('\n')
                          .map((h) => h.trim())
                          .filter(Boolean),
                      },
                    }))
                  }
                  className={`${inputCls} resize-y`}
                />
              </Field>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 pb-6">
          <button
            type="submit"
            className="rounded-xl bg-navy-900 px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-navy-800"
          >
            Simpan Perubahan
          </button>
          <a
            href="/"
            className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Lihat Situs →
          </a>
        </div>
      </form>
    </div>
  )
}