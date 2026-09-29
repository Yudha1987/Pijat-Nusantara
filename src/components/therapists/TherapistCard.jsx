import { useState } from 'react'
import { Link } from 'react-router-dom'
import { avatarFallback } from '../../utils/image.js'
import { telLink, waLink } from '../../utils/contact.js'
import Rating from '../ui/Rating.jsx'

function Photo({ therapist }) {
  const [src, setSrc] = useState(() => therapist.photo || avatarFallback(therapist.name))

  return (
    <img
      src={src}
      alt={`Foto ${therapist.name}`}
      onError={() => setSrc(avatarFallback(therapist.name))}
      className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
      loading="lazy"
    />
  )
}

export default function TherapistCard({ therapist }) {
  const profileUrl = `/pemijat/${therapist.id}`

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg">
      <Link to={profileUrl} aria-label={`Lihat profil ${therapist.name}`} className="relative block overflow-hidden">
        <Photo therapist={therapist} />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-900 shadow-sm backdrop-blur">
          {therapist.area}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-navy-900/90 px-3 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
          Lihat Profil →
        </span>
      </Link>

      <div className="p-5">
        <h3 className="text-lg font-bold text-navy-950">
          <Link to={profileUrl} className="transition hover:text-navy-600">
            {therapist.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-sm font-semibold text-navy-600">{therapist.specialty}</p>

        <div className="mt-3 flex items-center justify-between">
          <Rating value={therapist.rating} reviews={therapist.reviews} />
          <span className="text-xs font-medium text-slate-400">
            {therapist.experience} th pengalaman
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href={waLink(therapist.phone)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-navy-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            <span aria-hidden="true">💬</span> WhatsApp
          </a>
          <a
            href={telLink(therapist.phone)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-navy-900 px-3 py-2 text-sm font-semibold text-navy-900 transition hover:bg-navy-50"
          >
            <span aria-hidden="true">📞</span> {therapist.phone}
          </a>
        </div>

        <Link
          to={profileUrl}
          className="mt-3 flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-navy-900 hover:text-navy-900"
        >
          Lihat Profil Lengkap →
        </Link>
      </div>
    </article>
  )
}