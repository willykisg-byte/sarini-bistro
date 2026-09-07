import { business, telHref } from '../data/business'

export default function Hero() {
  const phoneHref = telHref()

  return (
    <section
      id="top"
      className="stone-texture relative flex min-h-[88vh] flex-col justify-center border-b border-white/5 px-6 pt-24"
    >
      <div className="mx-auto w-full max-w-3xl text-center">
        <p className="font-serif text-2xl italic text-gold/90 sm:text-3xl">Sarini Bistro</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-6xl">
          Authentic Kenyan flavors on the A1 Highway
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
          Slow-grilled choma platters, spicy masala chips, and flame-grilled chicken —
          a proper stopover for travelers and a favorite for locals.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#menu"
            className="border border-gold bg-gold px-8 py-3 text-sm tracking-wide text-charcoal transition-colors hover:bg-gold-bright"
          >
            Order Now
          </a>
          <a
            href="#reservations"
            className="border border-gold/60 px-8 py-3 text-sm tracking-wide text-gold transition-colors hover:bg-gold/10"
          >
            Make a Reservation
          </a>
          {phoneHref && (
            <a
              href={phoneHref}
              className="text-sm tracking-wide text-cream/70 underline underline-offset-4 hover:text-gold"
            >
              Call {business.phone}
            </a>
          )}
        </div>

        <p className="mt-10 text-sm tracking-wide text-cream/40">
          {business.address} &nbsp;•&nbsp; Quick Service &nbsp;•&nbsp; {business.hours.open}
          {' – '}
          {business.hours.close} &nbsp;•&nbsp; {business.hours.note}
        </p>
      </div>
    </section>
  )
}
