import { useEffect, useState, type FormEvent } from 'react'
import StaffOrders from './staff/StaffOrders'
import StaffMenuEditor from './staff/StaffMenuEditor'

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

export default function StaffPage() {
  const [key, setKey] = useState<string | null>(readSavedKey)
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'orders' | 'menu'>('orders')

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

  function signOut() {
    saveKey(null)
    setKey(null)
  }

  function handleLogin(e: FormEvent) {
    e.preventDefault()
    if (!input) return
    setError(null)
    saveKey(input)
    setKey(input)
    setInput('')
  }

  if (!key) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm border border-white/10 bg-stone p-8">
          <h1 className="font-serif text-2xl text-cream">Staff Sign In</h1>
          <p className="mt-2 text-sm text-cream/50">Sarini Bistro</p>
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

  return (
    <div>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setView('orders')}
            className={[
              'px-3 py-1.5 text-sm',
              view === 'orders' ? 'border border-gold text-gold' : 'text-cream/60 hover:text-cream',
            ].join(' ')}
          >
            Orders
          </button>
          <button
            type="button"
            onClick={() => setView('menu')}
            className={[
              'px-3 py-1.5 text-sm',
              view === 'menu' ? 'border border-gold text-gold' : 'text-cream/60 hover:text-cream',
            ].join(' ')}
          >
            Menu
          </button>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="border border-white/15 px-3 py-1.5 text-sm text-cream/70 hover:text-cream"
        >
          Sign out
        </button>
      </div>

      {view === 'orders' ? (
        <StaffOrders staffKey={key} onAuthError={signOut} />
      ) : (
        <StaffMenuEditor staffKey={key} onAuthError={signOut} />
      )}
    </div>
  )
}
