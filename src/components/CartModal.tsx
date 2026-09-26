import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { business, telHref } from '../data/business'
import QuantityStepper from './QuantityStepper'

interface Props {
  open: boolean
  onClose: () => void
}

function buildOrderText(lines: { name: string; quantity: number; price: number }[], total: number) {
  const itemLines = lines.map((l) => `${l.quantity}x ${l.name}`).join(', ')
  return `Hi Sarini Bistro, I'd like to order: ${itemLines}. Total: KSh ${total.toLocaleString('en-KE')}`
}

export default function CartModal({ open, onClose }: Props) {
  const { orderedLines, totalPrice, increment, decrement, clear } = useCart()
  const [copied, setCopied] = useState(false)
  const phoneHref = telHref()

  if (!open) return null

  const orderText = buildOrderText(orderedLines, totalPrice)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(orderText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can fail silently on unsupported browsers — no-op.
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto border border-white/10 bg-charcoal p-6 sm:mx-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl text-cream">Your Order</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-cream/50 hover:text-cream"
          >
            ×
          </button>
        </div>

        {orderedLines.length === 0 ? (
          <p className="mt-8 text-cream/60">Nothing in your order yet.</p>
        ) : (
          <>
            <ul className="mt-6 space-y-4">
              {orderedLines.map((line) => (
                <li key={line.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-cream">{line.name}</p>
                    <p className="text-sm text-cream/50">
                      KSh {line.price.toLocaleString('en-KE')} each
                    </p>
                  </div>
                  <QuantityStepper
                    quantity={line.quantity}
                    onIncrement={() => increment(line)}
                    onDecrement={() => decrement(line.id)}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-cream/70">Total</span>
              <span className="font-serif text-xl text-gold">
                KSh {totalPrice.toLocaleString('en-KE')}
              </span>
            </div>

            <p className="mt-6 text-sm text-cream/50">
              Online checkout is coming soon. For now, call to place this order and
              we'll get it started — or copy the summary below to read out or send.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {phoneHref && (
                <a
                  href={phoneHref}
                  className="border border-gold bg-gold px-6 py-2.5 text-sm text-charcoal transition-colors hover:bg-gold-bright"
                >
                  Call {business.phone}
                </a>
              )}
              <button
                type="button"
                onClick={handleCopy}
                className="border border-gold/50 px-6 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
              >
                {copied ? 'Copied!' : 'Copy Order Summary'}
              </button>
              <button
                type="button"
                onClick={clear}
                className="px-6 py-2.5 text-sm text-cream/40 hover:text-cream/70"
              >
                Clear Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
