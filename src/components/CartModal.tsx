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
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderCode, setOrderCode] = useState<string | null>(null)
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

  async function handleSubmitOrder() {
    setError(null)
    if (phone.replace(/\D/g, '').length < 9) {
      setError('Enter a valid phone number (e.g. 0712345678).')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderedLines.map((l) => ({ id: l.id, name: l.name, price: l.price, quantity: l.quantity })),
          totalPrice,
          phone,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? 'Something went wrong placing your order.')
      }
      setOrderCode(data.orderCode)
      clear()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong placing your order.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    setOrderCode(null)
    setError(null)
    setPhone('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto border border-white/10 bg-charcoal p-6 sm:mx-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl text-cream">
            {orderCode ? 'Order Placed' : 'Your Order'}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="text-2xl leading-none text-cream/50 hover:text-cream"
          >
            ×
          </button>
        </div>

        {orderCode ? (
          <div className="mt-6 text-center">
            <p className="text-cream/70">Your order code is</p>
            <p className="mt-2 font-serif text-4xl tracking-widest text-gold">{orderCode}</p>
            <p className="mt-4 text-sm text-cream/50">
              Save this code — you can check your order status anytime under
              "Track Order". Online payment is coming soon; for now we'll call
              you at {phone} to confirm and arrange payment.
            </p>
            {phoneHref && (
              <a
                href={phoneHref}
                className="mt-6 inline-block border border-gold bg-gold px-6 py-2.5 text-sm text-charcoal transition-colors hover:bg-gold-bright"
              >
                Call Us Now — {business.phone}
              </a>
            )}
          </div>
        ) : orderedLines.length === 0 ? (
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

            <div className="mt-6">
              <label htmlFor="phone" className="text-sm text-cream/60">
                Your phone number
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                placeholder="0712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full border border-white/15 bg-transparent px-4 py-2.5 text-cream placeholder:text-cream/30 focus:border-gold"
              />
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            </div>

            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={submitting}
              className="mt-4 w-full border border-gold bg-gold px-6 py-3 text-sm text-charcoal transition-colors hover:bg-gold-bright disabled:opacity-50"
            >
              {submitting ? 'Placing Order…' : 'Submit Order'}
            </button>

            <p className="mt-4 text-center text-xs text-cream/40">— or —</p>

            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {phoneHref && (
                <a
                  href={phoneHref}
                  className="border border-gold/50 px-5 py-2 text-sm text-gold transition-colors hover:bg-gold/10"
                >
                  Just Call {business.phone}
                </a>
              )}
              <button
                type="button"
                onClick={handleCopy}
                className="border border-gold/50 px-5 py-2 text-sm text-gold transition-colors hover:bg-gold/10"
              >
                {copied ? 'Copied!' : 'Copy Summary'}
              </button>
              <button
                type="button"
                onClick={clear}
                className="px-5 py-2 text-sm text-cream/40 hover:text-cream/70"
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
