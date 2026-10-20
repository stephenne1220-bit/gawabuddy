const pad = (n: number) => String(n).padStart(2, '0')

export const fmtDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayKey = () => fmtDay(new Date())

export const monthKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`
export const currentMonthKey = () => monthKey(new Date())

const parts = (key: string) => key.split('-').map(Number) as [number, number, number]

export function shiftMonth(key: string, delta: number) {
  const [y, m] = parts(key)
  return monthKey(new Date(y, m - 1 + delta, 1))
}

export function monthLabel(key: string) {
  const [y, m] = parts(key)
  return new Date(y, m - 1, 1).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })
}

export function monthBounds(key: string) {
  return { from: key, to: shiftMonth(key, 1) }
}

export function formatDay(key: string) {
  const [y, m, d] = parts(key)
  return new Date(y, m - 1, d).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatShort(key: string) {
  const [y, m, d] = parts(key)
  return new Date(y, m - 1, d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })
}