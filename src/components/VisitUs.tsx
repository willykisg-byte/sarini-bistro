import { business, telHref, whatsappHref, directionsHref, mapEmbedSrc } from '../data/business'

export default function VisitUs() {
  const phoneHref = telHref()
  const waHref = whatsappHref()
  const hasContact = Boolean(phoneHref || business.email)

  return (
    <>
      <section id="reservations" className="border-b border-white/5 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-lg italic text-gold/80">Reservations</p>
          <h2 className="mt-2 font-serif text-3xl text-cream sm:text-4xl">
            Booking a Table
          </h2>
          <p className="mt-4 text-cream/60">
            {hasContact
              ? 'Give us a call or send a message and we\u2019ll hold your table.'
              : 'Online booking is on the way — for now, reservations are taken by phone and WhatsApp.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {phoneHref && (
              <a
                href={phoneHref}
                className="border border-gold bg-gold px-8 py-3 text-sm text-charcoal transition-colors hover:bg-gold-bright"
              >
                Call to Reserve
              </a>
            )}
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="border border-gold/60 px-8 py-3 text-sm text-gold transition-colors hover:bg-gold/10"
              >
                WhatsApp Us
              </a>
            )}
            {!phoneHref && !waHref && (
              <span className="text-sm text-cream/40">
                Contact details coming soon
              </span>
            )}
          </div>
        </div>
      </section>

      <section id="visit" className="border-b border-white/5 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="font-serif text-lg italic text-gold/80">Find Us</p>
            <h2 className="mt-2 font-serif text-3xl text-cream">Visit Us in Kitale</h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/60">
              Right on the A1 Highway — an easy stop for travelers, with an
              open-air terrace and secure parking.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="overflow-hidden border border-white/10">
              <iframe
                title="Sarini Bistro location"
                src={mapEmbedSrc()}
                className="h-72 w-full sm:h-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="space-y-4 text-cream/80">
              <div>
                <p className="text-sm text-cream/40">Address</p>
                <p>{business.address}</p>
              </div>
              <div>
                <p className="text-sm text-cream/40">Hours</p>
                <p>
                  {business.hours.open} – {business.hours.close}
                </p>
                <p className="text-sm text-cream/50">{business.hours.note}</p>
              </div>
              {business.phone && (
                <div>
                  <p className="text-sm text-cream/40">Phone</p>
                  <p>{business.phone}</p>
                </div>
              )}
              {business.email && (
                <div>
                  <p className="text-sm text-cream/40">Email</p>
                  <p>{business.email}</p>
                </div>
              )}
              <a
                href={directionsHref()}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block border border-gold px-6 py-2.5 text-sm text-gold transition-colors hover:bg-gold hover:text-charcoal"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="track-order" className="border-b border-white/5 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-lg italic text-gold/80">Track Order</p>
          <h2 className="mt-2 font-serif text-3xl text-cream sm:text-4xl">
            Order Tracking
          </h2>
          <p className="mt-4 text-cream/60">
            Online ordering and M-Pesa checkout are on the way. Once live,
            you'll be able to track your order right here by order number.
          </p>
        </div>
      </section>
    </>
  )
}
