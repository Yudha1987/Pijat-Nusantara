import { createContext, useContext, useEffect, useState } from 'react'
import { news as seedNews } from '../data/news.js'
import { services as seedServices } from '../data/services.js'
import { therapists as seedTherapists } from '../data/therapists.js'
import {
  applyPalette,
  DEFAULT_ACCENT,
  DEFAULT_PALETTE,
} from '../utils/color.js'

const STORAGE_KEY = 'pijatnusantara:data'

export const defaultSlides = [
  {
    id: 1,
    image: '/images/slider/slide-pijat.svg',
    caption: 'Pijat tradisional dengan sentuhan terapis berpengalaman',
  },
  {
    id: 2,
    image: '/images/slider/slide-rempah.svg',
    caption: 'Racikan minyak herbal & rempah pilihan untuk relaksasi',
  },
  {
    id: 3,
    image: '/images/slider/slide-refleksi.svg',
    caption: 'Terapi refleksi kaki untuk melancarkan peredaran darah',
  },
]

const defaultSite = {
  brandName: 'Pijat',
  brandHighlight: 'Nusantara',
  tagline: 'Jasa Pijat Tradisional Asli Indonesia',
  heroTitle: 'Sehatkan Tubuh dengan Pijat Tradisional',
  heroHighlight: 'Asli Indonesia',
  heroDescription:
    'Relaksasi otot, melancarkan peredaran darah, dan memulihkan tenaga bersama terapis berpengalaman. Datang ke studio atau panggil ke rumah.',
  logo: null,
  slides: defaultSlides,
  accent: DEFAULT_ACCENT,
  palette: DEFAULT_PALETTE,
  contact: {
    phone: '0812-3456-7890',
    email: 'halo@pijatnusantara.id',
    address: 'Jl. Malioboro No. 12, Yogyakarta',
    hours: ['Senin–Sabtu: 08.00–20.00 WIB', 'Minggu: 09.00–17.00 WIB'],
  },
}

const seed = {
  therapists: seedTherapists,
  services: seedServices,
  news: seedNews,
  site: defaultSite,
}

export function getDefaultSite() {
  return {
    brandName: 'Pijat',
    brandHighlight: 'Nusantara',
    tagline: 'Jasa Pijat Tradisional Asli Indonesia',
    heroTitle: 'Sehatkan Tubuh dengan Pijat Tradisional',
    heroHighlight: 'Asli Indonesia',
    heroDescription:
      'Relaksasi otot, melancarkan peredaran darah, dan memulihkan tenaga bersama terapis berpengalaman. Datang ke studio atau panggil ke rumah.',
    logo: null,
    slides: defaultSlides,
    accent: DEFAULT_ACCENT,
    palette: { ...DEFAULT_PALETTE },
    contact: {
      phone: '0812-3456-7890',
      email: 'halo@pijatnusantara.id',
      address: 'Jl. Malioboro No. 12, Yogyakarta',
      hours: ['Senin–Sabtu: 08.00–20.00 WIB', 'Minggu: 09.00–17.00 WIB'],
    },
  }
}

function withIds(list, start) {
  return (list || []).map((item, i) =>
    item && item.id != null ? item : { ...item, id: start + i },
  )
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed
    const parsed = JSON.parse(raw)
    const storedSite = parsed.site || {}
    const site = {
      ...defaultSite,
      ...storedSite,
      slides: Array.isArray(storedSite.slides) ? storedSite.slides : defaultSite.slides,
      palette: { ...defaultSite.palette, ...(storedSite.palette || {}) },
      contact: { ...defaultSite.contact, ...(storedSite.contact || {}) },
    }
    return {
      therapists: Array.isArray(parsed.therapists)
        ? withIds(parsed.therapists, 1000)
        : seed.therapists,
      services: Array.isArray(parsed.services)
        ? withIds(parsed.services, 2000)
        : seed.services,
      news: Array.isArray(parsed.news)
        ? withIds(parsed.news, 3000)
        : seed.news,
      site,
    }
  } catch {
    return seed
  }
}

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [data, setData] = useState(load)
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    const persist = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        return false
      } catch {
        // Kuota localStorage penuh — beri tahu admin agar tahu perubahan belum tersimpan.
        return true
      }
    }
    const timer = setTimeout(() => setStorageError(persist()))
    return () => clearTimeout(timer)
  }, [data])

  // Terapkan tema warna ke seluruh situs (CSS variables Tailwind v4).
  useEffect(() => {
    applyPalette(data.site.palette, data.site.accent)
  }, [data.site.palette, data.site.accent])

  const updateSite = (patch) =>
    setData((d) => ({
      ...d,
      site: {
        ...d.site,
        ...patch,
        palette: patch.palette || d.site.palette,
        accent: patch.accent || d.site.accent,
        contact: patch.contact
          ? { ...d.site.contact, ...patch.contact }
          : d.site.contact,
      },
    }))

  const resetSite = () =>
    setData((d) => ({ ...d, site: defaultSite }))

  const addTherapist = (therapist) =>
    setData((d) => ({
      ...d,
      therapists: [...d.therapists, { ...therapist, id: Date.now() }],
    }))

  const updateTherapist = (id, patch) =>
    setData((d) => ({
      ...d,
      therapists: d.therapists.map((t) =>
        t.id === id ? { ...t, ...patch } : t,
      ),
    }))

  const deleteTherapist = (id) =>
    setData((d) => ({
      ...d,
      therapists: d.therapists.filter((t) => t.id !== id),
    }))

  const addNews = (item) =>
    setData((d) => ({
      ...d,
      news: [{ ...item, id: Date.now() }, ...d.news],
    }))

  const updateNews = (id, patch) =>
    setData((d) => ({
      ...d,
      news: d.news.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    }))

  const deleteNews = (id) =>
    setData((d) => ({
      ...d,
      news: d.news.filter((n) => n.id !== id),
    }))

  const addService = (item) =>
    setData((d) => ({
      ...d,
      services: [...d.services, { ...item, id: Date.now() }],
    }))

  const updateService = (id, patch) =>
    setData((d) => ({
      ...d,
      services: d.services.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))

  const deleteService = (id) =>
    setData((d) => ({
      ...d,
      services: d.services.filter((s) => s.id !== id),
    }))

  return (
    <DataContext.Provider
      value={{
        data,
        storageError,
        updateSite,
        resetSite,
        addTherapist,
        updateTherapist,
        deleteTherapist,
        addNews,
        updateNews,
        deleteNews,
        addService,
        updateService,
        deleteService,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}