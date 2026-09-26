import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import FeaturedSpecialties from './components/FeaturedSpecialties'
import Concept from './components/Concept'
import CategoryTabs from './components/CategoryTabs'
import MenuSection from './components/MenuSection'
import VisitUs from './components/VisitUs'
import Footer from './components/Footer'
import CartBar from './components/CartBar'
import CartModal from './components/CartModal'
import { CartProvider } from './context/CartContext'
import { menu } from './data/menu'

function App() {
  const [activeId, setActiveId] = useState(menu[0].id)
  const [cartOpen, setCartOpen] = useState(false)
  const activeCategory = menu.find((c) => c.id === activeId) ?? menu[0]

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
        <CategoryTabs categories={menu} activeId={activeId} onSelect={handleSelect} />
        <MenuSection category={activeCategory} />
      </section>
      <VisitUs />
      <Footer />
      <CartBar onReview={() => setCartOpen(true)} />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </CartProvider>
  )
}

export default App
