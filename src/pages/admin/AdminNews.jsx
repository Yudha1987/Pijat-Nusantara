import { useState } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { formatDate } from '../../utils/format.js'
import { readImageFile } from '../../utils/image.js'

const emptyForm = {
  title: '',
  category: 'Kabar Perusahaan',
  author: 'Admin Pijat Nusantara',
  date: new Date().toISOString().slice(0, 10),
  image: '',
  excerpt: '',
  content: '',
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-navy-500 focus:bg-white focus:ring-2 focus:ring-navy-100'
const errCls = 'border-red-300 focus:border-red-400 focus:ring-red-100'

function ImagePicker({ value, onChange }) {
  const [preview, setPreview] = useState(value || '')
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await readImageFile(file, 840)
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
        <div className="h-24 w-full max-w-[170px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {preview ? (
            <img src={preview} alt="Pratinjau gambar berita" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-3xl" aria-hidden="true">🖼️</span>
          )}
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800">
              {preview ? 'Ganti Gambar' : 'Unggah Gambar'}
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview('')
                  onChange('')
                }}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Pakai Ilustrasi Default
              </button>
            )}
          </div>
          <p className="mt-1.5 max-w-[240px] text-xs text-slate-400">
            Jika kosong, berita memakai ilustrasi default laman berita.
          </p>
        </div>
      </div>
      {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}

export default function AdminNews() {
  const { data, addNews, updateNews, deleteNews } = useData()
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const startCreate = () => {
    setEditingId(null)
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) })
    setErrors({})
    setShowForm(true)
  }

  const startEdit = (n) => {
    setEditingId(n.id)
    setForm({
      title: n.title,
      category: n.category,
      author: n.author,
      date: n.date,
      image: n.image || '',
      excerpt: n.excerpt,
      content: n.content,
    })
    setErrors({})
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (n) => {
    if (!window.confirm(`Hapus berita "${n.title}"?`)) return
    deleteNews(n.id)
    if (editingId === n.id) {
      setShowForm(false)
      setEditingId(null)
    }
  }

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Judul wajib diisi.'
    if (!form.category.trim()) e.category = 'Kategori wajib diisi.'
    if (!form.date) e.date = 'Tanggal wajib diisi.'
    if (form.excerpt.trim().length < 10) e.excerpt = 'Ringkasan minimal 10 karakter.'
    if (form.content.trim().length < 20) e.content = 'Isi berita minimal 20 karakter.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      author: form.author.trim() || 'Admin Pijat Nusantara',
      date: form.date,
      image: form.image || '/images/news/berita-default.svg',
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
    }

    if (editingId) {
      updateNews(editingId, payload)
    } else {
      addNews(payload)
    }
    setShowForm(false)
    setEditingId(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 lg:text-3xl">Kelola Berita</h1>
          <p className="mt-1 text-sm text-slate-500">
            Unggah, ubah, dan hapus berita/informasi yang tampil di halaman publik.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800"
        >
          + Tulis Berita
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} noValidate className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-navy-950">
            {editingId ? 'Edit Berita' : 'Unggah Berita Baru'}
          </h2>

          <div className="mt-5 grid gap-5">
            <div>
              <ImagePicker
                key={editingId || 'new'}
                value={form.image}
                onChange={(v) => setField('image', v)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Judul Berita</label>
                <input value={form.title} onChange={(e) => setField('title', e.target.value)}
                  className={`${inputCls} ${errors.title ? errCls : ''}`} placeholder="Judul yang menarik..." />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Kategori</label>
                <select value={form.category} onChange={(e) => setField('category', e.target.value)} className={inputCls}>
                  <option>Kabar Perusahaan</option>
                  <option>Tips Kesehatan</option>
                  <option>Promo</option>
                  <option>Pengakuan</option>
                  <option>Lainnya</option>
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Penulis</label>
                <input value={form.author} onChange={(e) => setField('author', e.target.value)} className={inputCls} />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Tanggal Terbit</label>
                <input type="date" value={form.date} onChange={(e) => setField('date', e.target.value)} className={inputCls} />
                {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Ringkasan / Cuplikan</label>
                <textarea rows="2" value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)}
                  className={`${inputCls} resize-y ${errors.excerpt ? errCls : ''}`}
                  placeholder="Satu-dua kalimat ringkas di kartu berita..." />
                {errors.excerpt && <p className="mt-1 text-xs text-red-500">{errors.excerpt}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Isi Berita (paragraf dipisah baris kosong)</label>
                <textarea rows="8" value={form.content} onChange={(e) => setField('content', e.target.value)}
                  className={`${inputCls} resize-y ${errors.content ? errCls : ''}`}
                  placeholder="Tulis isi berita lengkap di sini..." />
                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="rounded-xl bg-navy-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800">
              {editingId ? 'Simpan Perubahan' : 'Terbitkan Berita'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {data.news.map((n) => (
          <article key={n.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <img
              src={n.image}
              alt=""
              className="h-16 w-24 rounded-lg border border-slate-200 object-cover"
              aria-hidden="true"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = '/images/news/berita-default.svg'
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[11px] font-bold text-navy-700">{n.category}</span>
                <span className="text-[11px] text-slate-400">{formatDate(n.date)}</span>
              </div>
              <p className="mt-1.5 truncate text-sm font-bold text-slate-800">{n.title}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(n)}
                className="rounded-lg border border-navy-900 px-4 py-2 text-xs font-bold text-navy-900 transition hover:bg-navy-50">
                Edit
              </button>
              <button type="button" onClick={() => handleDelete(n)}
                className="rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50">
                Hapus
              </button>
            </div>
          </article>
        ))}

        {data.news.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">
            Belum ada berita. Klik "+ Tulis Berita" untuk memulai.
          </p>
        )}
      </div>
    </div>
  )
}