import { useLocation } from 'react-router-dom'

const supportsViewTransition =
  typeof document !== 'undefined' &&
  typeof document.startViewTransition === 'function'

export default function PageTransition({ children }) {
  const { pathname } = useLocation()
  const key = pathname.split('?')[0]

  if (supportsViewTransition) {
    return (
      <div key={key} className="min-h-[50vh]">
        {children}
      </div>
    )
  }

  return (
    <div key={key} className="page-enter min-h-[50vh]">
      {children}
    </div>
  )
}