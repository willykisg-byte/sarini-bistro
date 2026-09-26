import { useCart } from '../context/CartContext'

interface Props {
  onReview: () => void
}

export default function CartBar({ onReview }: Props) {
  const { totalCount, totalPrice } = useCart()

  if (totalCount === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/30 bg-charcoal/95 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="text-sm text-cream/80">
          {totalCount} {totalCount === 1 ? 'item' : 'items'} &nbsp;·&nbsp;{' '}
          <span className="text-cream">KSh {totalPrice.toLocaleString('en-KE')}</span>
        </span>
        <button
          type="button"
          onClick={onReview}
          className="border border-gold bg-gold px-6 py-2 text-sm text-charcoal transition-colors hover:bg-gold-bright"
        >
          Review Order
        </button>
      </div>
    </div>
  )
}
