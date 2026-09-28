import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSql } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }
    if (!requireAdmin(req, res)) return

    const { orderCode } = (req.body ?? {}) as { orderCode?: string }
    if (!orderCode) {
      res.status(400).json({ error: 'Missing order code' })
      return
    }

    const sql = getSql()
    const rows = await sql`
      DELETE FROM orders
      WHERE order_code = ${orderCode}
      RETURNING order_code
    `
    if (rows.length === 0) {
      res.status(404).json({ error: 'Order not found' })
      return
    }
    res.status(200).json({ deleted: rows[0].order_code })
  } catch (err) {
    console.error('admin delete failed:', err)
    res.status(500).json({ error: 'Could not delete that order right now.' })
  }
}
