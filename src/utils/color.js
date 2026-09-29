export const presets = {
  navy: {
    label: 'Biru Gelap (Default)',
    accent: '#456fea',
    scale: {
      '50': '#f0f4fe',
      '100': '#dee8fc',
      '200': '#c3d5fb',
      '300': '#99b9f7',
      '400': '#6892f1',
      '500': '#456fea',
      '600': '#3050de',
      '700': '#273fc9',
      '800': '#2436a2',
      '900': '#16255f',
      '950': '#0d1640',
    },
  },
  emerald: {
    label: 'Hijau Zamrud',
    accent: '#10b981',
    scale: {
      '50': '#ecfdf5',
      '100': '#d1fae5',
      '200': '#a7f3d0',
      '300': '#6ee7b7',
      '400': '#34d399',
      '500': '#10b981',
      '600': '#059669',
      '700': '#047857',
      '800': '#065f46',
      '900': '#064e3b',
      '950': '#022c22',
    },
  },
  teal: {
    label: 'Teal Tosca',
    accent: '#14b8a6',
    scale: {
      '50': '#f0fdfa',
      '100': '#ccfbf1',
      '200': '#99f6e4',
      '300': '#5eead4',
      '400': '#2dd4bf',
      '500': '#14b8a6',
      '600': '#0d9488',
      '700': '#0f766e',
      '800': '#115e59',
      '900': '#134e4a',
      '950': '#042f2e',
    },
  },
  sky: {
    label: 'Biru Langit',
    accent: '#0ea5e9',
    scale: {
      '50': '#f0f9ff',
      '100': '#e0f2fe',
      '200': '#bae6fd',
      '300': '#7dd3fc',
      '400': '#38bdf8',
      '500': '#0ea5e9',
      '600': '#0284c7',
      '700': '#0369a1',
      '800': '#075985',
      '900': '#0c4a6e',
      '950': '#082f49',
    },
  },
  violet: {
    label: 'Ungu Lembayung',
    accent: '#8b5cf6',
    scale: {
      '50': '#f5f3ff',
      '100': '#ede9fe',
      '200': '#ddd6fe',
      '300': '#c4b5fd',
      '400': '#a78bfa',
      '500': '#8b5cf6',
      '600': '#7c3aed',
      '700': '#6d28d9',
      '800': '#5b21b6',
      '900': '#4c1d95',
      '950': '#2e1065',
    },
  },
  rose: {
    label: 'Merah Mawar',
    accent: '#f43f5e',
    scale: {
      '50': '#fff1f2',
      '100': '#ffe4e6',
      '200': '#fecdd3',
      '300': '#fda4af',
      '400': '#fb7185',
      '500': '#f43f5e',
      '600': '#e11d48',
      '700': '#be123c',
      '800': '#9f1239',
      '900': '#881337',
      '950': '#4c0519',
    },
  },
  amber: {
    label: 'Kuning Ambar',
    accent: '#f59e0b',
    scale: {
      '50': '#fffbeb',
      '100': '#fef3c7',
      '200': '#fde68a',
      '300': '#fcd34d',
      '400': '#fbbf24',
      '500': '#f59e0b',
      '600': '#d97706',
      '700': '#b45309',
      '800': '#92400e',
      '900': '#78350f',
      '950': '#451a03',
    },
  },
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const num = parseInt(full, 16)
  if (Number.isNaN(num)) return null
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function mixRoRgb(a, b, weightA) {
  // weightA = porsi warna a (0..1), sisanya warna b
  const r = Math.round(a.r * weightA + b.r * (1 - weightA))
  const g = Math.round(a.g * weightA + b.g * (1 - weightA))
  const bl = Math.round(a.b * weightA + b.b * (1 - weightA))
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

const WHITE = { r: 255, g: 255, b: 255 }
const BLACK = { r: 0, g: 0, b: 0 }

// Bobot campuran menuju putih (untuk shade terang) — dihitung dari base (900).
const LIGHT_WEIGHTS = {
  '50': 0.93,
  '100': 0.88,
  '200': 0.78,
  '300': 0.64,
  '400': 0.5,
  '500': 0.36,
  '600': 0.24,
  '700': 0.15,
  '800': 0.1,
  '900': 0,
}

export function generateScale(baseHex) {
  const base = hexToRgb(baseHex)
  if (!base) return presets.navy.scale
  const scale = {}
  for (const [shade, weight] of Object.entries(LIGHT_WEIGHTS)) {
    scale[shade] = mixRoRgb(base, WHITE, 1 - weight)
  }
  scale['900'] = `#${[base.r, base.g, base.b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
  scale['950'] = mixRoRgb(base, BLACK, 0.85)
  return scale
}

export function deriveAccent(baseHex) {
  const base = hexToRgb(baseHex)
  if (!base) return presets.navy.accent
  return mixRoRgb(base, WHITE, 0.64)
}

export function applyPalette(scale, accent) {
  const root = document.documentElement
  for (const [shade, value] of Object.entries(scale)) {
    root.style.setProperty(`--color-navy-${shade}`, value)
  }
  root.style.setProperty('--color-accent', accent)
}

export const DEFAULT_PALETTE = presets.navy.scale
export const DEFAULT_ACCENT = presets.navy.accent