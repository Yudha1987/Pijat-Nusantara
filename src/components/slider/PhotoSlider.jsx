import { useCallback, useEffect, useRef, useState } from 'react'

export default function PhotoSlider({ slides, interval = 5000 }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)

  const count = slides?.length || 0

  const goTo = useCallback(
    (i) => setIndex(((i % count) + count) % count),
    [count],
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (count <= 1 || paused) return undefined
    timer.current = setTimeout(() => setIndex((i) => (i + 1) % count), interval)
    return () => clearTimeout(timer.current)
  }, [index, paused, count, interval])

  if (count === 0) return null

  return (
    <div
      className="group relative overflow-hidden rounded-3xl bg-navy-950 shadow-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <figure key={slide.id ?? i} className="relative aspect-[16/9] w-full shrink-0 sm:aspect-[21/9]">
            {slide.image ? (
              <img
                src={slide.image}
                alt={slide.caption || `Foto kegiatan ${i + 1}`}
                className="h-full w-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-900 to-navy-700 text-6xl">
                <span aria-hidden="true">💆</span>
              </div>
            )}
            {slide.caption && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent p-4 pb-6 sm:p-6 sm:pb-10">
                <p className="max-w-2xl text-sm font-semibold text-white sm:text-lg">
                  {slide.caption}
                </p>
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Foto sebelumnya"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white opacity-0 backdrop-blur transition hover:bg-white/30 group-hover:opacity-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Foto berikutnya"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white opacity-0 backdrop-blur transition hover:bg-white/30 group-hover:opacity-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ke foto ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}