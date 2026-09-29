import { useState, type FormEvent } from 'react'
import PaybillInstructions from './PaybillInstructions'

interface OrderLine {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderStatus {
  orderCode: string
  items: OrderLine[]
  totalPrice: number
  status: string
  mpesaReceipt: string | null
  createdAt: string
}

const statusLabels: Record<string, string> = {
  pending_payment: 'Awaiting Payment',
  paid: 'Paid',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function TrackOrder() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderStatus | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    setOrder(null)
    try {
      const res = await fetch(`/api/orders/status?code=${encodeURIComponent(code.trim())}`)
      const text = await res.text()
      let data: (OrderStatus & { error?: string }) | { error?: string } = {}
      try {
        data = JSON.parse(text)
      } catch {
        // Not JSON — fall through to the generic error below.
      }
      if (!res.ok || !('orderCode' in data)) {
        throw new Error(
          ('error' in data && data.error) || 'Could not look up that order right now.',
        )
      }
      setOrder(data as OrderStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order not found.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="track-order" className="border-b border-white/5 px-6 py-20">
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <p className="font-serif text-lg italic text-gold/80">Track Order</p>
          <h2 className="mt-2 font-serif text-3xl text-cream sm:text-4xl">
            Order Tracking
          </h2>
          <p className="mt-4 text-cream/60">
            Enter the order code you received when you placed your order.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
          <input
            type="text"
            placeholder="SB-4K9X2P"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1 border border-white/15 bg-transparent px-4 py-2.5 uppercase tracking-widest text-cream placeholder:text-cream/30 placeholder:normal-case placeholder:tracking-normal focus:border-gold"
          />
          <button
            type="submit"
            disabled={loading}
            className="border border-gold bg-gold px-6 py-2.5 text-sm text-charcoal transition-colors hover:bg-gold-bright disabled:opacity-50"
          >
            {loading ? '...' : 'Track'}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}

        {order && (
          <div className="mt-8 border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg text-gold">{order.orderCode}</span>
              <span className="border border-gold/50 px-3 py-1 text-xs text-gold">
                {statusLabels[order.status] ?? order.status}
              </span>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-cream/70">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.quantity}x {item.name}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-cream/60">Total</span>
              <span className="text-cream">KSh {order.totalPrice.toLocaleString('en-KE')}</span>
            </div>
            {order.mpesaReceipt && (
              <p className="mt-2 text-xs text-cream/40">M-Pesa receipt: {order.mpesaReceipt}</p>
            )}
            {order.status === 'pending_payment' && (
              <div className="mt-4">
                <PaybillInstructions totalPrice={order.totalPrice} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
