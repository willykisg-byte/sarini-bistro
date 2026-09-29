import { useCallback, useEffect, useState } from 'react'

interface Category {
  id: number
  slug: string
  label: string
  tagline: string | null
  sort_order: number
}

interface Item {
  id: number
  category_id: number
  subgroup: string | null
  name: string
  price: number
  description: string | null
  sort_order: number
}

interface Props {
  staffKey: string
  onAuthError: () => void
}

type CategoryForm = { id: number | null; label: string; tagline: string }
type ItemForm = { id: number | null; subgroup: string; name: string; price: string; description: string }

const emptyCategoryForm: CategoryForm = { id: null, label: '', tagline: '' }
const emptyItemForm: ItemForm = { id: null, subgroup: '', name: '', price: '', description: '' }

export default function StaffMenuEditor({ staffKey, onAuthError }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [categoryForm, setCategoryForm] = useState<CategoryForm | null>(null)
  const [itemForm, setItemForm] = useState<ItemForm | null>(null)

  const call = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': staffKey },
        body: JSON.stringify({ action, ...payload }),
      })
      if (res.status === 401) {
        onAuthError()
        throw new Error('Signed out')
      }
      const text = await res.text()
      let data: Record<string, unknown> = {}
      try {
        data = JSON.parse(text)
      } catch {
        // Non-JSON error page — fall through to generic message below.
      }
      if (!res.ok) {
        throw new Error((data.error as string) ?? 'Something went wrong.')
      }
      return data
    },
    [staffKey, onAuthError],
  )

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/menu', { headers: { 'x-admin-key': staffKey } })
      if (res.status === 401) {
        onAuthError()
        return
      }
      const data = await res.json()
      setCategories(data.categories)
      setItems(data.items)
      setError(null)
      setSelectedCategoryId((prev) => prev ?? data.categories[0]?.id ?? null)
    } catch {
      setError('Could not load the menu.')
    } finally {
      setLoading(false)
    }
  }, [staffKey, onAuthError])

  useEffect(() => {
    load()
  }, [load])

  async function saveCategory(form: CategoryForm) {
    if (!form.label.trim()) return
    try {
      if (form.id === null) {
        await call('create-category', { label: form.label, tagline: form.tagline })
      } else {
        await call('update-category', { id: form.id, label: form.label, tagline: form.tagline })
      }
      setCategoryForm(null)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save category.')
    }
  }

  async function deleteCategory(cat: Category) {
    if (!window.confirm(`Delete "${cat.label}" and everything in it? This cannot be undone.`)) return
    try {
      await call('delete-category', { id: cat.id })
      if (selectedCategoryId === cat.id) setSelectedCategoryId(null)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete category.')
    }
  }

  async function moveCategory(cat: Category, direction: -1 | 1) {
    const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order)
    const index = sorted.findIndex((c) => c.id === cat.id)
    const swapWith = index + direction
    if (swapWith < 0 || swapWith >= sorted.length) return
    const reordered = [...sorted]
    ;[reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]]
    try {
      await call('reorder-categories', { order: reordered.map((c) => c.id) })
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reorder categories.')
    }
  }

  async function saveItem(form: ItemForm) {
    if (!selectedCategoryId || !form.name.trim() || form.price.trim() === '') return
    const price = Number(form.price)
    if (!Number.isFinite(price) || price < 0) {
      setError('Enter a valid price.')
      return
    }
    try {
      if (form.id === null) {
        await call('create-item', {
          categoryId: selectedCategoryId,
          subgroup: form.subgroup,
          name: form.name,
          price,
          description: form.description,
        })
      } else {
        await call('update-item', {
          id: form.id,
          subgroup: form.subgroup,
          name: form.name,
          price,
          description: form.description,
        })
      }
      setItemForm(null)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save item.')
    }
  }

  async function deleteItem(item: Item) {
    if (!window.confirm(`Delete "${item.name}"?`)) return
    try {
      await call('delete-item', { id: item.id })
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete item.')
    }
  }

  async function moveItem(item: Item, direction: -1 | 1) {
    const sameCategory = items
      .filter((i) => i.category_id === item.category_id)
      .sort((a, b) => a.sort_order - b.sort_order)
    const index = sameCategory.findIndex((i) => i.id === item.id)
    const swapWith = index + direction
    if (swapWith < 0 || swapWith >= sameCategory.length) return
    const reordered = [...sameCategory]
    ;[reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]]
    try {
      await call('reorder-items', { order: reordered.map((i) => i.id) })
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reorder items.')
    }
  }

  const sortedCategories = [...categories].sort((a, b) => a.sort_order - b.sort_order)
  const categoryItems = items
    .filter((i) => i.category_id === selectedCategoryId)
    .sort((a, b) => a.sort_order - b.sort_order)
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-serif text-2xl text-cream">Menu Editor</h1>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      {loading && <p className="mt-4 text-cream/50">Loading…</p>}

      {!loading && (
        <div className="mt-6 grid gap-8 sm:grid-cols-[260px_1fr]">
          {/* Categories column */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-wide text-cream/50">Categories</h2>
              <button
                type="button"
                onClick={() => setCategoryForm(emptyCategoryForm)}
                className="text-xs text-gold hover:text-gold-bright"
              >
                + Add
              </button>
            </div>

            <ul className="mt-3 space-y-1">
              {sortedCategories.map((cat, i) => (
                <li key={cat.id}>
                  <div
                    className={[
                      'flex items-center gap-1 border px-2 py-1.5 text-sm',
                      cat.id === selectedCategoryId
                        ? 'border-gold bg-gold/10 text-cream'
                        : 'border-white/10 text-cream/70',
                    ].join(' ')}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className="flex-1 truncate text-left"
                    >
                      {cat.label}
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCategory(cat, -1)}
                      disabled={i === 0}
                      className="px-1 text-cream/40 hover:text-cream disabled:opacity-20"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCategory(cat, 1)}
                      disabled={i === sortedCategories.length - 1}
                      className="px-1 text-cream/40 hover:text-cream disabled:opacity-20"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryForm({ id: cat.id, label: cat.label, tagline: cat.tagline ?? '' })}
                      className="px-1 text-cream/40 hover:text-gold"
                      aria-label="Edit"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCategory(cat)}
                      className="px-1 text-cream/40 hover:text-red-400"
                      aria-label="Delete"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {categoryForm && (
              <div className="mt-4 border border-gold/40 p-3">
                <input
                  type="text"
                  placeholder="Category name"
                  value={categoryForm.label}
                  onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })}
                  className="w-full border border-white/15 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Tagline (optional)"
                  value={categoryForm.tagline}
                  onChange={(e) => setCategoryForm({ ...categoryForm, tagline: e.target.value })}
                  className="mt-2 w-full border border-white/15 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveCategory(categoryForm)}
                    className="border border-gold bg-gold px-3 py-1.5 text-xs text-charcoal hover:bg-gold-bright"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryForm(null)}
                    className="px-3 py-1.5 text-xs text-cream/50 hover:text-cream"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Items column */}
          <div>
            {!selectedCategory ? (
              <p className="text-cream/50">Select a category to manage its items.</p>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-lg text-cream">{selectedCategory.label}</h2>
                  <button
                    type="button"
                    onClick={() => setItemForm(emptyItemForm)}
                    className="text-xs text-gold hover:text-gold-bright"
                  >
                    + Add Item
                  </button>
                </div>

                <ul className="mt-3 space-y-2">
                  {categoryItems.map((item, i) => (
                    <li key={item.id} className="border border-white/10 bg-stone p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          {item.subgroup && (
                            <p className="text-xs text-gold/70">{item.subgroup}</p>
                          )}
                          <p className="text-cream">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-cream/50">{item.description}</p>
                          )}
                        </div>
                        <span className="shrink-0 text-cream/90">
                          KSh {item.price.toLocaleString('en-KE')}
                        </span>
                      </div>
                      <div className="mt-2 flex gap-1 text-xs">
                        <button
                          type="button"
                          onClick={() => moveItem(item, -1)}
                          disabled={i === 0}
                          className="px-2 py-1 text-cream/40 hover:text-cream disabled:opacity-20"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(item, 1)}
                          disabled={i === categoryItems.length - 1}
                          className="px-2 py-1 text-cream/40 hover:text-cream disabled:opacity-20"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setItemForm({
                              id: item.id,
                              subgroup: item.subgroup ?? '',
                              name: item.name,
                              price: String(item.price),
                              description: item.description ?? '',
                            })
                          }
                          className="px-2 py-1 text-cream/60 hover:text-gold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem(item)}
                          className="ml-auto px-2 py-1 text-red-400/70 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                  {categoryItems.length === 0 && (
                    <p className="text-cream/50">No items in this category yet.</p>
                  )}
                </ul>

                {itemForm && (
                  <div className="mt-4 border border-gold/40 p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Subgroup (e.g. Tea) — optional"
                        value={itemForm.subgroup}
                        onChange={(e) => setItemForm({ ...itemForm, subgroup: e.target.value })}
                        className="border border-white/15 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold"
                      />
                      <input
                        type="number"
                        placeholder="Price (KSh)"
                        value={itemForm.price}
                        onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                        className="border border-white/15 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Item name"
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      className="mt-2 w-full border border-white/15 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold"
                      autoFocus
                    />
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      className="mt-2 w-full border border-white/15 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveItem(itemForm)}
                        className="border border-gold bg-gold px-3 py-1.5 text-xs text-charcoal hover:bg-gold-bright"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemForm(null)}
                        className="px-3 py-1.5 text-xs text-cream/50 hover:text-cream"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
