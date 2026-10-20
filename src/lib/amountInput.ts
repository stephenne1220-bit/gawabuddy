export function applyKey(cur: string, key: string): string {
  if (key === 'back') return cur.slice(0, -1)
  if (key === '.') {
    if (cur.includes('.')) return cur
    return cur === '' ? '0.' : `${cur}.`
  }
  if (cur.includes('.')) {
    const decimals = cur.split('.')[1] ?? ''
    return decimals.length >= 2 ? cur : cur + key
  }
  if (cur.length >= 9) return cur
  if (cur === '0') return key === '0' ? cur : key
  return cur + key
}

export function displayAmount(text: string): string {
  if (!text) return '0'
  const [int, dec] = text.split('.')
  const grouped = (int || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return text.includes('.') ? `${grouped}.${dec ?? ''}` : grouped
}

export function centsToInput(cents: number): string {
  const whole = Math.floor(cents / 100)
  const frac = cents % 100
  if (frac === 0) return String(whole)
  return `${whole}.${String(frac).padStart(2, '0').replace(/0$/, '')}`
}