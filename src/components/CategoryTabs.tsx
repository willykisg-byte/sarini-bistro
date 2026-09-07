import type { MenuCategory } from '../types'

interface Props {
  categories: MenuCategory[]
  activeId: string
  onSelect: (id: string) => void
}

export default function CategoryTabs({ categories, activeId, onSelect }: Props) {
  return (
    <div className="sticky top-[65px] z-30 -mx-6 overflow-x-auto border-b border-white/5 bg-charcoal/95 px-6 backdrop-blur">
      <div className="mx-auto flex max-w-5xl gap-1">
        {categories.map((category) => {
          const isActive = category.id === activeId
          return (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className={[
                'shrink-0 border-b-2 px-4 py-4 text-sm transition-colors',
                isActive
                  ? 'border-gold text-gold'
                  : 'border-transparent text-cream/60 hover:text-cream',
              ].join(' ')}
            >
              {category.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
