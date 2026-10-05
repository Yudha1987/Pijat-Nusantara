import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext.jsx'
import { HOME_SECTIONS, useSectionNav } from '../../hooks/useSectionNav.js'
import { waLink } from '../../utils/contact.js'
import { VT } from '../../utils/viewTransition.js'

export default function Footer() {
  const { data } = useData()
  const { brandName = 'Pijat', brandHighlight = 'Nusantara', contact } = data.site
  const goToSection = useSectionNav()

  const handleSectionClick = (id) => (event) => {
    event.preventDefault()
    goToSection(id)
  }

  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            {data.site.logo && (
              <img
                src={data.site.logo}
                alt=""
                className="h-10 w-auto max-w-[10rem] shrink-0 object-contain"
                aria-hidden="true"
              />
            )}
            <p className="text-lg font-bold text-white">
              {brandName}
              <span className="text-accent">{brandHighlight}</span>
            </p>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-navy-200">
            {data.site.tagline || 'Layanan pijat tradisional asli Indonesia dengan terapis berpengalaman.'}
          </p>
          <p className="mt-4 text-sm font-semibold text-navy-300">Jam Buka</p>
          {contact.hours.map((line) => (
            <p key={line} className="mt-1 text-sm">
              {line}
            </p>
          ))}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-300">
            Navigasi
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {HOME_SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={handleSectionClick(section.id)}
                  className="hover:text-white"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-300">
            Kontak
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <span aria-hidden="true">📍</span> {contact.address}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true">📞</span>
              <a href={waLink(contact.phone)} target="_blank" rel="noreferrer" className="hover:text-white">
                {contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true">✉️</span>
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-navy-300">
            © {new Date().getFullYear()} {brandName}
            {brandHighlight}. Dibuat dengan React, Tailwind CSS, dan Vite.
          </p>
          <Link
            {...VT}
            to="/admin/login"
            className="rounded-lg border border-navy-700 px-3 py-1.5 text-xs font-semibold text-navy-200 transition hover:bg-navy-900 hover:text-white"
          >
            🔐 Panel Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}