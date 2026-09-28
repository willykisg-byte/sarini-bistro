import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSql } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'

const ALLOWED = ['pending_payment', 'paid', 'preparing', 'ready', 'completed', 'cancelled']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }
    if (!requireAdmin(req, res)) return

    const { orderCode, status } = (req.body ?? {}) as { orderCode?: string; status?: string }
    if (!orderCode || !status || !ALLOWED.includes(status)) {
      res.status(400).json({ error: 'Invalid order code or status' })
      return
    }

    const sql = getSql()
    const rows = await sql`
      UPDATE orders
      SET status = ${status}, updated_at = now()
      WHERE order_code = ${orderCode}
      RETURNING order_code, status
    `
    if (rows.length === 0) {
      res.status(404).json({ error: 'Order not found' })
      return
    }
    res.status(200).json(rows[0])
  } catch (err) {
    console.error('admin update failed:', err)
    res.status(500).json({ error: 'Could not update that order right now.' })
  }
}
