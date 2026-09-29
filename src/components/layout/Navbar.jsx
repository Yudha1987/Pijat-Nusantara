import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useData } from '../../context/DataContext.jsx'
import { waLink } from '../../utils/contact.js'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/pemijat', label: 'Pemijat' },
  { to: '/layanan', label: 'Layanan' },
  { to: '/berita', label: 'Berita' },
  { to: '/kontak', label: 'Kontak' },
]

const VT =
  typeof document !== 'undefined' &&
  typeof document.startViewTransition === 'function'
    ? { viewTransition: true }
    : null

function BrandMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#0d1640" />
      <circle cx="24" cy="17" r="6" fill="#fff" />
      <path d="M9 42c0-9.5 6.7-14.5 15-14.5s15 5 15 14.5z" fill="#fff" />
      <path
        d="M17 6.5c2.5 3 2.5 6 0 8.5-2.5-2.5-2.5-5.5 0-8.5zM31 6.5c-2.5 3-2.5 6 0 8.5 2.5-2.5 2.5-5.5 0-8.5zM24 2c2 3 2 5.5 0 7.5-2-2-2-4.5 0-7.5z"
        fill="#456fea"
      />
    </svg>
  )
}

function AdminLink({ className }) {
  return (
    <Link
      {...VT}
      to="/admin/login"
      title="Login Admin"
      className={className}
      aria-label="Login Admin"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { data } = useData()
  const { brandName = 'Pijat', brandHighlight = 'Nusantara', contact, logo } = data.site
  const bookingHref = waLink(contact.phone)

  return (
    <header className="site-header sticky top-0 z-50 border-b border-navy-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link {...VT} to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {logo ? (
            <img
              src={logo}
              alt={`Logo ${brandName}${brandHighlight}`}
              className="h-10 w-auto max-w-[10rem] shrink-0 object-contain"
            />
          ) : (
            <BrandMark />
          )}
          <span className="text-lg font-bold tracking-tight text-navy-950">
            {brandName}
            <span className="text-accent">{brandHighlight}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              {...VT}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-navy-900 text-white'
                    : 'text-slate-600 hover:bg-navy-50 hover:text-navy-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href={bookingHref}
            target="_blank"
            rel="noreferrer"
            className="ml-3 rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-800"
          >
            Booking Sekarang
          </a>
          <AdminLink className="ml-1 rounded-lg p-2 text-slate-500 transition hover:bg-navy-50 hover:text-navy-900" />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <AdminLink className="rounded-lg p-2 text-slate-500 transition hover:bg-navy-50 hover:text-navy-900" />
          <button
            type="button"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-navy-950 hover:bg-navy-50"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-navy-100 bg-white px-4 pb-4 pt-2 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              {...VT}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-semibold ${
                  isActive
                    ? 'bg-navy-900 text-white'
                    : 'text-slate-600 hover:bg-navy-50 hover:text-navy-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href={bookingHref}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block rounded-lg bg-navy-900 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Booking Sekarang
          </a>
        </div>
      )}
    </header>
  )
}