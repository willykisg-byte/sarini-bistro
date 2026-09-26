import type { MenuCategory } from '../types'
import { useCart } from '../context/CartContext'
import QuantityStepper from './QuantityStepper'

function formatPrice(price: number) {
  return price.toLocaleString('en-KE')
}

interface Props {
  category: MenuCategory
}

export default function MenuSection({ category }: Props) {
  const { quantityOf, increment, decrement } = useCart()

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 pb-32">
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
            <ul className="space-y-2">
              {group.items.map((item) => {
                const quantity = quantityOf(item.id)
                const isOrdered = quantity > 0
                return (
                  <li
                    key={item.id}
                    className={[
                      'flex flex-wrap items-center gap-x-3 gap-y-2 border-l-2 py-2 pl-3 transition-colors',
                      isOrdered ? 'border-gold bg-gold/5' : 'border-transparent',
                    ].join(' ')}
                  >
                    <div className="flex min-w-0 flex-1 items-baseline">
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
                    </div>
                    <QuantityStepper
                      quantity={quantity}
                      onIncrement={() => increment(item)}
                      onDecrement={() => decrement(item.id)}
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
