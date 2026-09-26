import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export interface CartLine {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartContextValue {
  lines: Record<string, CartLine>
  quantityOf: (id: string) => number
  setQuantity: (item: { id: string; name: string; price: number }, quantity: number) => void
  increment: (item: { id: string; name: string; price: number }) => void
  decrement: (id: string) => void
  clear: () => void
  totalCount: number
  totalPrice: number
  orderedLines: CartLine[]
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Record<string, CartLine>>({})

  function setQuantity(item: { id: string; name: string; price: number }, quantity: number) {
    setLines((prev) => {
      const next = { ...prev }
      if (quantity <= 0) {
        delete next[item.id]
      } else {
        next[item.id] = { id: item.id, name: item.name, price: item.price, quantity }
      }
      return next
    })
  }

  function increment(item: { id: string; name: string; price: number }) {
    setQuantity(item, (lines[item.id]?.quantity ?? 0) + 1)
  }

  function decrement(id: string) {
    const current = lines[id]
    if (!current) return
    setQuantity(current, current.quantity - 1)
  }

  function clear() {
    setLines({})
  }

  const orderedLines = useMemo(() => Object.values(lines), [lines])
  const totalCount = useMemo(
    () => orderedLines.reduce((sum, l) => sum + l.quantity, 0),
    [orderedLines],
  )
  const totalPrice = useMemo(
    () => orderedLines.reduce((sum, l) => sum + l.quantity * l.price, 0),
    [orderedLines],
  )

  function quantityOf(id: string) {
    return lines[id]?.quantity ?? 0
  }

  return (
    <CartContext.Provider
      value={{ lines, quantityOf, setQuantity, increment, decrement, clear, totalCount, totalPrice, orderedLines }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
