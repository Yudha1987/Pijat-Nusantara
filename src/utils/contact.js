export function waLink(phone) {
  const digits = phone.replace(/\D/g, '')
  const intl = digits.startsWith('0') ? '62' + digits.slice(1) : digits
  return `https://wa.me/${intl}`
}

export function telLink(phone) {
  return `tel:${phone.replace(/[\s-]/g, '')}`
}

export function formatPrice(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}