import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql, generateOrderCode } from '../_lib/db'

interface OrderLine {
  id: string
  name: string
  price: number
  quantity: number
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { items, totalPrice, phone } = req.body as {
    items?: OrderLine[]
    totalPrice?: number
    phone?: string
  }

  if (!items || items.length === 0) {
    res.status(400).json({ error: 'No items in order' })
    return
  }
  if (!totalPrice || totalPrice <= 0) {
    res.status(400).json({ error: 'Invalid total price' })
    return
  }
  if (!phone || phone.replace(/\D/g, '').length < 9) {
    res.status(400).json({ error: 'A valid phone number is required' })
    return
  }

  // Try a few times in the rare case of a code collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const orderCode = generateOrderCode()
    try {
      await sql`
        INSERT INTO orders (order_code, items, total_price, customer_phone, status)
        VALUES (${orderCode}, ${JSON.stringify(items)}, ${totalPrice}, ${phone}, 'pending_payment')
      `
      res.status(201).json({ orderCode, status: 'pending_payment' })
      return
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (!message.includes('duplicate key')) {
        console.error('Failed to create order:', message)
        res.status(500).json({ error: 'Failed to create order' })
        return
      }
      // Duplicate order_code — loop and try a new one.
    }
  }

  res.status(500).json({ error: 'Could not generate a unique order code, please try again' })
}
