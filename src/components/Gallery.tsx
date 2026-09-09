import { galleryImages } from '../data/gallery'

export default function Gallery() {
  // Duplicate the list so the strip can loop seamlessly.
  const strip = [...galleryImages, ...galleryImages]

  return (
    <section className="overflow-hidden border-b border-white/5 py-14">
      <div className="mx-auto mb-8 max-w-5xl px-6 text-center">
        <p className="font-serif text-lg italic text-gold/80">From the Kitchen</p>
      </div>

      <div className="group overflow-hidden">
        <div className="animate-marquee flex w-max gap-6 group-hover:[animation-play-state:paused]">
          {strip.map((img, i) => (
            <figure
              key={`${img.id}-${i}`}
              className="relative h-72 w-56 shrink-0 overflow-hidden border border-white/10 sm:h-80 sm:w-64"
            >
              <img
                src={img.src}
                alt={img.caption}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent px-4 py-3">
                <span className="font-serif text-lg italic text-cream">{img.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
