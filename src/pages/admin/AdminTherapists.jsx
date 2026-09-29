import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext.jsx'
import { avatarFallback, readImageFile } from '../../utils/image.js'

const emptyForm = {
  name: '',
  gender: 'Laki-laki',
  specialty: '',
  experience: '',
  rating: '',
  reviews: '',
  phone: '',
  area: '',
  bio: '',
  photo: '',
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-navy-500 focus:bg-white focus:ring-2 focus:ring-navy-100'
const errCls =
  'border-red-300 focus:border-red-400 focus:ring-red-100'

function PhotoPicker({ value, onChange }) {
  const [preview, setPreview] = useState(value || '')
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await readImageFile(file)
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
        {preview ? (
          <img
            src={preview}
            alt="Pratinjau foto"
            className="h-20 w-20 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-50 text-2xl" aria-hidden="true">
            🖼️
          </span>
        )}
        <div>
          <label className="cursor-pointer rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800">
            {preview ? 'Ganti Foto' : 'Unggah Foto'}
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
          <p className="mt-1.5 text-xs text-slate-400">
            JPG/PNG/WebP, otomatis diperkecil (max 640px).
          </p>
        </div>
      </div>
      {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}

export default function AdminTherapists() {
  const { data, addTherapist, updateTherapist, deleteTherapist } = useData()
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

  const startEdit = (t) => {
    setEditingId(t.id)
    setForm({
      name: t.name,
      gender: t.gender,
      specialty: t.specialty,
      experience: String(t.experience),
      rating: String(t.rating),
      reviews: String(t.reviews),
      phone: t.phone,
      area: t.area,
      bio: t.bio || '',
      photo: t.photo || '',
    })
    setErrors({})
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (t) => {
    if (!window.confirm(`Hapus terapis "${t.name}"?`)) return
    deleteTherapist(t.id)
    if (editingId === t.id) {
      setShowForm(false)
      setEditingId(null)
    }
  }

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nama wajib diisi.'
    if (!form.specialty.trim()) e.specialty = 'Keahlian wajib diisi.'
    if (!form.phone.trim()) e.phone = 'Telepon wajib diisi.'
    if (!form.area.trim()) e.area = 'Wilayah wajib diisi.'
    if (form.experience === '' || Number(form.experience) < 0) e.experience = 'Isi tahun pengalaman.'
    if (form.rating === '' || Number(form.rating) < 0 || Number(form.rating) > 5) e.rating = 'Rating 0–5.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload = {
      name: form.name.trim(),
      gender: form.gender,
      specialty: form.specialty.trim(),
      experience: Number(form.experience),
      rating: Number(form.rating),
      reviews: Number(form.reviews) || 0,
      phone: form.phone.trim(),
      area: form.area.trim(),
      bio: form.bio.trim(),
      photo: form.photo || avatarFallback(form.name.trim()),
    }

    if (editingId) {
      updateTherapist(editingId, payload)
    } else {
      addTherapist(payload)
    }
    setShowForm(false)
    setEditingId(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 lg:text-3xl">Kelola Terapis</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tambah, ubah foto, dan kelola daftar pemijat.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800"
        >
          + Tambah Terapis
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-base font-bold text-navy-950">
            {editingId ? `Edit / Ubah Foto — ${data.therapists.find((t) => t.id === editingId)?.name ?? ''}` : 'Tambah Terapis Baru'}
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <PhotoPicker value={form.photo} onChange={(v) => setField('photo', v)} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nama</label>
              <input value={form.name} onChange={(e) => setField('name', e.target.value)}
                className={`${inputCls} ${errors.name ? errCls : ''}`} placeholder="Contoh: Ki Sutrisno" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Jenis Kelamin</label>
              <select value={form.gender} onChange={(e) => setField('gender', e.target.value)} className={inputCls}>
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Keahlian</label>
              <input value={form.specialty} onChange={(e) => setField('specialty', e.target.value)}
                className={`${inputCls} ${errors.specialty ? errCls : ''}`} placeholder="Contoh: Refleksi & Urut" />
              {errors.specialty && <p className="mt-1 text-xs text-red-500">{errors.specialty}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Wilayah Layanan</label>
              <input value={form.area} onChange={(e) => setField('area', e.target.value)}
                className={`${inputCls} ${errors.area ? errCls : ''}`} placeholder="Contoh: Yogyakarta" />
              {errors.area && <p className="mt-1 text-xs text-red-500">{errors.area}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Telepon</label>
              <input value={form.phone} onChange={(e) => setField('phone', e.target.value)}
                className={`${inputCls} ${errors.phone ? errCls : ''}`} placeholder="08xx-xxxx-xxxx" />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

<div className="grid grid-cols-3 gap-3 sm:col-span-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Pengalaman (th)</label>
                  <input type="number" min="0" value={form.experience} onChange={(e) => setField('experience', e.target.value)}
                    className={`${inputCls} ${errors.experience ? errCls : ''}`} />
                  {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Rating (0–5)</label>
                  <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setField('rating', e.target.value)}
                    className={`${inputCls} ${errors.rating ? errCls : ''}`} />
                  {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Jumlah Ulasan</label>
                  <input type="number" min="0" value={form.reviews} onChange={(e) => setField('reviews', e.target.value)} className={inputCls} />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Bio / Profil Singkat</label>
                <textarea rows="3" value={form.bio} onChange={(e) => setField('bio', e.target.value)}
                  className={`${inputCls} resize-y`}
                  placeholder="Cerita singkat pengalaman, keahlian, dan area layanan terapis..." />
              </div>
            </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="rounded-xl bg-navy-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800">
              {editingId ? 'Simpan Perubahan' : 'Tambah Terapis'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ul className="divide-y divide-slate-100">
          {data.therapists.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center gap-4 p-4 sm:px-6">
              <img
                src={t.photo}
                alt=""
                className="h-14 w-14 rounded-full border border-slate-200 object-cover"
                aria-hidden="true"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = avatarFallback(t.name)
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">{t.name}</p>
                <p className="truncate text-xs text-slate-400">
                  {t.specialty} · {t.area} · {t.phone} · ★ {t.rating} ({t.reviews} ulasan) · {t.experience} th
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/pemijat/${t.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-navy-900 hover:text-navy-900"
                >
                  Lihat Profil ↗
                </Link>
                <button type="button" onClick={() => startEdit(t)}
                  className="rounded-lg border border-navy-900 px-4 py-2 text-xs font-bold text-navy-900 transition hover:bg-navy-50">
                  Edit / Ganti Foto
                </button>
                <button type="button" onClick={() => handleDelete(t)}
                  className="rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50">
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>

        {data.therapists.length === 0 && (
          <p className="p-10 text-center text-sm text-slate-400">Belum ada terapis.</p>
        )}
      </div>
    </div>
  )
}