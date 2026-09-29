import { useState } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { serviceCategories } from '../../data/services.js'
import { formatPrice } from '../../utils/contact.js'

const EMOJI_ICONS = [
  '👐', '🦶', '🌿', '🩸', '🤰', '👶', '🏃', '⚡', '💆', '💆‍♂️', '💆‍♀️',
  '🧖', '🪷', '🌺', '🔥', '💧', '🌟', '🫧',
]

const emptyForm = {
  name: '',
  category: 'Pijat Tradisional',
  duration: '',
  price: '',
  description: '',
  icon: '👐',
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-navy-500 focus:bg-white focus:ring-2 focus:ring-navy-100'
const errCls = 'border-red-300 focus:border-red-400 focus:ring-red-100'

export default function AdminServices() {
  const { data, addService, updateService, deleteService } = useData()
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const startCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setShowForm(true)
  }

  const startEdit = (s) => {
    setEditingId(s.id)
    setForm({
      name: s.name,
      category: s.category,
      duration: String(s.duration),
      price: String(s.price),
      description: s.description,
      icon: s.icon,
    })
    setErrors({})
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (s) => {
    if (!window.confirm(`Hapus layanan "${s.name}"?`)) return
    deleteService(s.id)
    if (editingId === s.id) {
      setShowForm(false)
      setEditingId(null)
    }
  }

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nama layanan wajib diisi.'
    if (!form.category.trim()) e.category = 'Kategori wajib diisi.'
    if (!form.duration || Number(form.duration) <= 0) e.duration = 'Durasi harus lebih dari 0 menit.'
    if (form.price === '' || Number(form.price) < 0) e.price = 'Harga tidak valid.'
    if (form.description.trim().length < 10) e.description = 'Deskripsi minimal 10 karakter.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      duration: Number(form.duration),
      price: Number(form.price),
      description: form.description.trim(),
      icon: form.icon || '💆',
    }

    if (editingId) {
      updateService(editingId, payload)
    } else {
      addService(payload)
    }
    setShowForm(false)
    setEditingId(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 lg:text-3xl">Kelola Layanan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tambah, ubah, dan hapus jenis layanan yang tampil di katalog publik.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800"
        >
          + Tambah Layanan
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} noValidate className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-navy-950">
            {editingId ? 'Edit Layanan' : 'Tambah Layanan Baru'}
          </h2>

          <div className="mt-5 grid gap-5">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Ikon Layanan</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setField('icon', icon)}
                    aria-label={`Ikon ${icon}`}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl transition ${
                      form.icon === icon
                        ? 'border-navy-900 bg-navy-50 ring-2 ring-navy-100'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nama Layanan</label>
                <input value={form.name} onChange={(e) => setField('name', e.target.value)}
                  className={`${inputCls} ${errors.name ? errCls : ''}`} placeholder="Contoh: Pijat Tradisional Jawa" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Kategori</label>
                <input list="service-categories" value={form.category} onChange={(e) => setField('category', e.target.value)}
                  className={`${inputCls} ${errors.category ? errCls : ''}`} placeholder="Ketuk untuk pilihan saran" />
                <datalist id="service-categories">
                  {serviceCategories.filter((c) => c !== 'Semua').map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Durasi (menit)</label>
                <input type="number" min="1" value={form.duration} onChange={(e) => setField('duration', e.target.value)}
                  className={`${inputCls} ${errors.duration ? errCls : ''}`} placeholder="60" />
                {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Harga (Rp)</label>
                <input type="number" min="0" step="5000" value={form.price} onChange={(e) => setField('price', e.target.value)}
                  className={`${inputCls} ${errors.price ? errCls : ''}`} placeholder="75000" />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Deskripsi</label>
                <textarea rows="3" value={form.description} onChange={(e) => setField('description', e.target.value)}
                  className={`${inputCls} resize-y ${errors.description ? errCls : ''}`} placeholder="Jelaskan manfaat layanan..." />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="rounded-xl bg-navy-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800">
              {editingId ? 'Simpan Perubahan' : 'Tambah Layanan'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {data.services.map((s) => (
          <article key={s.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-2xl" aria-hidden="true">
              {s.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[11px] font-bold text-navy-700">{s.category}</span>
                <span className="text-[11px] text-slate-400">{s.duration} menit</span>
              </div>
              <p className="mt-1.5 truncate text-sm font-bold text-slate-800">{s.name}</p>
              <p className="text-sm font-extrabold text-navy-950">{formatPrice(s.price)}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(s)}
                className="rounded-lg border border-navy-900 px-4 py-2 text-xs font-bold text-navy-900 transition hover:bg-navy-50">
                Edit
              </button>
              <button type="button" onClick={() => handleDelete(s)}
                className="rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50">
                Hapus
              </button>
            </div>
          </article>
        ))}

        {data.services.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">
            Belum ada layanan. Klik "+ Tambah Layanan" untuk memulai.
          </p>
        )}
      </div>
    </div>
  )
}