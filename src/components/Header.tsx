const navLinks = [
  { href: '#top', label: 'Home' },
  { href: '#menu', label: 'Menu' },
  { href: '#reservations', label: 'Reservations' },
  { href: '#visit', label: 'Contact Us' },
  { href: '#track-order', label: 'Track Order' },
]

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-charcoal/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border border-gold/60 text-gold font-serif text-lg">
            SB
          </span>
          <span className="font-serif text-lg tracking-wide text-cream">Sarini Bistro</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-cream/70 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#menu"
          className="border border-gold px-4 py-2 text-sm text-gold transition-colors hover:bg-gold hover:text-charcoal"
        >
          Order Now
        </a>
      </div>
    </header>
  )
}
