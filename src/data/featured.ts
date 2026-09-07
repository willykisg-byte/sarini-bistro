export interface FeaturedItem {
  id: string
  name: string
  price: number
  description: string
}

export const featured: FeaturedItem[] = [
  {
    id: 'choma-platter-half',
    name: 'Choma Platter (½ kg)',
    price: 800,
    description: 'Slow-grilled to order, served with one accompaniment of your choice.',
  },
  {
    id: 'mixed-grill',
    name: 'Mixed Grill',
    price: 2200,
    description: 'Choma ribs, chicken skewers, wings, and grilled sausage — built for sharing.',
  },
  {
    id: 'chicken-grilled',
    name: 'Chicken Grilled',
    price: 560,
    description: 'Flame-grilled and served with chips.',
  },
  {
    id: 'big-sarini-burger',
    name: 'Big Sarini Burger',
    price: 700,
    description: 'Egg, bacon, onions, and mushrooms stacked on our house burger.',
  },
]
