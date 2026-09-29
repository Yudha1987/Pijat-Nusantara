export default function PageHero({ eyebrow, title, description }) {
  return (
    <section className="bg-navy-950 pb-20 pt-16 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        {eyebrow && (
          <p className="text-sm font-bold uppercase tracking-wider text-navy-300">{eyebrow}</p>
        )}
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-navy-200">{description}</p>
        )}
      </div>
    </section>
  )
}