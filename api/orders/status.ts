import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSql } from '../_lib/db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const code = (req.query.code as string | undefined)?.trim().toUpperCase()
    if (!code) {
      res.status(400).json({ error: 'Missing order code' })
      return
    }

    const sql = getSql()
    const rows = await sql`
      SELECT order_code, items, total_price, status, mpesa_receipt, created_at
      FROM orders
      WHERE order_code = ${code}
      LIMIT 1
    `

    if (rows.length === 0) {
      res.status(404).json({ error: 'No order found with that code' })
      return
    }

    const order = rows[0]
    res.status(200).json({
      orderCode: order.order_code,
      items: order.items,
      totalPrice: order.total_price,
      status: order.status,
      mpesaReceipt: order.mpesa_receipt,
      createdAt: order.created_at,
    })
  } catch (err) {
    console.error('order status failed:', err)
    res.status(500).json({ error: 'Could not look up that order right now.' })
  }
}
