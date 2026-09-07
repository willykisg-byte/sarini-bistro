import { featured } from '../data/featured'

export default function FeaturedSpecialties() {
  return (
    <section className="border-b border-white/5 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-serif text-lg italic text-gold/80">Curated Selections</p>
          <h2 className="mt-2 font-serif text-3xl text-cream sm:text-4xl">
            Featured House Specialties
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <div
              key={item.id}
              className="flex flex-col border border-white/10 bg-stone p-6"
            >
              <span className="text-xs tracking-wide text-olive">Featured</span>
              <h3 className="mt-3 font-serif text-lg text-cream">{item.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-cream/60">
                {item.description}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-cream/90">KSh {item.price.toLocaleString('en-KE')}</span>
                <button
                  type="button"
                  className="border border-gold/60 px-4 py-1.5 text-xs text-gold transition-colors hover:bg-gold hover:text-charcoal"
                  title="Online ordering is coming soon"
                >
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
