import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import FeaturedSpecialties from './components/FeaturedSpecialties'
import Concept from './components/Concept'
import CategoryTabs from './components/CategoryTabs'
import MenuSection from './components/MenuSection'
import VisitUs from './components/VisitUs'
import TrackOrder from './components/TrackOrder'
import Footer from './components/Footer'
import CartBar from './components/CartBar'
import CartModal from './components/CartModal'
import { CartProvider } from './context/CartContext'
import type { MenuCategory } from './types'

function App() {
  const [menu, setMenu] = useState<MenuCategory[] | null>(null)
  const [menuError, setMenuError] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data: { categories: MenuCategory[] }) => {
        setMenu(data.categories)
        setActiveId(data.categories[0]?.id ?? null)
      })
      .catch(() => setMenuError(true))
  }, [])

  const activeCategory = menu?.find((c) => c.id === activeId) ?? menu?.[0]

  function handleSelect(id: string) {
    setActiveId(id)
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <CartProvider>
      <Header />
      <Hero />
      <Gallery />
      <FeaturedSpecialties />
      <Concept />
      <section id="menu">
        {menu && activeCategory ? (
          <>
            <CategoryTabs categories={menu} activeId={activeCategory.id} onSelect={handleSelect} />
            <MenuSection category={activeCategory} />
          </>
        ) : (
          <p className="px-6 py-20 text-center text-cream/50">
            {menuError ? 'Could not load the menu right now — please refresh.' : 'Loading menu…'}
          </p>
        )}
      </section>
      <VisitUs />
      <TrackOrder />
      <Footer />
      <CartBar onReview={() => setCartOpen(true)} />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </CartProvider>
  )
}

export default App
