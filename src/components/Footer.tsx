import { business } from '../data/business'

export default function Footer() {
  return (
    <footer className="px-6 py-14 text-sm text-cream/50">
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg italic text-gold/80">Sarini Bistro</p>
          <p className="mt-3 leading-relaxed">
            Traditional Kenyan grill and sides, served on the A1 Highway in
            Kitale. Online ordering with M-Pesa checkout is on the way.
          </p>
        </div>
        <div>
          <p className="text-cream/70">Contact & Location</p>
          <p className="mt-3">{business.address}</p>
          {business.phone && <p className="mt-1">{business.phone}</p>}
          {business.email && <p className="mt-1">{business.email}</p>}
        </div>
        <div>
          <p className="text-cream/70">Hours of Operation</p>
          <p className="mt-3">
            {business.hours.open} – {business.hours.close}
          </p>
          <p className="mt-1">{business.hours.note}</p>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-5xl border-t border-white/5 pt-6 text-xs text-cream/30">
        © {new Date().getFullYear()} Sarini Bistro. All rights reserved.
      </div>
    </footer>
  )
}
