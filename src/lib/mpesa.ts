import { toCents } from '@/lib/money'

export type MpesaParse = {
  code: string | null
  type: 'income' | 'expense'
  amountCents: number
  date: string | null
  merchant: string
  feeCents: number | null
  categoryHint: string | null
}

const AMOUNT = String.raw`(?:Ksh|KES)\.?\s*([\d,]+(?:\.\d{1,2})?)`
const DATE_ON = String.raw`on\s+\d{1,2}\/\d{1,2}\/\d{2,4}`

function titleCase(s: string) {
  return s.toLowerCase().split(' ').filter(Boolean).map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1))).join(' ')
}
const stripPhone = (s: string) => s.replace(/\s+\+?\d{9,13}\s*$/, '').trim()

const HINTS: [RegExp, string][] = [
  [/airtime/i, 'Airtime'],
  [/kenya power|kplc|nairobi water|water|zuku|faiba|electric|dstv|gotv|startimes/i, 'Utilities'],
  [/naivas|carrefour|quickmart|chandarana|tuskys|supermarket|greengrocer|market|butchery/i, 'Food'],
  [/uber|bolt|little cab|matatu|fuel|shell|rubis|total energies|vivo energy|parking/i, 'Transport'],
  [/kfc|java|pizza|restaurant|cafe|coffee|burger|hotel|eatery/i, 'Eating out'],
]

export function parseMpesa(raw: string): MpesaParse | null {
  const text = raw.replace(/\s+/g, ' ').trim()
  if (!text) return null
  const code = text.match(/\b([A-Z0-9]{10})\b(?=\s+confirmed)/i)?.[1]?.toUpperCase() ?? null
  const feeText = text.match(new RegExp(String.raw`transaction cost,?\s*${AMOUNT}`, 'i'))?.[1]
  const feeCents = feeText ? toCents(feeText) : null
  const core = text.replace(new RegExp(String.raw`(?:new\s+)?(?:m-?pesa\s+|account\s+)?balance\s+is\s+${AMOUNT}`, 'i'), '').replace(new RegExp(String.raw`transaction cost,?\s*${AMOUNT}`, 'i'), '')
  const amountText = core.match(new RegExp(AMOUNT, 'i'))?.[1]
  const amountCents = amountText ? toCents(amountText) : null
  if (!amountCents) return null
  const received = /\breceived\b/i.test(core)
  const spent = /\b(sent to|paid to|you bought|withdraw|airtime)\b/i.test(core)
  if (!received && !spent) return null
  let merchant = ''
  if (received) { merchant = core.match(new RegExp(String.raw`from\s+(.+?)\s+${DATE_ON}`, 'i'))?.[1] ?? '' }
  else if (/sent to/i.test(core)) { merchant = core.match(new RegExp(String.raw`sent to\s+(.+?)\s+${DATE_ON}`, 'i'))?.[1] ?? ''; merchant = merchant.split(/\s+for account\b/i)[0] }
  else if (/paid to/i.test(core)) { merchant = core.match(new RegExp(String.raw`paid to\s+(.+?)\.?\s+${DATE_ON}`, 'i'))?.[1] ?? '' }
  else if (/withdraw/i.test(core)) { const agent = core.match(/from\s+(.+?)\s+New\b/i)?.[1] ?? core.match(/from\s+(.+?)$/i)?.[1] ?? ''; merchant = `Withdrawal ${agent.replace(/^\d+\s*-\s*/, '')}`.trim() }
  else if (/airtime/i.test(core)) { merchant = 'Airtime' }
  merchant = titleCase(stripPhone(merchant).replace(/\.$/, ''))
  let date: string | null = null
  const d = core.match(/on\s+(\d{1,2})\/(\d{1,2})\/(\d{2,4})/i)
  if (d) {
    const day = Number(d[1]); const month = Number(d[2]); const year = Number(d[3]) < 100 ? 2000 + Number(d[3]) : Number(d[3])
    const check = new Date(year, month - 1, day)
    if (check.getFullYear() === year && check.getMonth() === month - 1 && check.getDate() === day) { date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` }
  }
  const categoryHint = received ? null : (HINTS.find(([re]) => re.test(`${merchant} ${core}`))?.[1] ?? null)
  return { code, type: received ? 'income' : 'expense', amountCents, date, merchant, feeCents, categoryHint }
}