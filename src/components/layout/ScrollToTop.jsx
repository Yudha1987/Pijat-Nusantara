import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, state } = useLocation()

  useEffect(() => {
    if (state?.scrollTo) return
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname, state])

  return null
}