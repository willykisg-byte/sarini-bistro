interface Props {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
}

export default function QuantityStepper({ quantity, onIncrement, onDecrement }: Props) {
  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={onIncrement}
        className="border border-gold/50 px-3 py-1 text-xs text-gold transition-colors hover:bg-gold hover:text-charcoal"
      >
        Add
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3 border border-gold/50 px-1">
      <button
        type="button"
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className="px-2 py-1 text-gold transition-colors hover:text-gold-bright"
      >
        −
      </button>
      <span className="w-4 text-center text-sm text-cream">{quantity}</span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label="Increase quantity"
        className="px-2 py-1 text-gold transition-colors hover:text-gold-bright"
      >
        +
      </button>
    </div>
  )
}
