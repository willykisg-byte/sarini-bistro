import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSql } from './_lib/db.js'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getSql()
    const rows = await sql`
      SELECT
        c.id AS category_id, c.slug, c.label, c.tagline, c.sort_order AS category_sort,
        i.id AS item_id, i.subgroup, i.name, i.price, i.description, i.sort_order AS item_sort
      FROM categories c
      LEFT JOIN menu_items i ON i.category_id = c.id
      ORDER BY c.sort_order, i.sort_order
    `

    interface Item {
      id: string
      name: string
      price: number
      description?: string
    }
    interface Subgroup {
      title?: string
      items: Item[]
    }
    interface Category {
      id: string
      label: string
      tagline?: string
      subgroups: Subgroup[]
    }

    const categories: Category[] = []
    const categoryByRowId = new Map<number, Category>()
    const subgroupKeyByCategory = new Map<string, Map<string, Subgroup>>()

    for (const row of rows) {
      let category = categoryByRowId.get(row.category_id)
      if (!category) {
        category = {
          id: row.slug,
          label: row.label,
          tagline: row.tagline ?? undefined,
          subgroups: [],
        }
        categories.push(category)
        categoryByRowId.set(row.category_id, category)
        subgroupKeyByCategory.set(row.slug, new Map())
      }

      if (row.item_id === null) continue // category with no items yet

      const subgroups = subgroupKeyByCategory.get(category.id)!
      const key = row.subgroup ?? '\u0000none'
      let subgroup = subgroups.get(key)
      if (!subgroup) {
        subgroup = { title: row.subgroup ?? undefined, items: [] }
        subgroups.set(key, subgroup)
        category.subgroups.push(subgroup)
      }

      subgroup.items.push({
        id: String(row.item_id),
        name: row.name,
        price: row.price,
        description: row.description ?? undefined,
      })
    }

    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=120')
    res.status(200).json({ categories })
  } catch (err) {
    console.error('menu fetch failed:', err)
    res.status(500).json({ error: 'Could not load the menu right now.' })
  }
}
