import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSql } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }
    if (!requireAdmin(req, res)) return

    const sql = getSql()
    const orders = await sql`
      SELECT order_code, items, total_price, customer_phone, status, mpesa_receipt, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 100
    `
    res.status(200).json({ orders })
  } catch (err) {
    console.error('admin orders failed:', err)
    res.status(500).json({ error: 'Could not load orders right now.' })
  }
}
