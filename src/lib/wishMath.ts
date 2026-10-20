import type { Priority, WishItem } from '@/hooks/useWishlist'

export const PRIORITIES: { key: Priority; label: string }[] = [
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
]

const RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

export function sortWish(a: WishItem, b: WishItem) {
  return (
    RANK[a.priority] - RANK[b.priority] ||
    (a.target_date ?? '9999-12-31').localeCompare(b.target_date ?? '9999-12-31') ||
    a.created_at.localeCompare(b.created_at)
  )
}

export function parseUrl(input: string): { ok: boolean; value: string | null } {
  const s = input.trim()
  if (!s) return { ok: true, value: null }
  const withScheme = /^https?:\/\//i.test(s) ? s : `https://${s}`
  try {
    const u = new URL(withScheme)
    if (!u.hostname.includes('.')) return { ok: false, value: null }
    return { ok: true, value: u.toString() }
  } catch {
    return { ok: false, value: null }
  }
}

export function safeUrl(url: string | null) {
  return url && /^https?:\/\//i.test(url) ? url : null
}