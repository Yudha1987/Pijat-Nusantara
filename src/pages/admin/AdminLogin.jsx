import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ADMIN_EMAIL, ADMIN_PASSWORD, useAuth } from '../../context/AuthContext.jsx'

export default function AdminLogin() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const result = login(form.email, form.password)
      setLoading(false)
      if (result.ok) {
        navigate('/admin', { replace: true })
      } else {
        setError(result.message)
      }
    }, 400)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-navy-200 hover:text-white">
          ← Kembali ke website
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-2xl" aria-hidden="true">
              🔐
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-navy-950">Masuk Admin</h1>
              <p className="text-xs text-slate-400">Panel kelola Pijat Nusantara</p>
            </div>
          </div>

          {error && (
            <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="admin@pijatnusantara.id"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-navy-500 focus:bg-white focus:ring-2 focus:ring-navy-100"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Kata Sandi
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-navy-500 focus:bg-white focus:ring-2 focus:ring-navy-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-navy-900 py-3 text-sm font-bold text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Memverifikasi…' : 'Masuk'}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-navy-200 bg-navy-50 p-4 text-xs text-slate-600">
            <p className="font-bold text-navy-900">Akses demo</p>
            <p className="mt-1">
              Email: <code className="font-semibold">{ADMIN_EMAIL}</code>
              <br />
              Sandi: <code className="font-semibold">{ADMIN_PASSWORD}</code>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-navy-300">
          © {new Date().getFullYear()} Pijat Nusantara · Panel Administrasi
        </p>
      </div>
    </div>
  )
}