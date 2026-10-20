export type CurrencyCode = 'KES' | 'USD' | 'EUR' | 'GBP' | 'UGX' | 'TZS'

export const CURRENCIES: { code: CurrencyCode; name: string }[] = [
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'UGX', name: 'Ugandan Shilling' },
  { code: 'TZS', name: 'Tanzanian Shilling' },
]

let current: CurrencyCode = 'KES'
export const setCurrency = (c: CurrencyCode) => { current = c }
export const currencyCode = () => current

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: current, currencyDisplay: 'code',
    minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(cents / 100)
}

export function toCents(input: string): number | null {
  const clean = input.replace(/[,\s]/g, '')
  const m = clean.match(/^(\d*)(?:\.(\d{0,2}))?$/)
  if (!m || (m[1] === '' && !m[2])) return null
  return Number(m[1] || '0') * 100 + Number(((m[2] ?? '') + '00').slice(0, 2))
}