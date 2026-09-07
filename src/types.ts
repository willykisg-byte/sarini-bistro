export interface MenuItem {
  id: string
  name: string
  price: number
  /** Optional second price, e.g. a 12pc vs 24pc option */
  priceLabel?: string
  description?: string
}

export interface MenuSubgroup {
  title?: string
  items: MenuItem[]
}

export interface MenuCategory {
  id: string
  label: string
  /** Short line shown under the tab when active */
  tagline?: string
  subgroups: MenuSubgroup[]
}
