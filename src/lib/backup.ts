import { supabase } from '@/lib/supabase'
import { downloadBlob } from '@/lib/exporters'
import { todayKey } from '@/lib/savingsMath'
type Row = Record<string, unknown>
const TABLES: { name: string; orderBy?: string }[] = [
  { name: 'profiles' }, { name: 'user_settings' }, { name: 'accounts', orderBy: 'id' }, { name: 'categories', orderBy: 'id' }, { name: 'transactions', orderBy: 'id' }, { name: 'budgets', orderBy: 'id' }, { name: 'savings_goals', orderBy: 'id' }, { name: 'savings_entries', orderBy: 'id' }, { name: 'debts', orderBy: 'id' }, { name: 'debt_payments', orderBy: 'id' }, { name: 'wishlist_items', orderBy: 'id' }, { name: 'recurring_items', orderBy: 'id' },
]
const isMissingTable = (e: { code?: string }) => e.code === '42P01' || e.code === 'PGRST205'
async function fetchTable(name: string, orderBy?: string): Promise<Row[]> {
  if (!orderBy) { const { data, error } = await supabase.from(name).select('*'); if (error) throw error; return (data ?? []) as Row[] }
  const PAGE = 1000; const rows: Row[] = []
  for (let start = 0; ; start += PAGE) { const { data, error } = await supabase.from(name).select('*').order(orderBy, { ascending: true }).range(start, start + PAGE - 1); if (error) throw error; rows.push(...((data ?? []) as Row[])); if (!data || data.length < PAGE) break }
  return rows
}
export async function exportAllData() {
  const tables: Record<string, Row[]> = {}; const skipped: string[] = []; const failed: string[] = []; let total = 0
  for (const t of TABLES) { try { const rows = await fetchTable(t.name, t.orderBy); tables[t.name] = rows; total += rows.length } catch (e) { if (isMissingTable(e as { code?: string })) skipped.push(t.name); else failed.push(t.name) } }
  const payload = { app: 'Gawa App', version: 1, exportedAt: new Date().toISOString(), skippedTables: skipped, failedTables: failed, tables }
  downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), `gawa-backup-${todayKey()}.json`)
  return { total, failed }
}