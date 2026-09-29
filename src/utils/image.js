export function readImageFile(file, maxSize = 640, { png = false } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Pilih file terlebih dahulu.'))
      return
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar (JPG/PNG/WebP).'))
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error('Ukuran file maksimal 8 MB.'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Format gambar tidak didukung.'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx = canvas.getContext('2d')
        // Isi putih dulu agar area transparan tidak berubah hitam saat JPEG.
        if (!png) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(
          canvas.toDataURL(png ? 'image/png' : 'image/jpeg', png ? undefined : 0.8),
        )
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export function initials(name) {
  return (name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => (w[0] || '').toUpperCase())
    .join('')
}

export function avatarFallback(name) {
  const text = initials(name)
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">`,
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">`,
    `<stop offset="0" stop-color="#16255f"/><stop offset="1" stop-color="#456fea"/>`,
    `</linearGradient></defs>`,
    `<rect width="400" height="400" fill="url(#g)"/>`,
    `<circle cx="200" cy="400" r="190" fill="rgba(255,255,255,0.08)"/>`,
    `<circle cx="200" cy="400" r="120" fill="rgba(255,255,255,0.06)"/>`,
    `<circle cx="200" cy="150" r="68" fill="#ffffff"/>`,
    `<path d="M70 400c0-82 58-122 130-122s130 40 130 122z" fill="#ffffff"/>`,
    `<text x="200" y="410" font-family="Segoe UI, Arial, sans-serif" font-size="100" font-weight="600" fill="#fff" text-anchor="middle" dominant-baseline="middle">${text}</text>`,
    `</svg>`,
  ].join('')
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}