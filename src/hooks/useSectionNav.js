import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const HOME_SECTIONS = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'pemijat', label: 'Pemijat' },
  { id: 'layanan', label: 'Layanan' },
  { id: 'berita', label: 'Berita' },
  { id: 'kontak', label: 'Kontak' },
]

export const HOME_SECTION_IDS = HOME_SECTIONS.map((s) => s.id)

export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    return false
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return true
}

export function useSectionNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback(
    (id) => {
      if (pathname !== '/') {
        navigate('/', { state: { scrollTo: id } })
        return
      }
      scrollToSection(id)
    },
    [pathname, navigate],
  )
}

export function useActiveSection(sectionIds) {
  const [scrolledId, setScrolledId] = useState(null)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    if (!isHome) return undefined

    let frame = 0
    const compute = () => {
      frame = 0
      const offset = 140
      let current = sectionIds[0]
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id
      }
      const doc = document.documentElement
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 8) {
        current = sectionIds[sectionIds.length - 1]
      }
      setScrolledId((prev) => (prev === current ? prev : current))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isHome, sectionIds])

  return isHome ? (scrolledId ?? sectionIds[0]) : null
}