import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'

interface OrderLine {
  id: string
  name: string
  price: number
  quantity: number
}

interface StaffOrder {
  order_code: string
  items: OrderLine[]
  total_price: number
  customer_phone: string
  status: string
  mpesa_receipt: string | null
  created_at: string
  completed_by: string | null
  completed_at: string | null
}

const STATUSES = [
  { value: 'pending_payment', label: 'Awaiting Payment' },
  { value: 'paid', label: 'Paid' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STORAGE_KEY = 'sarini-staff-key'

function readSavedKey() {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveKey(value: string | null) {
  try {
    if (value) sessionStorage.setItem(STORAGE_KEY, value)
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable — staff will just need to sign in again after a refresh.
  }
}

const NAME_KEY = 'sarini-staff-name'

function readSavedName() {
  try {
    return localStorage.getItem(NAME_KEY) ?? ''
  } catch {
    return ''
  }
}

function saveName(value: string) {
  try {
    localStorage.setItem(NAME_KEY, value)
  } catch {
    // Not critical — staff just retype their name next time.
  }
}

function beep() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.value = 0.15
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  } catch {
    // Sound is a nice-to-have; ignore failures.
  }
}

export default function StaffPage() {
  const [key, setKey] = useState<string | null>(readSavedKey)
  const [input, setInput] = useState('')
  const [orders, setOrders] = useState<StaffOrder[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [newCodes, setNewCodes] = useState<Set<string>>(new Set())
  const knownCodes = useRef<Set<string> | null>(null)

  const signOut = useCallback(() => {
    saveKey(null)
    setKey(null)
    setOrders([])
    setNewCodes(new Set())
    knownCodes.current = null
  }, [])

  const load = useCallback(
    async (password: string, silent = false) => {
      if (!silent) setLoading(true)
      try {
        const res = await fetch('/api/admin/orders', { headers: { 'x-admin-key': password } })
        const text = await res.text()
        let data: { orders?: StaffOrder[]; error?: string } = {}
        try {
          data = JSON.parse(text)
        } catch {
          // Not JSON — handled below.
        }
        if (res.status === 401) {
          signOut()
          setError('Wrong password.')
          return
        }
        if (!res.ok || !data.orders) {
          throw new Error(data.error ?? 'Could not load orders.')
        }
        const list = data.orders
        const known = knownCodes.current
        if (known) {
          const fresh = list.filter((o) => !known.has(o.order_code))
          if (fresh.length > 0) {
            beep()
            setNewCodes((prev) => new Set([...prev, ...fresh.map((o) => o.order_code)]))
          }
        }
        knownCodes.current = new Set(list.map((o) => o.order_code))
        setOrders(list)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load orders.')
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [signOut],
  )

  // Load once signed in, then check for new orders every 15 seconds.
  useEffect(() => {
    if (!key) return
    load(key)
    const id = setInterval(() => load(key, true), 15000)
    return () => clearInterval(id)
  }, [key, load])

  // Keep this page out of search results.
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  // Show the number of new orders in the browser tab title.
  useEffect(() => {
    document.title = newCodes.size > 0 ? `(${newCodes.size} new) Staff — Sarini Bistro` : 'Staff — Sarini Bistro'
  }, [newCodes])

  function handleLogin(e: FormEvent) {
    e.preventDefault()
    if (!input) return
    setError(null)
    saveKey(input)
    setKey(input)
    setInput('')
  }

  async function updateStatus(code: string, status: string) {
    if (!key) return

    // Marking an order completed records who did it.
    let completedBy: string | null = null
    if (status === 'completed') {
      const answer = window.prompt('Who completed this order? Enter staff name:', readSavedName())
      const name = answer?.trim()
      if (!name) return
      completedBy = name.slice(0, 60)
      saveName(completedBy)
    }

    const previous = orders
    setOrders((prev) =>
      prev.map((o) =>
        o.order_code === code
          ? {
              ...o,
              status,
              completed_by: completedBy,
              completed_at: completedBy ? new Date().toISOString() : null,
            }
          : o,
      ),
    )
    setNewCodes((prev) => {
      const next = new Set(prev)
      next.delete(code)
      return next
    })
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({ orderCode: code, status, completedBy }),
      })
      if (!res.ok) throw new Error('failed')
    } catch {
      setOrders(previous)
      setError('Could not update that order. Please try again.')
    }
  }

  async function deleteOrder(code: string) {
    if (!key) return
    if (!window.confirm(`Delete order ${code}? This cannot be undone.`)) return
    const previous = orders
    setOrders((prev) => prev.filter((o) => o.order_code !== code))
    setNewCodes((prev) => {
      const next = new Set(prev)
      next.delete(code)
      return next
    })
    try {
      const res = await fetch('/api/admin/delete-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({ orderCode: code }),
      })
      if (!res.ok) throw new Error('failed')
    } catch {
      setOrders(previous)
      setError('Could not delete that order. Please try again.')
    }
  }

  if (!key) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm border border-white/10 bg-stone p-8">
          <h1 className="font-serif text-2xl text-cream">Staff Sign In</h1>
          <p className="mt-2 text-sm text-cream/50">Sarini Bistro orders</p>
          <input
            type="password"
            placeholder="Staff password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-6 w-full border border-white/15 bg-transparent px-4 py-2.5 text-cream placeholder:text-cream/30 focus:border-gold"
            autoFocus
          />
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="mt-4 w-full border border-gold bg-gold px-6 py-2.5 text-sm text-charcoal transition-colors hover:bg-gold-bright"
          >
            Sign In
          </button>
        </form>
      </main>
    )
  }

  const visible = showAll
    ? orders
    : orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled')

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl text-cream">Orders</h1>
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="border border-white/15 px-3 py-1.5 text-cream/70 hover:text-cream"
          >
            {showAll ? 'Show active only' : 'Show all'}
          </button>
          <button
            type="button"
            onClick={() => load(key)}
            className="border border-white/15 px-3 py-1.5 text-cream/70 hover:text-cream"
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
          <button
            type="button"
            onClick={signOut}
            className="border border-white/15 px-3 py-1.5 text-cream/70 hover:text-cream"
          >
            Sign out
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-cream/40">
        Updates every 15 seconds and beeps when a new order arrives — keep this page open.
      </p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 space-y-4">
        {visible.length === 0 && !loading && (
          <p className="text-cream/50">No {showAll ? '' : 'active '}orders right now.</p>
        )}
        {visible.map((order) => {
          const isNew = newCodes.has(order.order_code)
          return (
            <div
              key={order.order_code}
              className={[
                'border p-5',
                isNew ? 'border-gold bg-gold/10' : 'border-white/10 bg-stone',
              ].join(' ')}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-serif text-xl text-gold">
                  {order.order_code}
                  {isNew && <span className="ml-3 text-xs text-cream">NEW</span>}
                </span>
                <span className="text-xs text-cream/50">
                  {new Date(order.created_at).toLocaleString('en-KE', {
                    timeZone: 'Africa/Nairobi',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-cream/80">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}x {item.name}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-sm">
                <a href={`tel:${order.customer_phone}`} className="text-gold underline underline-offset-4">
                  {order.customer_phone}
                </a>
                <span className="text-cream">KSh {order.total_price.toLocaleString('en-KE')}</span>
              </div>

              {order.status === 'completed' && order.completed_by && (
                <p className="mt-3 text-sm text-olive">
                  Completed by {order.completed_by}
                  {order.completed_at &&
                    ` · ${new Date(order.completed_at).toLocaleTimeString('en-KE', {
                      timeZone: 'Africa/Nairobi',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => updateStatus(order.order_code, s.value)}
                    className={[
                      'border px-3 py-1.5 text-xs transition-colors',
                      order.status === s.value
                        ? 'border-gold bg-gold text-charcoal'
                        : 'border-white/15 text-cream/60 hover:border-gold/60 hover:text-cream',
                    ].join(' ')}
                  >
                    {s.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => deleteOrder(order.order_code)}
                  className="ml-auto border border-red-400/30 px-3 py-1.5 text-xs text-red-400/80 transition-colors hover:bg-red-400/10"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
