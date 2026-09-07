import type { MenuCategory } from '../types'

function formatPrice(price: number) {
  return price.toLocaleString('en-KE')
}

interface Props {
  category: MenuCategory
}

export default function MenuSection({ category }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {category.tagline && (
        <p className="mb-10 text-center font-serif text-lg italic text-cream/60">
          {category.tagline}
        </p>
      )}

      <div className="space-y-12">
        {category.subgroups.map((group, i) => (
          <div key={group.title ?? i}>
            {group.title && (
              <h3 className="mb-4 font-serif text-xl text-gold">{group.title}</h3>
            )}
            <ul className="space-y-4">
              {group.items.map((item) => (
                <li key={item.id} className="flex items-baseline">
                  <div>
                    <span className="text-cream">{item.name}</span>
                    {item.description && (
                      <span className="ml-2 text-sm text-cream/50">
                        {item.description === 'verify price' ? '' : item.description}
                      </span>
                    )}
                  </div>
                  <span className="menu-leader" aria-hidden="true" />
                  <span className="font-sans text-cream/90">
                    KSh {formatPrice(item.price)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
