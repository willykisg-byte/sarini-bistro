import type { MenuCategory } from '../types'

// NOTE: a few prices on the "Grilled & Platters" page were split across a
// two-column layout that didn't extract cleanly from the source PDF
// (Chicken Curry, Masala, Chicken Burger). Those are marked with
// `description: 'verify price'` below — double check them against the
// printed menu before publishing.

export const menu: MenuCategory[] = [
  {
    id: 'beverages',
    label: 'Beverages',
    tagline: 'Tea, coffee & shakes',
    subgroups: [
      {
        title: 'Tea',
        items: [
          { id: 'black-tea', name: 'Black Tea', price: 80 },
          { id: 'kenya-tea', name: 'Kenya Tea', price: 100 },
          { id: 'herbal-tea', name: 'Herbal Teas', price: 120, description: 'Hibiscus, Sage, Lemongrass, Fenugreek' },
          { id: 'masala-tea', name: 'Masala Tea', price: 120 },
          { id: 'ginger-tea', name: 'Ginger Tea', price: 120 },
          { id: 'dawa', name: 'Dawa', price: 200 },
          { id: 'lemon-tea', name: 'Lemon Tea', price: 150 },
        ],
      },
      {
        title: 'Coffee & Espresso',
        items: [
          { id: 'espresso', name: 'Espresso', price: 150 },
          { id: 'cappuccino', name: 'Cappuccino', price: 250 },
          { id: 'caramel-macchiato', name: 'Caramel Macchiato', price: 280 },
          { id: 'vanilla-latte', name: 'Vanilla Latte', price: 280 },
          { id: 'hazelnut-latte', name: 'Hazelnut Latte', price: 300 },
          { id: 'cafe-mocha', name: 'Café Mocha', price: 250 },
          { id: 'americano', name: 'Americano', price: 200 },
          { id: 'cafe-latte', name: 'Café Latte', price: 250 },
          { id: 'hot-chocolate', name: 'Hot Chocolate', price: 180 },
          { id: 'peppermint-mocha', name: 'Peppermint Mocha', price: 280 },
        ],
      },
      {
        title: 'Iced Teas & Iced Coffee',
        items: [
          { id: 'iced-tea-fresh', name: 'Iced Tea with Fresh Juice', price: 200 },
          { id: 'iced-dawa', name: 'Iced Dawa', price: 200 },
          { id: 'iced-hibiscus', name: 'Iced Hibiscus Tea', price: 200 },
          { id: 'iced-latte', name: 'Iced Latte', price: 350 },
          { id: 'iced-coffee', name: 'Iced Coffee', price: 300 },
          { id: 'iced-mocha', name: 'Iced Mocha', price: 350 },
          { id: 'affogato', name: 'Affogato', price: 250 },
        ],
      },
      {
        title: 'Milkshakes',
        items: [
          { id: 'classic-shake', name: 'Classic Shake', price: 400, description: 'Vanilla, Strawberry, Chocolate, Mango or Pistachio' },
          { id: 'oreo-shake', name: 'Oreo', price: 480 },
          { id: 'neopolitan-shake', name: 'Neopolitan', price: 470 },
          { id: 'pina-colada-shake', name: 'Pina Colada', price: 460 },
          { id: 'mocha-shake', name: 'Mocha', price: 480 },
          { id: 'espresso-shake', name: 'Espresso', price: 500 },
          { id: 'mint-shake', name: 'Mint', price: 450 },
          { id: 'blueberry-shake', name: 'Blueberry', price: 450 },
          { id: 'hazelnut-shake', name: 'Hazelnut', price: 450 },
        ],
      },
    ],
  },
  {
    id: 'juices-water',
    label: 'Juices & Water',
    tagline: 'Fresh juices, sodas & extras',
    subgroups: [
      {
        title: 'Fresh Juices',
        items: [
          { id: 'fresh-juice', name: 'Mango, Pineapple or Passion', price: 150 },
          { id: 'cocktail-juice', name: 'Cocktail', price: 200 },
          { id: 'plastic-soda', name: 'Plastic Soda', price: 130, description: '500ml' },
          { id: 'diet-coke', name: 'Diet Coke', price: 150 },
        ],
      },
      {
        title: 'Water',
        items: [
          { id: 'dasani-1l', name: 'Dasani', price: 120, description: '1 Litre' },
          { id: 'keringet-500', name: 'Keringet', price: 100, description: '500ml' },
          { id: 'keringet-1l', name: 'Keringet', price: 150, description: '1 Litre' },
          { id: 'lemon-water', name: 'Lemon Water', price: 60, description: '1 Litre' },
        ],
      },
      {
        title: 'Extras',
        items: [
          { id: 'honey', name: 'Honey', price: 70 },
          { id: 'tea-bag', name: 'Tea Bag', price: 50 },
          { id: 'hazelnut-syrup', name: 'Hazelnut Syrup', price: 70 },
          { id: 'caramel-syrup', name: 'Caramel Syrup', price: 70 },
          { id: 'vanilla-syrup', name: 'Vanilla Syrup', price: 70 },
        ],
      },
    ],
  },
  {
    id: 'lunch-veg',
    label: 'Lunch & Vegetables',
    tagline: 'Chips, veg plates & traditional greens',
    subgroups: [
      {
        title: 'Chips',
        items: [
          { id: 'chips', name: 'Chips', price: 250 },
          { id: 'masala-chips', name: 'Masala Chips', price: 350 },
          { id: 'spicy-chips', name: 'Spicy Chips', price: 280 },
          { id: 'garlic-spicy-chips', name: 'Garlic Spicy Chips', price: 280 },
          { id: 'bhajia', name: 'Bhajia', price: 400 },
          { id: 'loaded-chips-bacon', name: 'Loaded Chips', price: 500, description: 'Bacon & Cheese' },
          { id: 'loaded-chips-mushroom', name: 'Loaded Chips', price: 550, description: 'Mushroom & Cheese' },
        ],
      },
      {
        title: 'Vegetables',
        items: [
          { id: 'mixed-veg', name: 'Mixed Vegetables', price: 400, description: 'Served with rice or chapati' },
          { id: 'mixed-veg-curry', name: 'Mixed Vegetables Curry', price: 450, description: 'Served with rice or chapati' },
        ],
      },
      {
        title: 'Traditional',
        items: [
          { id: 'suja-kunde-plate', name: 'Suja, Kunde, Miroo, Saga', price: 280, description: 'Served with ugali or chapati' },
          { id: 'sucha-kunde-wimbi', name: 'Sucha / Kunde with Wimbi', price: 300 },
          { id: 'kunde-plate', name: 'Kunde Plate', price: 200 },
          { id: 'sucha-plate', name: 'Sucha Plate', price: 200 },
        ],
      },
    ],
  },
  {
    id: 'chicken-wings',
    label: 'Chicken & Wings',
    tagline: 'Grilled, curried & fried',
    subgroups: [
      {
        title: 'Chicken Wings',
        items: [
          { id: 'bbq-wings-6', name: 'Barbeque Wings', price: 300, description: '6 pcs' },
          { id: 'bbq-wings-12', name: 'Barbeque Wings', price: 600, description: '12 pcs' },
          { id: 'chilli-wings-6', name: 'Sweet Chilli Wings', price: 350, description: '6 pcs' },
          { id: 'chilli-wings-12', name: 'Sweet Chilli Wings', price: 700, description: '12 pcs' },
          { id: 'chilli-wings-18', name: 'Sweet Chilli Wings', price: 1050, description: '18 pcs' },
          { id: 'chilli-wings-24', name: 'Sweet Chilli Wings', price: 1400, description: '24 pcs' },
        ],
      },
      {
        title: 'Chicken',
        items: [
          { id: 'chicken-grilled', name: 'Chicken Grilled', price: 560, description: 'Served with chips' },
          { id: 'chicken-curry', name: 'Chicken Curry (boneless)', price: 580, description: 'verify price' },
          { id: 'chicken-masala', name: 'Chicken Masala', price: 560, description: 'verify price' },
          { id: 'chicken-full-grilled', name: 'Full Chicken Grilled Platter', price: 1600 },
          { id: 'chicken-wet-stew', name: 'Chicken Wet / Stew, Traditional', price: 580 },
          { id: 'chicken-skewers', name: 'Chicken Skewers', price: 400 },
          { id: 'chicken-dry-traditional', name: 'Chicken Dry, Traditional', price: 500 },
        ],
      },
    ],
  },
  {
    id: 'beef-fish',
    label: 'Beef, Fish & Mutton',
    tagline: 'Stews, dry fry & coconut cream',
    subgroups: [
      {
        title: 'Beef & Mutton',
        items: [
          { id: 'beef-stew-wetfry', name: 'Beef', price: 400, description: 'Stew or wet fry' },
          { id: 'mutton', name: 'Mutton', price: 500 },
          { id: 'liver', name: 'Liver', price: 500 },
        ],
      },
      {
        title: 'Fish',
        items: [
          { id: 'fish-dry-fry', name: 'Fish Dry Fry', price: 550 },
          { id: 'fish-wet', name: 'Fish Wet', price: 600 },
          { id: 'fish-coconut-cream', name: 'Fish in Coconut Cream', price: 850 },
          { id: 'fish-fillet', name: 'Fillet', price: 500, description: 'Chips or rice' },
          { id: 'fish-fingers', name: 'Fish Fingers', price: 450 },
        ],
      },
    ],
  },
  {
    id: 'tacos-burgers',
    label: 'Tacos & Burgers',
    tagline: 'Tacos, burritos & burgers',
    subgroups: [
      {
        title: 'Tacos & Burritos',
        items: [
          { id: 'tacos-chicken', name: 'Chicken Tacos', price: 350 },
          { id: 'chicken-burritos', name: 'Chicken Burritos', price: 450 },
          { id: 'beef-burritos', name: 'Beef Burritos', price: 400 },
        ],
      },
      {
        title: 'Burgers',
        items: [
          { id: 'big-sarini-burger', name: 'Big Sarini Burger', price: 700, description: 'Egg, bacon, onions, mushrooms' },
          { id: 'beef-burger', name: 'Beef Burger', price: 550 },
          { id: 'chicken-burger', name: 'Chicken Burger', price: 580, description: 'verify price' },
          { id: 'vegetarian-burger', name: 'Vegetarian Burger', price: 580 },
        ],
      },
    ],
  },
  {
    id: 'grilled-platters',
    label: 'Grilled & Platters',
    tagline: 'Sharing platters & mixed grill',
    subgroups: [
      {
        items: [
          { id: 'mixed-grill', name: 'Mixed Grill', price: 2200, description: 'Choma ribs, chicken skewers, chicken wings, sausages — served with two accompaniments' },
          { id: 'choma-platter-half', name: 'Choma Platter', price: 800, description: '½ kg, one accompaniment of choice' },
          { id: 'choma-platter-full', name: 'Choma Platter', price: 1600, description: '1 kg, one accompaniment of choice' },
          { id: 'full-chicken-wetfry', name: 'Full Chicken Wet Fry Platter', price: 1800 },
        ],
      },
    ],
  },
  {
    id: 'sides',
    label: 'Sides',
    tagline: 'Add to any plate',
    subgroups: [
      {
        items: [
          { id: 'side-cheese', name: 'Cheese', price: 150 },
          { id: 'side-wimbi', name: 'Wimbi', price: 100 },
          { id: 'side-pilau', name: 'Pilau', price: 220 },
          { id: 'side-ugali', name: 'Ugali', price: 80 },
          { id: 'side-roast-potatoes', name: 'Roast Potatoes', price: 220 },
          { id: 'side-rice', name: 'Rice', price: 180 },
        ],
      },
    ],
  },
]
