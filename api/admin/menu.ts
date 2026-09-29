import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSql } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'

type Body = {
  action?: string
  id?: number
  categoryId?: number
  slug?: string
  label?: string
  tagline?: string
  subgroup?: string
  name?: string
  price?: number
  description?: string
  order?: number[]
}

function slugify(label: string) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!requireAdmin(req, res)) return

    if (req.method === 'GET') {
      const sql = getSql()
      const categories = await sql`
        SELECT id, slug, label, tagline, sort_order FROM categories ORDER BY sort_order
      `
      const items = await sql`
        SELECT id, category_id, subgroup, name, price, description, sort_order
        FROM menu_items ORDER BY category_id, sort_order
      `
      res.status(200).json({ categories, items })
      return
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const body = (req.body ?? {}) as Body
    const sql = getSql()

    switch (body.action) {
      case 'create-category': {
        const label = body.label?.trim()
        if (!label) {
          res.status(400).json({ error: 'Category name is required' })
          return
        }
        const slug = slugify(label) || `category-${Date.now()}`
        const [{ next_order }] = await sql`
          SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM categories
        `
        const rows = await sql`
          INSERT INTO categories (slug, label, tagline, sort_order)
          VALUES (${slug}, ${label}, ${body.tagline?.trim() || null}, ${next_order})
          RETURNING id, slug, label, tagline, sort_order
        `
        res.status(201).json(rows[0])
        return
      }

      case 'update-category': {
        const label = body.label?.trim()
        if (!body.id || !label) {
          res.status(400).json({ error: 'Category id and name are required' })
          return
        }
        const rows = await sql`
          UPDATE categories
          SET label = ${label}, tagline = ${body.tagline?.trim() || null}
          WHERE id = ${body.id}
          RETURNING id, slug, label, tagline, sort_order
        `
        if (rows.length === 0) {
          res.status(404).json({ error: 'Category not found' })
          return
        }
        res.status(200).json(rows[0])
        return
      }

      case 'delete-category': {
        if (!body.id) {
          res.status(400).json({ error: 'Missing category id' })
          return
        }
        await sql`DELETE FROM categories WHERE id = ${body.id}`
        res.status(200).json({ deleted: body.id })
        return
      }

      case 'reorder-categories': {
        if (!Array.isArray(body.order)) {
          res.status(400).json({ error: 'Missing order' })
          return
        }
        for (let i = 0; i < body.order.length; i++) {
          await sql`UPDATE categories SET sort_order = ${i} WHERE id = ${body.order[i]}`
        }
        res.status(200).json({ ok: true })
        return
      }

      case 'create-item': {
        const name = body.name?.trim()
        if (!body.categoryId || !name || body.price === undefined) {
          res.status(400).json({ error: 'Category, name, and price are required' })
          return
        }
        const [{ next_order }] = await sql`
          SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order
          FROM menu_items WHERE category_id = ${body.categoryId}
        `
        const rows = await sql`
          INSERT INTO menu_items (category_id, subgroup, name, price, description, sort_order)
          VALUES (
            ${body.categoryId}, ${body.subgroup?.trim() || null}, ${name},
            ${body.price}, ${body.description?.trim() || null}, ${next_order}
          )
          RETURNING id, category_id, subgroup, name, price, description, sort_order
        `
        res.status(201).json(rows[0])
        return
      }

      case 'update-item': {
        const name = body.name?.trim()
        if (!body.id || !name || body.price === undefined) {
          res.status(400).json({ error: 'Name and price are required' })
          return
        }
        const rows = await sql`
          UPDATE menu_items
          SET subgroup = ${body.subgroup?.trim() || null},
              name = ${name},
              price = ${body.price},
              description = ${body.description?.trim() || null},
              updated_at = now()
          WHERE id = ${body.id}
          RETURNING id, category_id, subgroup, name, price, description, sort_order
        `
        if (rows.length === 0) {
          res.status(404).json({ error: 'Item not found' })
          return
        }
        res.status(200).json(rows[0])
        return
      }

      case 'delete-item': {
        if (!body.id) {
          res.status(400).json({ error: 'Missing item id' })
          return
        }
        await sql`DELETE FROM menu_items WHERE id = ${body.id}`
        res.status(200).json({ deleted: body.id })
        return
      }

      case 'reorder-items': {
        if (!Array.isArray(body.order)) {
          res.status(400).json({ error: 'Missing order' })
          return
        }
        for (let i = 0; i < body.order.length; i++) {
          await sql`UPDATE menu_items SET sort_order = ${i} WHERE id = ${body.order[i]}`
        }
        res.status(200).json({ ok: true })
        return
      }

      default:
        res.status(400).json({ error: 'Unknown action' })
    }
  } catch (err) {
    console.error('admin menu action failed:', err)
    res.status(500).json({ error: 'Could not complete that change right now.' })
  }
}
