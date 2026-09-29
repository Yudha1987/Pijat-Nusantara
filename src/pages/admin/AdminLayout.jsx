import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'

const links = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/terapis', label: 'Kelola Terapis', icon: '🧑‍⚕️', end: false },
  { to: '/admin/layanan', label: 'Kelola Layanan', icon: '💆', end: false },
  { to: '/admin/berita', label: 'Kelola Berita', icon: '📰', end: false },
  { to: '/admin/slider', label: 'Slider Foto', icon: '📸', end: false },
  { to: '/admin/penampilan', label: 'Tampilan Website', icon: '🎨', end: false },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { storageError } = useData()

  if (!user) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      {/* Sidebar desktop */}
      <aside className="hidden w-72 shrink-0 flex-col bg-navy-950 text-white lg:flex">
        <div className="px-6 py-6">
          <p className="text-lg font-bold">
            Pijat<span className="text-navy-300">Nusantara</span>
          </p>
          <p className="mt-1 text-xs text-navy-300">Panel Administrasi</p>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-white text-navy-950'
                    : 'text-navy-100 hover:bg-navy-900'
                }`
              }
            >
              <span aria-hidden="true">{link.icon}</span> {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-navy-800 p-4">
          <p className="truncate px-2 text-sm font-semibold">{user.name}</p>
          <p className="truncate px-2 text-xs text-navy-300">{user.email}</p>
          <div className="mt-3 grid gap-2">
            <NavLink
              to="/"
              className="rounded-lg px-4 py-2 text-center text-sm font-semibold text-navy-100 transition hover:bg-navy-900"
            >
              Lihat Website →
            </NavLink>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Keluar
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        {/* Header mobile */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <p className="text-base font-bold text-navy-950">
              Pijat<span className="text-navy-500">Nusantara</span>{' '}
              <span className="ml-1 rounded-full bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-700">
                Admin
              </span>
            </p>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600"
            >
              Keluar
            </button>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `shrink-0 rounded-lg px-4 py-2 text-sm font-semibold ${
                    isActive
                      ? 'bg-navy-900 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`
                }
              >
                <span aria-hidden="true">{link.icon}</span> {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/"
              className="shrink-0 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Website →
            </NavLink>
          </nav>
        </header>

        <main className="p-4 sm:p-6 lg:p-10">
          {storageError && (
            <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
              ⚠️ Penyimpanan peramban hampir/penuh — perubahan terbaru belum tersimpan permanen.
              Hapus beberapa foto berukuran besar (terapis/berita/slider) atau gunakan gambar yang lebih kecil.
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}