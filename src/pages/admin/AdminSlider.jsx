import { useState } from 'react'
import { defaultSlides, useData } from '../../context/DataContext.jsx'
import { readImageFile } from '../../utils/image.js'

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-navy-500 focus:bg-white focus:ring-2 focus:ring-navy-100'

export default function AdminSlider() {
  const { data, updateSite } = useData()
  const slides = data.site.slides || []

  const [showForm, setShowForm] = useState(false)
  const [photo, setPhoto] = useState('')
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editCaption, setEditCaption] = useState('')
  const [saved, setSaved] = useState(false)

  const updateSlides = (next) => updateSite({ slides: next })

  const flashSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setPhoto(await readImageFile(file, 1024))
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const addSlide = (e) => {
    e.preventDefault()
    if (!caption.trim()) {
      setError('Tulis keterangan foto terlebih dahulu.')
      return
    }
    updateSlides([...slides, { id: Date.now(), image: photo || null, caption: caption.trim() }])
    setPhoto('')
    setCaption('')
    setShowForm(false)
    flashSaved()
  }

  const move = (i, dir) => {
    const next = [...slides]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    updateSlides(next)
  }

  const startEdit = (slide) => {
    setEditingId(slide.id)
    setEditCaption(slide.caption)
  }

  const saveCaption = (id) => {
    updateSlides(slides.map((s) => (s.id === id ? { ...s, caption: editCaption.trim() } : s)))
    setEditingId(null)
    flashSaved()
  }

  const removeSlide = (id) => {
    if (!window.confirm('Hapus foto ini dari slider?')) return
    updateSlides(slides.filter((s) => s.id !== id))
  }

  const resetDefault = () => {
    if (!window.confirm('Ganti seluruh foto slider dengan galeri bawaan?')) return
    updateSlides(defaultSlides.map((s) => ({ ...s, id: Date.now() + s.id })))
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 lg:text-3xl">Kelola Slider Foto</h1>
          <p className="mt-1 text-sm text-slate-500">
            Atur foto kegiatan yang tampil pada galeri bergulir di beranda.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetDefault}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
          >
            Kembalikan Bawaan
          </button>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800"
          >
            + Tambah Foto
          </button>
        </div>
      </div>

      {saved && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          Perubahan tersimpan.
        </p>
      )}

      {showForm && (
        <form onSubmit={addSlide} noValidate className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-navy-950">Tambah Foto Kegiatan</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Foto Kegiatan</label>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {photo ? (
                    <img src={photo} alt="" className="h-full w-full object-cover" aria-hidden="true" />
                  ) : (
                    <span className="text-sm text-slate-400">Belum ada foto</span>
                  )}
                </div>
                <label className="cursor-pointer rounded-xl border border-navy-900 px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-navy-50">
                  {photo ? 'Ganti Foto' : 'Unggah Foto'}
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Tanpa foto akan memakai ilustrasi ikon. Foto otomatis diperkecil (max 1024px).
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Keterangan Foto</label>
              <textarea
                rows="3"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className={`${inputCls} resize-none`}
                placeholder="Contoh: Pijat tradisional Jawa dengan minyak rempah"
              />
              {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="submit" className="rounded-xl bg-navy-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800">
              Simpan Foto
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setError('')
              }}
              className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {slides.map((slide, i) => (
          <article key={slide.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex h-20 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-navy-50">
              {slide.image ? (
                <img src={slide.image} alt="" className="h-full w-full object-cover" aria-hidden="true" />
              ) : (
                <span className="text-2xl" aria-hidden="true">💆</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[11px] font-bold text-navy-700">
                  Foto {i + 1}
                </span>
                <span className="text-[11px] text-slate-400">urutan #{(i + 1).toString().padStart(2, '0')}</span>
              </div>
              {editingId === slide.id ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className={`${inputCls} min-w-0 flex-1 sm:max-w-md`}
                  />
                  <button
                    type="button"
                    onClick={() => saveCaption(slide.id)}
                    className="rounded-lg bg-navy-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-navy-800"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <p className="mt-1.5 text-sm text-slate-600">
                  {slide.caption || <span className="italic text-slate-400">Tanpa keterangan</span>}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === slides.length - 1}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => (editingId === slide.id ? saveCaption(slide.id) : startEdit(slide))}
                className="rounded-lg border border-navy-900 px-4 py-2 text-xs font-bold text-navy-900 transition hover:bg-navy-50"
              >
                {editingId === slide.id ? 'Simpan' : 'Ubah Ket.'}
              </button>
              <button
                type="button"
                onClick={() => removeSlide(slide.id)}
                className="rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
              >
                Hapus
              </button>
            </div>
          </article>
        ))}

        {slides.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">
            Belum ada foto slider. Klik "+ Tambah Foto" untuk mengisi galeri kegiatan.
          </p>
        )}
      </div>
    </div>
  )
}